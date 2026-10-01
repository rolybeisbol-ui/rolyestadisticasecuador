/* 06-eventos.js (público) · los eventos de administrador viajan en el código protegido */
document.addEventListener('click',e=>{const q=s=>e.target.closest(s);let a;
 if(a=q('[data-x]')||(e.target.id=='m'&&{}))return $('#m').classList.remove('on');
 if(a=q('[data-v]'))return(view=a.dataset.v,draw());if(a=q('[data-sub]'))return(sub=a.dataset.sub,draw());
 if(a=q('th[data-s]')){const[i,c]=a.dataset.s.split('|'),s=SORT[i];SORT[i]=s&&s[0]==c?[c,-s[1]]:[+c,-1];return draw()}
 if(a=q('[data-p]'))return prof(a.dataset.p);if(a=q('tr[data-t]'))return(tm=+a.dataset.t,view='ind',draw())});
document.addEventListener('change',async e=>{const t=e.target;
 if(t.id=='js')return use(+t.value);if(t.id=='ts'){tm=+t.value;draw()}
 if(t.id=='ls')return useLeague(t.value);
 if(['mb','mi','mt'].includes(t.id)){CFG[t.id]=+t.value;await kv('put','cfg',CFG);draw()}});
