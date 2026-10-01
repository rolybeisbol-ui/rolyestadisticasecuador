/* 01-almacenamiento.js */
const idb=new Promise(r=>{try{const q=indexedDB.open('liga',1);q.onupgradeneeded=()=>q.result.createObjectStore('k');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
const kv=async(m,k,v)=>{const d=await idb;if(!d)return;return new Promise(r=>{try{const s=d.transaction('k',m=='get'?'readonly':'readwrite').objectStore('k'),q=m=='get'?s.get(k):m=='put'?s.put(v,k):s.delete(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r()}catch(e){r()}})};
const allKeys=async()=>{const d=await idb;if(!d)return[];return new Promise(r=>{const s=d.transaction('k').objectStore('k'),a=s.getAllKeys(),b=s.getAll();b.onsuccess=()=>r(a.result.map((k,i)=>[k,b.result[i]]))})};
