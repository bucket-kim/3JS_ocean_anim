import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Color
const debugObj = {};
debugObj.depthColor = "#186691";
debugObj.surfaceColor = "#9bd8ff";

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWaveAnimation: {
      value: 0.25,
    },
    uBigWaveFrequency: {
      value: new THREE.Vector2(4, 1.5),
    },
    uBigWaveSpeed: {
      value: 0.75,
    },

    uSmallWaveElevation: {
      value: 0.15,
    },
    uSmallWaveFrequency: {
      value: 3.0,
    },
    uSmallWaveSpeed: {
      value: 0.2,
    },
    uSmallWaveIteration: {
      value: 4.0,
    },

    uDepthColor: {
      value: new THREE.Color(debugObj.depthColor),
    },
    uSurfaceColor: {
      value: new THREE.Color(debugObj.surfaceColor),
    },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 3.5 },
  },
});

gui
  .add(waterMaterial.uniforms.uBigWaveAnimation, "value")
  .min(0)
  .max(1.0)
  .step(0.001)
  .name("u Big Wave Anim");
gui
  .add(waterMaterial.uniforms.uBigWaveFrequency.value, "x")
  .min(0)
  .max(10.0)
  .step(0.001)
  .name("u Big Wave Freq X");
gui
  .add(waterMaterial.uniforms.uBigWaveFrequency.value, "y")
  .min(0)
  .max(10.0)
  .step(0.001)
  .name("u Big Wave Freq Y");
gui
  .add(waterMaterial.uniforms.uBigWaveSpeed, "value")
  .min(0)
  .max(4.0)
  .step(0.001)
  .name("u Big Wave Speed");

gui
  .add(waterMaterial.uniforms.uSmallWaveElevation, "value")
  .min(0)
  .max(1.0)
  .step(0.001)
  .name("u Small Wave Elevation");
gui
  .add(waterMaterial.uniforms.uSmallWaveFrequency, "value")
  .min(0)
  .max(30.0)
  .step(0.001)
  .name("u Small Wave Frequency");
gui
  .add(waterMaterial.uniforms.uSmallWaveSpeed, "value")
  .min(0)
  .max(4.0)
  .step(0.001)
  .name("u Small Wave Speed");
gui
  .add(waterMaterial.uniforms.uSmallWaveIteration, "value")
  .min(0)
  .max(5.0)
  .step(1)
  .name("u Small Wave Iteration");

gui.addColor(debugObj, "depthColor").onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(debugObj.depthColor);
});
gui.addColor(debugObj, "surfaceColor").onChange(() => {
  waterMaterial.uniforms.uSurfaceColor.value.set(debugObj.surfaceColor);
});
gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1.0)
  .step(0.001)
  .name("uColorOffset");
gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(5.0)
  .step(0.001)
  .name("uColorMultiplier");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update water
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
