/* 03-imagenes.js */
const fb=(c,n)=>`this.outerHTML='<span class=${c}>${ini(n)}</span>'`;
const av=(k,n,cls='av')=>IM['P:'+k]?`<img class="${cls}" src="${IM['P:'+k]}">`:`<img class="${cls}" loading="lazy" src="assets/${LID}/players/${k.replace('|','-')}.jpg" onerror="${fb(cls,n)}">`;
const lg=c=>`<img class="lg" src="${IM['T:'+c]||'assets/'+LID+'/logos/'+c+'.png'}" onerror="this.remove()">`;
function hdr(){$('#ls').innerHTML=Object.keys(LIGAS).map(i=>`<option value="${i}" ${i==LID?'selected':''}>${LIGAS[i].n}</option>`).join('');$('#js').innerHTML=jk().map(j=>`<option value="${j}" ${j==J?'selected':''}>Jornada ${j}</option>`).join('');const l=$('#hl');l.onerror=()=>l.hidden=true;l.hidden=false;l.src=IM.L||'assets/'+LID+'/liga.png';$('#ht').textContent=LIGAS[LID]?LIGAS[LID].n:D.league}

/* Portadas de cada sección: franja con imagen (subida por el administrador) o ilustración por defecto. Solo lleva el título, nunca cifras. */
const MEDIA='/.netlify/functions/media',HERO={pos:['Tabla de posiciones','Así va la temporada'],jor:['Jornada','Resultados y destacados'],col:['Estadísticas colectivas','Toca un equipo para ver a sus jugadores'],ind:['Estadísticas individuales','Jugador por jugador'],lid:['Líderes','Los mejores en cada departamento']};
const HSVG='<svg class="hs" viewBox="0 0 220 100" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2"><path d="M70 12 L118 50 L70 88 L22 50 Z"/><circle cx="172" cy="50" r="30"/><path d="M156 28c11 11 11 33 0 44M188 28c-11 11-11 33 0 44"/></g></svg>';
function hero(v){const h=HERO[v];if(!h)return'';const u=IM['B:'+v];return`<div class="hero${u?' img':''}"${u?` style="background-image:url('${u}')"`:''}>${u?'':HSVG}<div class="ht"><h2>${h[0]}</h2><p>${h[1]}</p></div></div>`}
