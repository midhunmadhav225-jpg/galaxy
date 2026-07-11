// three-scene.js — lightweight Three.js scene that renders a rotating product-like cylinder
// If Three.js is not available, the script exits gracefully.
(function(){
  if(typeof THREE === 'undefined') return;
  const container = document.querySelector('.product-wrap');
  if(!container) return;

  // create renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.borderRadius = getComputedStyle(document.querySelector('.product-img'))?.borderRadius || '12px';

  // place the canvas before the picture so the picture can act as fallback
  container.insertBefore(renderer.domElement, container.firstChild);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 80);

  // lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(0, 50, 50);
  scene.add(dir);

  // geometry that resembles a can (cylinder)
  const geometry = new THREE.CylinderGeometry(16, 16, 36, 64);
  const material = new THREE.MeshStandardMaterial({ color: 0xd3f0ee, metalness: 0.4, roughness: 0.35 });
  const can = new THREE.Mesh(geometry, material);
  can.rotation.x = Math.PI * 0.05;
  scene.add(can);

  // small label (thin box)
  const labelGeo = new THREE.BoxGeometry(24, 10, 0.5);
  const labelMat = new THREE.MeshStandardMaterial({ color: 0x042022 });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.set(0, 0, 17);
  can.add(label);

  // gentle floor for shadow
  const floorMat = new THREE.ShadowMaterial({ opacity: 0.12 });
  const floorGeo = new THREE.PlaneGeometry(300, 300);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.y = -30;
  scene.add(floor);

  // enable shadows
  renderer.shadowMap.enabled = true;
  dir.castShadow = true;
  can.castShadow = true;
  can.receiveShadow = true;

  function onResize(){
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let raf;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(){
    if(prefersReduced) return; // do not animate if user prefers reduced motion
    can.rotation.y += 0.008;
    can.rotation.x = 0.05 + Math.sin(Date.now() * 0.0006) * 0.02;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  animate();

  // Expose a destroy hook if the main script needs it
  window.__threeScene = { renderer, scene, camera, stop: ()=>{ if(raf) cancelAnimationFrame(raf); renderer.dispose(); } };
})();
