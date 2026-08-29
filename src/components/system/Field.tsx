import { useEffect, useRef } from "react";
import { ACCENT_DEEP, ACCENT_HOT, decaySurge, fieldState, HERO_ENERGY, setIntro } from "../../lib/field";

// THE FIELD — the site's single continuous surface.
//
// This began as the hero's background and is now the page's. That is the
// whole redesign in one sentence: the shape language does not change between
// sections, the *state* of one continuous system does.
//
// It still refuses to introduce a new vocabulary. The page is built from
// hairlines, right angles and a fixed 80px lattice, so the shader draws that
// lattice and only adds light to it — energy travelling the lines, junctions
// flaring as it passes, and a lens that resolves the grid finer wherever the
// visitor is looking.
//
// What is new is that the light has a dramatic arc. Sections push an energy
// level onto the field bus as they take the viewport, so the page runs calm
// through the hero, hot through the engineering work, drops to almost nothing
// for the latency section — the lights go down so one number is the only lit
// thing on screen — and converges on the middle of the viewport at contact.
// Scroll velocity injects current on top of that: moving through the page is
// what powers it.
//
// Raw WebGL, no scene graph: it is one full-screen fragment shader, and the
// whole bundle is smaller for it.

const CELL_CSS = 80; // must match --cell in index.css

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uCell;
uniform float uNarrow;
uniform float uPointer;
uniform float uPx;
uniform float uEnergy;
uniform float uHero;
uniform float uConverge;
uniform float uIntro;
uniform vec3  uDeep;
uniform vec3  uHot;

#define HERO_E ${HERO_ENERGY.toFixed(4)}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Distance-to-nearest-line mask for a lattice of the given cell size.
// Analytic, so no derivative extension is needed, and crisp because the
// distance is measured in real device pixels.
float lattice(vec2 p, float cell, float w) {
  vec2 c = mod(p, cell);
  vec2 d = min(c, cell - c);
  return max(1.0 - smoothstep(0.0, w, d.x), 1.0 - smoothstep(0.0, w, d.y));
}

// A travelling head with a tail behind it, where d is the signed distance
// from the pixel to the head along the direction of travel.
float comet(float d, float cell) {
  float head = exp(-abs(d) / (cell * 0.30));
  float tail = exp(-max(d, 0.0) / (cell * 3.2));
  return head + tail * 0.45;
}

void main() {
  vec2 frag = gl_FragCoord.xy;

  // gl_FragCoord is bottom-up; the CSS grid is laid out top-down from the
  // viewport origin. The canvas is viewport-fixed, so screen space and
  // lattice space are the same thing and the shader grid stays locked to the
  // CSS one instead of drifting into a moire against it.
  vec2 px = vec2(frag.x, uRes.y - frag.y);
  vec2 uv = frag / uRes;

  float lineW = uPx;

  // Effective drive. Below the hero's calibrated level the whole field dims
  // toward black (this is what makes the blackout section land); above it,
  // brightness keeps climbing past 1. At exactly HERO_E the factor is 1.0,
  // so the opening frame is bit-for-bit what it always was.
  float e = uEnergy;
  float bright = (e < HERO_E) ? mix(0.06, 1.0, e / HERO_E) : 1.0 + (e - HERO_E) * 0.55;

  // --- structure ---------------------------------------------------------
  // Minor lattice matches the background grid; a major line every fifth cell
  // gives the field the hierarchy of a drafting sheet rather than graph paper.
  float minor = lattice(px, uCell, lineW);
  float major = lattice(px, uCell * 5.0, lineW * 1.3);

  vec2 c = mod(px, uCell);
  vec2 dn = min(c, uCell - c);
  float node = 1.0 - smoothstep(0.0, 5.0 * uPx, length(dn));

  // --- cursor ------------------------------------------------------------
  float md = length(frag - uMouse);
  float lens = pow(1.0 - smoothstep(0.0, uRes.y * 0.55, md), 2.0) * uPointer;
  float lensTight = pow(1.0 - smoothstep(0.0, uRes.y * 0.26, md), 2.0) * uPointer;

  // The lattice subdivides under the pointer — the grid resolves into finer
  // detail exactly where the visitor is looking. Subdividing rather than
  // displacing means it stays registered with the background grid instead of
  // ghosting against it.
  float sub = lattice(px, uCell * 0.25, lineW * 0.8);

  // --- traffic -----------------------------------------------------------
  // Pulses run along the lines themselves, turning the lattice into something
  // carrying load rather than a lit decoration. Indices come from the grid so
  // a pulse always rides an actual line. Energy opens more lanes and drives
  // them faster; at HERO_E the thresholds are the hero's original 0.70/0.76.
  float hIdx = floor(px.y / uCell + 0.5);
  float vIdx = floor(px.x / uCell + 0.5);
  float hMask = 1.0 - smoothstep(0.0, lineW * 1.5, abs(px.y - hIdx * uCell));
  float vMask = 1.0 - smoothstep(0.0, lineW * 1.5, abs(px.x - vIdx * uCell));

  float rate = 1.0 + (e - HERO_E) * 0.9;
  float traffic = 0.0;

  float hh = hash(vec2(hIdx, 11.0));
  if (hh > mix(0.80, 0.52, e)) {
    float span = uRes.x + uCell * 12.0;
    float head = fract(uTime * (0.10 + hh * 0.16) * rate + hh * 7.31) * span - uCell * 6.0;
    traffic += hMask * comet(head - px.x, uCell);
  }

  float vh = hash(vec2(vIdx, 29.0));
  if (vh > mix(0.86, 0.58, e)) {
    float span = uRes.y + uCell * 12.0;
    float head = fract(uTime * (0.09 + vh * 0.14) * rate + vh * 3.77) * span - uCell * 6.0;
    // Screen-space y, so a vertical pulse falls the way the page scrolls.
    traffic += vMask * comet(head - (uRes.y - px.y), uCell);
  }
  traffic = min(traffic, 1.6);

  // Boot. The field used to be fully lit before the first character of the
  // name had moved, so the page's whole idea — a system carrying current —
  // was already over by the time anyone looked at it. The structure now
  // resolves first and the current only starts flowing once it has, in step
  // with the headline rising. Nothing here runs after the first second.
  float boot = smoothstep(0.0, 0.55, uIntro);
  traffic *= smoothstep(0.42, 1.0, uIntro);

  // --- masks -------------------------------------------------------------
  // Hero composition, preserved: the headline corner stays calm so the type
  // never competes with the field, and the field dissolves before the type
  // rather than stopping at a section edge.
  float calm = mix(
    0.22, 1.0,
    smoothstep(0.18, 0.72, uv.x) * mix(0.35, 1.0, smoothstep(0.05, 0.55, uv.y))
  );
  float narrowMask = smoothstep(0.40, 0.92, uv.y);
  float heroMask = mix(calm, narrowMask, uNarrow) * smoothstep(0.08, 0.42, uv.y);

  // Page composition: quieter and even, because content now sits on top of
  // the field everywhere rather than beside it. A slow large-scale drift
  // keeps different parts of the scroll at different densities so it never
  // reads as wallpaper.
  float drift = 0.5 + 0.5 * sin(uv.x * 2.1 + uv.y * 1.4 - uTime * 0.06);
  float pageMask = mix(0.34, 0.62, drift);

  float mask = mix(pageMask, heroMask, uHero);

  // Depth: the lattice falls away toward the edges instead of ending flat.
  vec2 vigCenter = mix(vec2(0.5, 0.5), vec2(0.66, 0.62), uHero);
  float vig = 1.0 - smoothstep(0.30, 1.05, length((uv - vigCenter) * vec2(1.15, 1.0)) * 1.25);
  mask *= mix(0.50, 1.0, vig);

  // --- convergence -------------------------------------------------------
  // Contact: the field gathers on the middle of the viewport, so the closing
  // section reads as the system arriving somewhere rather than fading out.
  float aspect = uRes.x / max(uRes.y, 1.0);
  float cd = length((uv - vec2(0.5, 0.52)) * vec2(aspect, 1.0)) / max(aspect, 1.0);
  float gather = pow(1.0 - smoothstep(0.0, 0.85, cd), 2.6) * uConverge;

  // A slow breath so the field is never completely static, kept low enough
  // that the pulses remain the thing that actually reads as movement.
  float breathe = 0.5 + 0.5 * sin((uv.x * 1.2 - uv.y * 0.7) * 2.4 - uTime * 0.10);
  float ambient = 0.16 + breathe * 0.30;

  float lit = clamp(mask * ambient * bright + lens * 0.85 + gather * 0.34, 0.0, 1.6);

  // Colour carries the energy: deep ember where the field is only structure,
  // full signal where a pulse, the cursor or the convergence is lighting it.
  vec3 col = mix(uDeep, uHot, clamp(lit * 0.70 + traffic * 0.80 + gather * 0.35, 0.0, 1.0));

  float a =
      minor * lit * 0.26
    + major * lit * 0.44
    + node  * lit * 0.70
    + sub   * lensTight * 0.14
    + traffic * mask * 0.50 * bright
    // Junctions flare as a pulse crosses them.
    + node * traffic * mask * 0.85 * bright
    + node * gather * 0.30;

  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0) * boot);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    // No WebGL is not an error state — the CSS lattice underneath and the
    // type on top are still a complete page without it.
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uCell = u("uCell");
    const uNarrow = u("uNarrow");
    const uPointer = u("uPointer");
    const uPx = u("uPx");
    const uEnergy = u("uEnergy");
    const uHero = u("uHero");
    const uConverge = u("uConverge");
    const uIntro = u("uIntro");

    gl.uniform3fv(u("uDeep"), ACCENT_DEEP);
    gl.uniform3fv(u("uHot"), ACCENT_HOT);

    // Additive: the field only ever adds light over the ground beneath it.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;

    let raf = 0;
    let hidden = document.hidden;
    let dprCap = isTouch ? 1.5 : 2;
    let dpr = 1;
    let mx = -9999;
    let my = -9999;
    let tx = -9999;
    let ty = -9999;
    let pointer = 0;
    let pointerTarget = 0;
    let energy = fieldState.energy;
    let converge = 0;
    let hero = 1;
    let last = 0;

    // Adaptive quality. A full-viewport fragment shader is cheap arithmetic,
    // but "cheap" is relative to the GPU it lands on — if frames slip, drop
    // resolution a step rather than shipping a stuttering page.
    let frames = 0;
    let accum = 0;

    const resize = () => {
      const w = Math.max(1, Math.round(window.innerWidth * dpr));
      const h = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uCell, CELL_CSS * dpr);
      gl.uniform1f(uPx, dpr);
      gl.uniform1f(uNarrow, window.innerWidth < 768 ? 1 : 0);
    };

    const applyDpr = () => {
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      resize();
    };

    const render = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0.016;
      last = time;

      decaySurge(dt);

      // Scroll motion adds current on top of whatever the section asked for.
      const target = Math.min(fieldState.energy + fieldState.surge * 0.45, 1.15);
      // Energy eases slowly so section changes read as the room dimming, not
      // as a switch being flipped.
      energy += (target - energy) * Math.min(dt * 2.2, 1);
      converge += (fieldState.converge - converge) * Math.min(dt * 2.0, 1);
      hero += (fieldState.hero - hero) * Math.min(dt * 3.0, 1);

      if (isTouch) {
        // No pointer on a phone — but the previous fallback drifted the lens
        // along a Lissajous figure, a light wandering on a sine wave that
        // answered to nothing the visitor did. The desktop lens means "the
        // field resolves where you are looking"; the honest translation of
        // that to touch is the reader's own position in the document, which
        // the scroll loop already reports.
        //
        // The lens tracks down the viewport as the page advances and drifts
        // gently across it, so it stays ahead of the content being read
        // rather than orbiting it.
        const p = fieldState.scroll;
        const targetX = (0.5 + 0.22 * Math.sin(p * Math.PI * 3.0)) * canvas.width;
        const targetY = (0.86 - 0.62 * ((p * 2.4) % 1)) * canvas.height;
        if (tx < -1000) {
          mx = targetX;
          my = targetY;
        }
        tx = targetX;
        ty = targetY;
        mx += (tx - mx) * 0.06;
        my += (ty - my) * 0.06;
        // Brighter under a finger-flick: the surge already carries velocity,
        // so a fast scroll opens the lens as well as the lattice.
        pointer = 0.38 + fieldState.surge * 0.3;
      } else {
        mx += (tx - mx) * 0.12;
        my += (ty - my) * 0.12;
        pointer += (pointerTarget - pointer) * 0.06;
      }

      gl.uniform1f(uTime, time * 0.001);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uPointer, pointer);
      gl.uniform1f(uEnergy, energy);
      gl.uniform1f(uConverge, converge);
      gl.uniform1f(uHero, hero);
      gl.uniform1f(uIntro, fieldState.intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (dprCap > 1) {
        accum += dt;
        if (++frames >= 90) {
          if (accum / frames > 0.021) {
            dprCap = dprCap > 1.5 ? 1.5 : 1;
            applyDpr();
          }
          frames = 0;
          accum = 0;
        }
      }
    };

    const loop = (time: number) => {
      render(time);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || prefersReduced || hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (ev: MouseEvent) => {
      const x = ev.clientX * dpr;
      const y = (window.innerHeight - ev.clientY) * dpr;
      if (tx < -1000) {
        mx = x;
        my = y;
      }
      tx = x;
      ty = y;
      pointerTarget = 1;
    };

    const onLeave = () => {
      pointerTarget = 0;
    };

    const onResize = () => {
      applyDpr();
      if (prefersReduced) render(0);
    };

    const onVisibility = () => {
      hidden = document.hidden;
      hidden ? stop() : start();
    };

    applyDpr();

    if (prefersReduced) {
      // A single still frame at the hero's calibrated level: the page keeps
      // its surface, nothing on it moves. The boot ramp is normally driven by
      // the hero's intro timeline, which does not run here — so land it at
      // full drive directly, or the one frame we draw would be a black one.
      setIntro(1);
      render(0);
    } else {
      start();
      if (!isTouch) {
        window.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseleave", onLeave);
      }
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const onLost = (ev: Event) => {
      ev.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* The CSS lattice the shader is registered to. Both are viewport-fixed
          at the same 80px pitch, so they sit exactly on top of one another
          and the shader reads as light *on* this grid rather than a second
          grid beside it. It is also the whole background when WebGL is
          unavailable. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,237,230,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(240,237,230,0.035) 1px, transparent 1px)",
          backgroundSize: "var(--cell) var(--cell)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
