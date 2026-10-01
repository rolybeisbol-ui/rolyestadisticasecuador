/* 04-tablas.js */
function tbl(id,cols,rows,attr){const s=SORT[id];if(s)rows=[...rows].sort((a,b)=>{let x=cols[s[0]].v(a),y=cols[s[0]].v(b);if(typeof x=='string')return s[1]*x.localeCompare(y);x=isFinite(x)?x:-1e9;y=isFinite(y)?y:-1e9;return s[1]*(x-y)});
 return`<div class="w"><table><thead><tr>${cols.map((c,i)=>`<th data-s="${id}|${i}">${c.h}${s&&s[0]==i?(s[1]>0?' ▲':' ▼'):''}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr ${attr?attr(r):''}>${cols.map(c=>`<td>${c.f?c.f(r):fi(c.v(r))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
const nm=r=>`${av(r.k,r.n)}${r.n}`,N=(h,k,f)=>({h,v:r=>r[k],f:f&&(r=>f(r[k]))}),pa=r=>`data-p="${r.k}"`;
