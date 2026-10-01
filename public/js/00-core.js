/* 00-core.js */
let D,HIST={},J=0,IM={},LIGAS={},LID='',IMS={},CFG={mb:22,mi:11,mt:15},view='pos',sub='o',tm=0,SORT={};
const $=s=>document.querySelector(s),f3=x=>isFinite(x)?x.toFixed(3).replace(/^0(?=\.)/,''):'-',f2=x=>isFinite(x)?x.toFixed(2):'-',fi=x=>isFinite(x)?x:'-';
const ip=o=>Math.floor(o/3)+'.'+o%3,ini=n=>n.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('');
