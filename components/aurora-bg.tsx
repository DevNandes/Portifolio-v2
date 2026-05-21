"use client";

/**
 * Full-screen WebGL aurora background (Three.js fragment shader).
 *
 * A single full-viewport plane runs an fbm/domain-warped noise field that
 * flows over time, drifts with scroll (parallax) and brightens around the
 * pointer. Rendering is wrapped in try/catch so the page degrades gracefully
 * when WebGL is unavailable.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/* Flowing aurora / mesh-gradient fragment shader. */
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;
uniform vec2  uRes;
uniform vec3  uBg;
uniform vec3  uBlue;
uniform vec3  uCyan;
uniform vec3  uEmer;

vec2 hash22(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash22(i + vec2(0,0)), f - vec2(0,0)), dot(hash22(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash22(i + vec2(0,1)), f - vec2(0,1)), dot(hash22(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; } return v; }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float aspect = uRes.x / uRes.y;
  vec2 p = uv; p.x *= aspect;
  p.y += uScroll * 0.18;                 // gentle parallax with scroll
  float t = uTime * 0.05 + uScroll * 0.4;

  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(fbm(p * 1.6 + q * 1.5 + vec2(1.7, 9.2) + t * 0.6), fbm(p * 1.6 + q * 1.5 + vec2(8.3, 2.8) - t * 0.5));
  float f = fbm(p * 1.4 + r * 1.4) * 0.5 + 0.5;

  vec2 m = uMouse; m.x *= aspect;
  float md = smoothstep(0.6, 0.0, length(p - m));

  vec3 col = uBg;
  col = mix(col, uBlue, smoothstep(0.2, 0.8, f) * 1.1);
  col = mix(col, uEmer, smoothstep(0.4, 0.88, fbm(p * 2.0 + r)) * 0.9);
  col = mix(col, uCyan, smoothstep(0.55, 1.0, f + length(r) * 0.35) * 0.85);
  float streak = smoothstep(0.78, 1.0, fbm(p * 1.8 + r * 1.2 + vec2(0.0, t * 1.5)));
  col += uCyan * streak * 0.5;
  col += uCyan * md * 0.22;

  float vig = smoothstep(0.15, 1.15, length(uv - 0.5));
  col = mix(col * 0.55, col, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

export function AuroraBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uBg: { value: new THREE.Color(0x04060f) },
      uBlue: { value: new THREE.Color(0x123a8c) },
      uCyan: { value: new THREE.Color(0x22d3ee) },
      uEmer: { value: new THREE.Color(0x0b8a6b) },
    };

    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    let targetScroll = 0;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      targetScroll = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const tMouse = new THREE.Vector2(0.5, 0.5);
    const onMove = (e: PointerEvent) => {
      tMouse.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uScroll.value += (targetScroll - uniforms.uScroll.value) * 0.06;
      uniforms.uMouse.value.x += (tMouse.x - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (tMouse.y - uniforms.uMouse.value.y) * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      mesh.geometry.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
