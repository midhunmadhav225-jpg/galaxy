// script.js — Interaction and 3D parallax for the hero product
// - Adds reveal animations for elements with .reveal
// - Adds a subtle 3D tilt/parallax effect to the product image with id="product"
// - Respects prefers-reduced-motion
(function(){
  'use strict';

  // Utility: respect reduced motion
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  function setupReveal(){
    const els = document.querySelectorAll('.reveal');
    if(!els.length) return;
    if(reduced){
      els.forEach(e => e.classList.add('reveal--visible'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('reveal--visible');
          obs.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    els.forEach(e => io.observe(e));
  }

  // 3D tilt / parallax for the hero product
  function setupTilt(){
    const container = document.querySelector('.product-wrap');
    const img = document.getElementById('product');
    if(!container || !img) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    let frame = null;
    let mouseX = 0, mouseY = 0, tx = 0, ty = 0;

    function updateSize(){ width = container.clientWidth; height = container.clientHeight; }
    window.addEventListener('resize', updateSize, {passive:true});

    function onMove(x,y){
      // calculate percent offset from center (-0.5 .. 0.5)
      const px = (x / width) - 0.5;
      const py = (y / height) - 0.5;
      // target rotation degrees
      const rotY = px * 10; // rotate around Y
      const rotX = -py * 10; // rotate around X
      const translateZ = 30 + Math.abs(px*20 + py*20);
      tx = rotX; ty = rotY;
      // apply transform
      img.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${translateZ}px)`;
      img.classList.add('is-tilting');
    }

    // Smoothly reset to neutral
    function reset(){ img.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(20px)'; }

    if(reduced) return; // do not attach listeners if user prefers reduced motion

    // Mouse moves inside the container
    container.addEventListener('mousemove', (ev)=>{
      const rect = container.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      if(frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(()=> onMove(x,y));
    }, {passive:true});

    container.addEventListener('mouseleave', ()=>{
      if(frame) cancelAnimationFrame(frame);
      img.classList.remove('is-tilting');
      // gentle reset
      img.style.transition = 'transform 600ms cubic-bezier(.2,.9,.2,1)';
      reset();
      setTimeout(()=> img.style.transition = '', 700);
    });

    // Touch: use deviceorientation for nicer effect on phones if available
    if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function'){
      // iOS 13+ requires permission; don't aggressively request it here
    } else if(window.DeviceOrientationEvent){
      window.addEventListener('deviceorientation', (ev)=>{
        if(ev.beta==null) return;
        // map device tilt to small rotations
        const rotX = Math.max(-15, Math.min(15, -ev.beta/2));
        const rotY = Math.max(-15, Math.min(15, ev.gamma/2));
        img.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(30px)`;
      }, {passive:true});
    }

    // set an initial gentle pop
    img.style.transform = 'translateZ(20px)';
  }

  // Tabs interaction in Experience section
  function setupTabs(){
    const tabs = document.querySelectorAll('.experience .tab');
    const panels = document.querySelectorAll('.experience .tab-desc');
    if(!tabs.length || !panels.length) return;
    tabs.forEach(t => t.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      t.classList.add('active');
      const id = t.getAttribute('data-tab');
      const panel = document.querySelector(`.tab-desc[data-panel="${id}"]`);
      if(panel) panel.classList.add('active');
    }));
  }

  // If the image fails to load (placeholder fallback), remove tilt listeners gracefully
  function handleImageFallback(){
    const img = document.getElementById('product');
    if(!img) return;
    img.addEventListener('error', ()=>{
      const container = document.querySelector('.product-wrap');
      if(container){ container.classList.add('no-tilt'); }
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setupReveal();
    setupTilt();
    setupTabs();
    handleImageFallback();

    // small accessibility enhancement: ensure focus outlines on keyboard navigation
    document.body.addEventListener('keydown', (e)=>{
      if(e.key === 'Tab') document.documentElement.classList.add('show-focus');
    });
  });
})();
