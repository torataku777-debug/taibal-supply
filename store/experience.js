/* Progressive enhancement: all content remains readable without motion or JavaScript. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  function animate(el, frames, options) {
    if (reduced.matches || !el.animate) return;
    const a = el.animate(frames, options); animations.add(a);
    a.finished.catch(() => {}).finally(() => animations.delete(a));
  }
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting) return;
      animate(target, [{opacity:0,transform:'translateY(26px)'},{opacity:1,transform:'none'}], {duration:760,easing:'cubic-bezier(.2,.7,.2,1)'});
      reveal.unobserve(target);
    });
  }, {threshold:0.08});
  document.querySelectorAll('.shop-product,.section-heading,.craft-copy,.craft-photo,.story-grid>div,.story-chapter,.story-counter-photo,.story-editorial-photo,.closing-section>.wrap,.detail-copy').forEach(el=>reveal.observe(el));
  document.querySelectorAll('.hero-copy>*,.story-page>h1,.story-intro').forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:850,delay:Math.min(i,6)*70,easing:'ease-out',fill:'backwards'}));
  const moving = [...document.querySelectorAll('.hero-scene,.story-feature-photo img,.story-counter-photo img')];
  const progress = document.querySelector('.reading-progress span');
  const chapters = [...document.querySelectorAll('.story-chapter')];
  let queued=false;
  function updateScroll() {
    queued=false;
    if (progress) {
      const max=document.documentElement.scrollHeight-innerHeight;
      progress.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;
    }
    moving.forEach(img=>{
      if(reduced.matches){img.style.transform='';return;}
      const box=img.parentElement.getBoundingClientRect();
      if(box.bottom<0 || box.top>innerHeight)return;
      const shift=Math.max(-14,Math.min(14,(innerHeight/2-box.top-box.height/2)*.035));
      img.style.transform=`translateY(${shift}px) scale(1.035)`;
    });
    let current=chapters[0];
    chapters.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.55)current=el;});
    document.querySelectorAll('.story-chapters a').forEach(a=>{
      if(current && a.hash==='#'+current.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
    });
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(updateScroll);}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);updateScroll();
  reduced.addEventListener('change',()=>{animations.forEach(a=>a.cancel());schedule();});
  document.querySelectorAll('[data-gallery]').forEach(gallery=>{
    const main=gallery.querySelector('[data-gallery-main]');
    const thumbs=[...gallery.querySelectorAll('[data-gallery-src]')];
    const count=gallery.querySelector('[data-gallery-count]');
    const dialog=gallery.querySelector('dialog');
    let current=0, request=0;
    async function select(index){
      const ticket=++request;
      index=(index+thumbs.length)%thumbs.length;
      const button=thumbs[index];
      const preload=new Image();preload.src=button.dataset.gallerySrc;
      gallery.setAttribute('aria-busy','true');
      try{await preload.decode();}catch{if(ticket===request){count.textContent='画像を読み込めませんでした。再度お試しください。';gallery.removeAttribute('aria-busy');}return;}
      if(ticket!==request)return;
      current=index;main.src=preload.src;main.alt=button.dataset.galleryAlt;
      thumbs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
      count.textContent=`${index+1} / ${thumbs.length}`;gallery.removeAttribute('aria-busy');
      animate(main,[{opacity:.35,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:360,easing:'ease-out'});
    }
    thumbs.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
    gallery.querySelector('[data-gallery-prev]').addEventListener('click',()=>select(current-1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click',()=>select(current+1));
    gallery.querySelector('.gallery-zoom').addEventListener('click',()=>{const img=dialog.querySelector('img');img.src=main.src;img.alt=main.alt;dialog.showModal();});
    gallery.querySelector('[data-gallery-close]').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    gallery.addEventListener('keydown',e=>{if(dialog.open)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(current+(e.key==='ArrowRight'?1:-1));}});
    let startX=null,startY=null;
    main.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;startY=e.touches[0].clientY;},{passive:true});
    main.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;startX=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)select(current+(dx<0?1:-1));},{passive:true});
  });
})();
