const n=document.querySelector('.nav'),h=document.querySelector('.hero');
const s=()=>n.classList.toggle('solid',scrollY>(h?h.offsetHeight-120:10)||!h);s();addEventListener('scroll',s,{passive:true});
document.querySelector('.burger').onclick=()=>{n.classList.toggle('open');n.classList.add('solid')};
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll('.rv,.draw').forEach(el=>io.observe(el));