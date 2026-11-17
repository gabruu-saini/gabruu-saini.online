/**
 * Active Purple Pulsar Star & Footer Black-Hole Horizon Engine
 * For Ashween Singh Saini (Gabruu.Saini) — gabruu-saini.online
 *
 * 1. Hero: WebGL2 Pulsar Star & Twin Relativistic Synchrotron Jets (with 2D fallback)
 * 2. Footer: Reflect-Style Purple Black-Hole Horizon Dome (#footer-blackhole-canvas)
 *    - Gravitational singularity obsidian core (#030014)
 *    - Luminous white-lavender photon sphere (#F5F3FF -> #C4B5FD)
 *    - Swirling violet/magenta/teal accretion rings & orbiting starlight particles
 *    - Semicircular horizon clipping at bottom divider line
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX_DPR = 1.5;

  // Global Visibility Tracking for Battery & Performance
  let isTabPaused = false;
  document.addEventListener('visibilitychange', () => {
    isTabPaused = document.hidden;
  });

  // ==========================================================================
  // 1. HERO ACTIVE PURPLE PULSAR STAR (WebGL2 + Shader)
  // ==========================================================================
  (function initHeroPulsar() {
    const canvas = document.getElementById('pulsar-canvas');
    if (!canvas) return;

    let gl = null;
    let program = null;
    let isWebGL2 = false;
    let animFrameId = null;
    let startTime = performance.now();

    // Mouse & Scroll Parallax
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const vsSource = `#version 300 es
    in vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
    `;

    const fsSource = `#version 300 es
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_scroll;

    out vec4 fragColor;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float stars(vec2 uv, float t) {
      float s = 0.0;
      vec2 g1 = uv * 95.0;
      vec2 id1 = floor(g1);
      float h1 = hash(id1);
      if (h1 > 0.982) {
        float twinkle = sin(t * 2.8 + h1 * 6.28) * 0.5 + 0.5;
        vec2 f1 = fract(g1) - 0.5;
        s += smoothstep(0.08, 0.0, length(f1)) * twinkle * 0.7;
      }
      vec2 g2 = uv * 48.0 + vec2(23.7, 71.3);
      vec2 id2 = floor(g2);
      float h2 = hash(id2);
      if (h2 > 0.991) {
        float twinkle = sin(t * 3.6 + h2 * 6.28) * 0.5 + 0.5;
        vec2 f2 = fract(g2) - 0.5;
        s += smoothstep(0.12, 0.0, length(f2)) * twinkle * 1.15;
      }
      return s;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

      vec2 mouseOffset = (u_mouse - 0.5) * 0.10;
      float scrollOffset = u_scroll * 0.00025;
      uv += mouseOffset;
      uv.y += scrollOffset;

      float t = u_time * 0.6;

      vec3 cVoid         = vec3(0.012, 0.0, 0.078);      // #030014
      vec3 cDeepPlum     = vec3(0.043, 0.027, 0.165);    // #0B072A
      vec3 cRoyalPurple  = vec3(0.298, 0.114, 0.584);    // #4C1D95
      vec3 cElectricPurp = vec3(0.486, 0.227, 0.929);    // #7C3AED
      vec3 cBrightViolet = vec3(0.545, 0.361, 0.965);    // #8B5CF6
      vec3 cSoftLavender = vec3(0.769, 0.710, 0.992);    // #C4B5FD
      vec3 cStarWhite    = vec3(0.961, 0.953, 1.0);      // #F5F3FF
      vec3 cCyanTeal     = vec3(0.169, 0.443, 0.502);    // #2B7180
      vec3 cBrightTeal   = vec3(0.569, 0.730, 0.757);    // #91BAC1

      vec2 corePos = vec2(0.0, 0.14);
      vec2 p = uv - corePos;
      float r = length(p);

      vec3 col = mix(cVoid, cDeepPlum, clamp(exp(-r * 1.8) * 0.7, 0.0, 1.0));

      // Twin Relativistic Jets
      float baseAngle = 0.837; // ~48 deg
      float precession = sin(t * 0.35) * 0.11 + cos(t * 0.7) * 0.04;
      float jetAngle = baseAngle + precession;

      vec2 jetDir = vec2(cos(jetAngle), sin(jetAngle));
      vec2 jetNormal = vec2(-jetDir.y, jetDir.x);

      float dParallel = dot(p, jetDir);
      float dPerp = abs(dot(p, jetNormal));
      float distAlong = abs(dParallel);

      float beamWaist = 0.010 + distAlong * 0.045;
      float beamProfile = exp(-(dPerp * dPerp) / (2.0 * beamWaist * beamWaist));
      float beamFalloff = exp(-distAlong * 0.65);

      float spineProfile = exp(-dPerp * 150.0) * exp(-distAlong * 0.9);

      float knotDir = sign(dParallel);
      float knotPhase = distAlong * 22.0 - knotDir * t * 4.5;
      float knots = (sin(knotPhase) * 0.5 + 0.5);
      float knotNoise = noise(vec2(distAlong * 6.0 - knotDir * t * 2.2, dPerp * 18.0));
      float streamingPlasma = knots * (0.6 + 0.4 * knotNoise) * beamProfile * beamFalloff;

      float sheathPhase = distAlong * 30.0 + dPerp * 45.0 - knotDir * t * 3.2;
      float shockWisps = smoothstep(0.65, 1.0, sin(sheathPhase)) * exp(-dPerp * 45.0) * beamFalloff;

      vec3 jetCol = vec3(0.0);
      jetCol += cRoyalPurple * beamProfile * beamFalloff * 0.85;
      jetCol += cElectricPurp * streamingPlasma * 1.2;
      jetCol += cBrightViolet * spineProfile * 1.4;
      jetCol += cSoftLavender * pow(spineProfile, 2.0) * 0.9;
      jetCol += cBrightTeal * shockWisps * 0.45;
      jetCol += cCyanTeal * shockWisps * 0.35;

      float lateralGlow = exp(-dPerp * 12.0) * exp(-distAlong * 0.8);
      jetCol += cRoyalPurple * lateralGlow * 0.35;

      col += jetCol;

      // Magnetic Field Rings
      float loopDist = length(vec2(dParallel * 1.9, dPerp * 0.9));
      float ringPattern = abs(sin(loopDist * 28.0 - t * 0.8));
      float magneticRings = smoothstep(0.92, 1.0, ringPattern) * exp(-loopDist * 4.5);
      col += cElectricPurp * magneticRings * 0.28;
      col += cCyanTeal * magneticRings * exp(-loopDist * 6.0) * 0.18;

      // Ultra-Luminous Pulsar Core
      float starPulse = 1.0 + 0.06 * sin(t * 12.0) * cos(t * 5.0);
      float coreSingularity = exp(-r * 45.0 * starPulse);
      float coreInner       = exp(-r * 16.0);
      float coreMid         = exp(-r * 6.5);
      float coronaOuter     = exp(-r * 2.3);

      col += cStarWhite * coreSingularity * 1.6;
      col += cSoftLavender * coreInner * 1.2;
      col += cElectricPurp * coreMid * 0.95;
      col += cRoyalPurple * coronaOuter * 0.70;

      // Downward Horizon Rim Glow onto Showcase Window
      float rimGlow = exp(-abs(uv.y - (corePos.y - 0.28)) * 4.2) * exp(-abs(uv.x) * 1.9);
      col += cBrightViolet * rimGlow * 0.22;
      col += cBrightTeal * rimGlow * 0.12;

      // Twinkling Starfield
      col += vec3(stars(uv, u_time));

      float vig = smoothstep(1.35, 0.45, length(uv));
      col = mix(cVoid, col, vig);
      col = pow(col, vec3(0.96));

      fragColor = vec4(col, 1.0);
    }
    `;

    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn('Pulsar WebGL2 Shader Error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function initGL() {
      try {
        gl = canvas.getContext('webgl2', {
          alpha: false,
          depth: false,
          stencil: false,
          antialias: false,
          powerPreference: 'high-performance'
        });
        if (!gl) return false;

        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return false;

        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
          -1.0,  1.0,  1.0, -1.0,  1.0,  1.0
        ]), gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        return true;
      } catch (e) {
        return false;
      }
    }

    let uResLoc, uTimeLoc, uMouseLoc, uScrollLoc;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      if (isWebGL2 && gl) {
        gl.viewport(0, 0, width, height);
      }
    }

    function renderWebGL(now) {
      if (isTabPaused) return;

      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      const elapsed = prefersReducedMotion ? 1.0 : (now - startTime) * 0.001;

      gl.useProgram(program);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uMouseLoc, currentMouseX, 1.0 - currentMouseY);
      gl.uniform1f(uScrollLoc, currentScrollY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameId = requestAnimationFrame(renderWebGL);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', e => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    }, { passive: true });
    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && isWebGL2) {
        startTime = performance.now();
        animFrameId = requestAnimationFrame(renderWebGL);
      } else if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    });

    resize();
    if (initGL()) {
      isWebGL2 = true;
      uResLoc = gl.getUniformLocation(program, 'u_resolution');
      uTimeLoc = gl.getUniformLocation(program, 'u_time');
      uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
      uScrollLoc = gl.getUniformLocation(program, 'u_scroll');
      animFrameId = requestAnimationFrame(renderWebGL);
    }
  })();

  // ==========================================================================
  // 2. FOOTER REFLECT-STYLE PURPLE BLACK-HOLE HORIZON DOME
  // ==========================================================================
  (function initFooterBlackHole() {
    const canvas = document.getElementById('footer-blackhole-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId = null;
    let startTime = performance.now();

    // Procedural Starlight Particles orbiting the accretion disk
    const particles = [];
    const NUM_PARTICLES = 42;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        baseRadius: 110 + Math.random() * 160,
        radialOffset: (Math.random() - 0.5) * 15,
        angle: Math.PI + Math.random() * Math.PI, // upper semicircle
        angularSpeed: (0.15 + Math.random() * 0.35) * (Math.random() > 0.5 ? 1 : 1),
        size: 0.8 + Math.random() * 1.6,
        alpha: 0.3 + Math.random() * 0.7,
        twinkleRate: 1.5 + Math.random() * 2.5
      });
    }

    function resizeBlackHole() {
      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : 380;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      const targetW = Math.floor(width * dpr);
      const targetH = Math.floor(height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    }

    function renderBlackHole(now) {
      if (isTabPaused) return;

      const t = prefersReducedMotion ? 1.0 : (now - startTime) * 0.001;
      const w = canvas.width;
      const h = canvas.height;

      // Black Hole Center is anchored precisely on the bottom boundary
      const cx = w * 0.5;
      const cy = h; // y = bottom edge

      // Dynamic responsive scale
      const scale = Math.min(w / (1000 * Math.min(window.devicePixelRatio || 1, MAX_DPR)), 1.15) * Math.min(window.devicePixelRatio || 1, MAX_DPR);

      ctx.clearRect(0, 0, w, h);

      // Clip strictly to upper semicircle/stage (y <= cy)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, cy);
      ctx.clip();

      // 1. Wide Gravitational Lensing Bloom (Violet -> Void)
      const maxHaloRadius = Math.max(w * 0.55, 380 * scale);
      const outerBloom = ctx.createRadialGradient(cx, cy, 70 * scale, cx, cy, maxHaloRadius);
      outerBloom.addColorStop(0, 'rgba(124, 58, 237, 0.45)');
      outerBloom.addColorStop(0.18, 'rgba(139, 92, 246, 0.32)');
      outerBloom.addColorStop(0.40, 'rgba(76, 29, 149, 0.20)');
      outerBloom.addColorStop(0.65, 'rgba(21, 43, 53, 0.10)');
      outerBloom.addColorStop(1, 'rgba(3, 0, 20, 0)');

      ctx.fillStyle = outerBloom;
      ctx.beginPath();
      ctx.arc(cx, cy, maxHaloRadius, Math.PI, 2 * Math.PI);
      ctx.fill();

      // 2. Swirling Accretion Disk (Concentric/Elliptical Plasma Bands)
      const rotAngle = prefersReducedMotion ? 0 : t * 0.35;
      const pulse = 1.0 + Math.sin(t * 1.8) * 0.04;

      // Outer Accretion Torus (Cyan-Teal & Soft Violet Wisps)
      const rOuter = 240 * scale * pulse;
      const gradOuter = ctx.createRadialGradient(cx, cy, rOuter - 35 * scale, cx, cy, rOuter + 35 * scale);
      gradOuter.addColorStop(0, 'rgba(124, 58, 237, 0)');
      gradOuter.addColorStop(0.5, 'rgba(145, 186, 193, 0.22)');
      gradOuter.addColorStop(1, 'rgba(76, 29, 149, 0)');
      ctx.fillStyle = gradOuter;
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter + 35 * scale, Math.PI, 2 * Math.PI);
      ctx.fill();

      // Mid Relativistic Torus (Electric Violet & Deep Magenta)
      const rMid = 180 * scale * pulse;
      const gradMid = ctx.createRadialGradient(cx, cy, rMid - 28 * scale, cx, cy, rMid + 28 * scale);
      gradMid.addColorStop(0, 'rgba(124, 58, 237, 0)');
      gradMid.addColorStop(0.3, 'rgba(168, 85, 247, 0.45)');
      gradMid.addColorStop(0.7, 'rgba(124, 58, 237, 0.55)');
      gradMid.addColorStop(1, 'rgba(76, 29, 149, 0)');
      ctx.fillStyle = gradMid;
      ctx.beginPath();
      ctx.arc(cx, cy, rMid + 28 * scale, Math.PI, 2 * Math.PI);
      ctx.fill();

      // Inner Hot Relativistic Flow (Specular Lavender & Indigo)
      const rInner = 142 * scale * pulse;
      const gradInner = ctx.createRadialGradient(cx, cy, rInner - 18 * scale, cx, cy, rInner + 18 * scale);
      gradInner.addColorStop(0, 'rgba(196, 181, 253, 0)');
      gradInner.addColorStop(0.5, 'rgba(196, 181, 253, 0.75)');
      gradInner.addColorStop(0.8, 'rgba(124, 58, 237, 0.45)');
      gradInner.addColorStop(1, 'rgba(76, 29, 149, 0)');
      ctx.fillStyle = gradInner;
      ctx.beginPath();
      ctx.arc(cx, cy, rInner + 18 * scale, Math.PI, 2 * Math.PI);
      ctx.fill();

      // Dynamic Swirling Accretion Arcs with Relativistic Doppler Asymmetry
      const arcLayers = [
        { r: 215 * scale, width: 3.5, color: 'rgba(145, 186, 193, 0.35)', dash: [40, 25], speed: 0.6 },
        { r: 175 * scale, width: 4.5, color: 'rgba(168, 85, 247, 0.55)', dash: [60, 30], speed: 0.9 },
        { r: 145 * scale, width: 5.0, color: 'rgba(196, 181, 253, 0.65)', dash: [50, 20], speed: 1.2 },
        { r: 125 * scale, width: 4.0, color: 'rgba(245, 243, 255, 0.85)', dash: [80, 40], speed: 1.5 }
      ];

      arcLayers.forEach((arc) => {
        ctx.save();
        ctx.lineWidth = arc.width * scale;
        ctx.strokeStyle = arc.color;
        ctx.setLineDash(arc.dash.map(d => d * scale));
        ctx.lineDashOffset = -t * arc.speed * 40 * scale;
        ctx.beginPath();
        ctx.arc(cx, cy, arc.r, Math.PI, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Orbiting Starlight Particles (Lensed around event horizon)
      particles.forEach(p => {
        if (!prefersReducedMotion) {
          p.angle += p.angularSpeed * 0.008;
          if (p.angle > 2 * Math.PI) {
            p.angle = Math.PI;
          }
        }

        const currentR = (p.baseRadius + p.radialOffset * Math.sin(t * 2.0)) * scale;
        const px = cx + currentR * Math.cos(p.angle);
        const py = cy + currentR * Math.sin(p.angle);

        // Only draw particles above the horizon line
        if (py <= cy) {
          const twinkle = Math.sin(t * p.twinkleRate + p.baseRadius) * 0.4 + 0.6;
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 243, 255, ${p.alpha * twinkle})`;
          ctx.fill();
        }
      });

      // 4. Luminous Photon Sphere Ring (#F5F3FF -> #C4B5FD)
      const rPhoton = 112 * scale;

      // Glow halo around photon sphere
      ctx.save();
      ctx.shadowColor = 'rgba(196, 181, 253, 0.9)';
      ctx.shadowBlur = 18 * scale;
      ctx.lineWidth = 3.5 * scale;
      ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, rPhoton, Math.PI, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();

      // Sharp crisp core photon rim
      ctx.lineWidth = 2.0 * scale;
      ctx.strokeStyle = 'rgba(245, 243, 255, 1.0)';
      ctx.beginPath();
      ctx.arc(cx, cy, rPhoton, Math.PI, 2 * Math.PI);
      ctx.stroke();

      // 5. Pitch-Obsidian Gravitational Singularity Core (#030014)
      const rEventHorizon = 106 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, rEventHorizon, Math.PI, 2 * Math.PI);
      ctx.fillStyle = '#030014';
      ctx.fill();

      ctx.restore(); // end clip

      animFrameId = requestAnimationFrame(renderBlackHole);
    }

    window.addEventListener('resize', resizeBlackHole, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        startTime = performance.now();
        animFrameId = requestAnimationFrame(renderBlackHole);
      } else if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    });

    resizeBlackHole();
    animFrameId = requestAnimationFrame(renderBlackHole);
  })();

})();
