/* Kaas hero: day-to-night loop built from the single skyline photo (no extra assets). */
(()=>{
const hero=document.querySelector('.hero[data-sky]');if(!hero)return;
const img=hero.querySelector('img');const cv=document.createElement('canvas');cv.className='hero-canvas';cv.setAttribute('aria-hidden','true');img.after(cv);
const ctx=cv.getContext('2d');const mobile=matchMedia('(max-width:760px)').matches;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const capture=/[?&]capture/.test(location.search);
const LOOP=24000,WORK=mobile?760:1400,NG=mobile?6:12;
let W0,H0,base,skyMask,skyTmp,groups=[],ready=false;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
function prep(){
  W0=WORK;H0=Math.round(img.naturalHeight*WORK/img.naturalWidth);
  const src=document.createElement('canvas');src.width=W0;src.height=H0;const sc=src.getContext('2d');sc.drawImage(img,0,0,W0,H0);
  const d=sc.getImageData(0,0,W0,H0).data,N=W0*H0,L=new Float32Array(N);
  for(let i=0;i<N;i++)L[i]=(0.2126*d[i*4]+0.7152*d[i*4+1]+0.0722*d[i*4+2])/255;
  // skyline: first strong edge / non-sky pixel scanning down each column
  let sky=new Float32Array(W0);const lim=Math.round(H0*.62);
  for(let x=0;x<W0;x++){let y=2,miss=0;for(;y<lim;y++){const i=y*W0+x,p=i*4,r=d[p],b=d[p+2];
    const ok=b>r*1.06&&L[i]<.42&&Math.abs(L[i]-L[i-W0*2>0?i-W0*2:i])<.045;if(!ok){if(++miss>2)break}else miss=0;}sky[x]=y-3;}
  const s2=Float32Array.from(sky);for(let x=2;x<W0-2;x++){const a=[sky[x-2],sky[x-1],sky[x],sky[x+1],sky[x+2]].sort((p,q)=>p-q);s2[x]=a[2]}sky=s2;
  skyMask=document.createElement('canvas');skyMask.width=W0;skyMask.height=H0;const mc=skyMask.getContext('2d'),md=mc.createImageData(W0,H0);
  base=document.createElement('canvas');base.width=W0;base.height=H0;const bc=base.getContext('2d'),bd=bc.createImageData(W0,H0);
  const gd=[];for(let g=0;g<NG;g++){gd.push(new ImageData(W0,H0))}
  const gA=new Float32Array(N);const t0=mobile?.50:.44,t1=mobile?.78:.72;
  for(let y=0;y<H0;y++)for(let x=0;x<W0;x++){const i=y*W0+x,p=i*4,r=d[p],g=d[p+1],b=d[p+2],l=L[i];
    md.data[p+3]=255*(1-sm(sky[x]-4,sky[x]+1,y));
    let a=0;if(y>sky[x]+2){a=sm(t0,t1,l)*((r+g)*.5>b*.85?1:.35);if(r>g*1.6&&r>80)a=Math.max(a,.85)}
    // base: pull light pixels down to a dark facade tone (lights "off")
    const k2=a>0?(1-a)+a*Math.min(1,.10/Math.max(l,.01)):1;
    bd.data[p]=r*k2;bd.data[p+1]=g*k2;bd.data[p+2]=b*k2*1.04;bd.data[p+3]=255;
    if(a>0){gA[i]=a;const G=((Math.floor(x/7)*73856093)^(Math.floor(y/5)*19349663))>>>0;const o=gd[G%NG].data;
      o[p]=Math.min(255,r*1.05+12);o[p+1]=Math.min(255,g*1.0+6);o[p+2]=b*.9;o[p+3]=255*a;}
  }
  mc.putImageData(md,0,0);bc.putImageData(bd,0,0);
  const bl=document.createElement('canvas');bl.width=W0;bl.height=H0;const blc=bl.getContext('2d');blc.filter='blur(5px)';blc.drawImage(base,0,0);
  const bb=blc.getImageData(0,0,W0,H0).data,fd=bc.getImageData(0,0,W0,H0);
  for(let i=0;i<N;i++){const a=Math.min(1,gA[i]*1.6);if(a>0){const p=i*4;for(let c=0;c<3;c++)fd.data[p+c]=fd.data[p+c]*(1-a)+Math.min(bb[p+c],fd.data[p+c]+40)*a}}
  bc.putImageData(fd,0,0);
  groups=gd.map((g,n)=>{const c=document.createElement('canvas');c.width=W0;c.height=H0;c.getContext('2d').putImageData(g,0,0);
    const h=document.createElement('canvas');h.width=W0;h.height=H0;const hc=h.getContext('2d');hc.filter=`blur(${mobile?2:3}px)`;hc.drawImage(c,0,0);
    return {c,h,ph:Math.random()*6.283,f:.6+Math.random()*1.4,on:n/NG};});
  skyTmp=document.createElement('canvas');skyTmp.width=W0>>1;skyTmp.height=H0>>1;
  ready=true;size();
}
// keyframes: [t, brightness, saturate, contrast, skyTop, skyBottom, skyA, tint, tintA, lights]
const K=[[0,1.9,.55,.9,'#8db3d8','#e2ecf2',.9,'#a9c0d6',.32,0],[.16,1.9,.55,.9,'#8db3d8','#e2ecf2',.9,'#a9c0d6',.32,0],
[.30,1.45,.9,.95,'#5b7ea8','#f0b07a',.82,'#ffb36b',.40,.04],[.42,1.08,1,1,'#1e2b55','#b9675a',.6,'#6b5ac8',.2,.5],
[.52,.8,1.05,1.08,'#050a1a','#1a2948',.72,'#0f1f48',.34,1],[.84,.8,1.05,1.08,'#050a1a','#1a2948',.72,'#0f1f48',.34,1],
[.93,1.3,.85,.95,'#4f72a0','#e7b48c',.78,'#f2a76a',.30,.08],[1,1.9,.55,.9,'#8db3d8','#e2ecf2',.9,'#a9c0d6',.32,0]];
const hx=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)),mix=(a,b,u)=>a+(b-a)*u;
const mixc=(a,b,u)=>{a=hx(a);b=hx(b);return `rgb(${a.map((v,i)=>Math.round(mix(v,b[i],u))).join(',')})`};
function params(t){let i=0;while(t>K[i+1][0])i++;const A=K[i],B=K[i+1];const u=sm(0,1,(t-A[0])/(B[0]-A[0]));
  return {b:mix(A[1],B[1],u),s:mix(A[2],B[2],u),c:mix(A[3],B[3],u),st:mixc(A[4],B[4],u),sb:mixc(A[5],B[5],u),sa:mix(A[6],B[6],u),ti:mixc(A[7],B[7],u),ta:mix(A[8],B[8],u),L:mix(A[9],B[9],u)}}
let crop=[0,0,1,1];
function size(){const dpr=Math.min(devicePixelRatio||1,mobile?1.25:1.5);const w=hero.clientWidth,h=hero.clientHeight;
  cv.width=Math.min(Math.round(w*dpr),mobile?800:1700);cv.height=Math.round(cv.width*h/w);
  const ar=cv.width/cv.height,iar=W0/H0;let sw=W0,sh=H0;if(ar>iar)sh=W0/ar;else sw=H0*ar;
  sw/=1.05;sh/=1.05;crop=[(W0-sw)/2,(H0-sh)*.55,sw,sh];}
function render(t){if(!ready)return;const P=params(t),W=cv.width,H=cv.height;
  const dx=Math.sin(t*6.2832)*crop[2]*.012,dy=Math.cos(t*6.2832)*crop[3]*.006;const C=[crop[0]+dx,crop[1]+dy,crop[2],crop[3]];
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.filter=`brightness(${P.b}) saturate(${P.s}) contrast(${P.c})`;
  ctx.drawImage(base,...C,0,0,W,H);ctx.filter='none';
  const sc=skyTmp.getContext('2d');sc.globalCompositeOperation='source-over';const g=sc.createLinearGradient(0,0,0,skyTmp.height*.6);
  g.addColorStop(0,P.st);g.addColorStop(1,P.sb);sc.fillStyle=g;sc.fillRect(0,0,skyTmp.width,skyTmp.height);
  sc.globalCompositeOperation='destination-in';sc.drawImage(skyMask,0,0,skyTmp.width,skyTmp.height);
  ctx.globalAlpha=P.sa;ctx.drawImage(skyTmp,C[0]/2,C[1]/2,C[2]/2,C[3]/2,0,0,W,H);
  ctx.globalAlpha=P.ta;ctx.globalCompositeOperation='soft-light';ctx.fillStyle=P.ti;ctx.fillRect(0,0,W,H);
  if(P.L>0.001){ctx.globalCompositeOperation='lighter';const sec=t*LOOP/1000;
    for(const q of groups){let a=sm(q.on*.55,q.on*.55+.45,P.L);if(a<=0)continue;
      const night=sm(.8,1,P.L);a*=1-night*(.10+.10*Math.sin(sec*q.f+q.ph)*Math.sin(sec*q.f*.37+q.ph*2));
      ctx.globalAlpha=a*.55;ctx.drawImage(q.h,...C,0,0,W,H);ctx.globalAlpha=a;ctx.drawImage(q.c,...C,0,0,W,H);}}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
window.__sky={render:t=>render(t),ready:()=>ready};
function go(){prep();img.style.visibility='hidden';
  if(reduce){render(.47);addEventListener('resize',()=>{size();render(.47)});return}
  if(capture)return;let st=performance.now();
  const loop=n=>{if(hero.getBoundingClientRect().bottom>0)render(((n-st)%LOOP)/LOOP);requestAnimationFrame(loop)};requestAnimationFrame(loop);
  addEventListener('resize',size);}
img.complete&&img.naturalWidth?go():img.addEventListener('load',go);
})();
