const API_KEY='8265bd1679663a7ea12ac168da84d2e8';
const BASE_URL='https://api.themoviedb.org/3';

const GM={'28':'Acao','35':'Comedia','18':'Drama','27':'Terror','10749':'Romance','878':'Ficcao Cient.','16':'Animacao','53':'Suspense','12':'Aventura','14':'Fantasia','80':'Crime','99':'Documentario'};
const GI={'28':'ph-sword','35':'ph-smiley','18':'ph-mask-sad','27':'ph-skull','10749':'ph-heart','878':'ph-rocket','16':'ph-paint-brush','53':'ph-eye','12':'ph-compass','14':'ph-magic-wand','80':'ph-handcuffs','99':'ph-camera-movie'};

const data=JSON.parse(localStorage.getItem('cinematchResult')||'{}');
if(!data.p1){window.location.href='index.html';}

const {p1,p2,g1,g2,pct,photo1,photo2}=data;

document.getElementById('av1').textContent=p1[0].toUpperCase();
document.getElementById('av2').textContent=p2[0].toUpperCase();
document.getElementById('p1').textContent=p1;
document.getElementById('p2').textContent=p2;
document.getElementById('gav1').textContent=p1[0].toUpperCase();
document.getElementById('gav2').textContent=p2[0].toUpperCase();
document.getElementById('gp1').textContent=p1;
document.getElementById('gp2').textContent=p2;

// Adiciona fotos personalizadas se existirem
if(photo1){
  const av1=document.getElementById('av1');
  av1.style.backgroundImage='url('+photo1+')';
  av1.style.backgroundSize='cover';
  av1.style.backgroundPosition='center';
  av1.textContent='';
  const gav1=document.getElementById('gav1');
  gav1.style.backgroundImage='url('+photo1+')';
  gav1.style.backgroundSize='cover';
  gav1.style.backgroundPosition='center';
  gav1.textContent='';
}
if(photo2){
  const av2=document.getElementById('av2');
  av2.style.backgroundImage='url('+photo2+')';
  av2.style.backgroundSize='cover';
  av2.style.backgroundPosition='center';
  av2.textContent='';
  const gav2=document.getElementById('gav2');
  gav2.style.backgroundImage='url('+photo2+')';
  gav2.style.backgroundSize='cover';
  gav2.style.backgroundPosition='center';
  gav2.textContent='';
}

const msg=pct>=80?'Voces sao feitos um para o outro':pct>=60?'Otima combinacao cinematografica':pct>=40?'Gostos diferentes, mas isso e bom':'Opostos se atraem no cinema';
document.getElementById('cmsg').textContent=msg;

const ringColor=pct>=80?'#e50914':pct>=60?'#f5c518':pct>=40?'#22c55e':'#7c6af7';
document.getElementById('ring').style.stroke=ringColor;

let cur=0;
const iv=setInterval(()=>{
  cur=Math.min(cur+2,pct);
  document.getElementById('cpct').textContent=cur+'%';
  if(cur>=pct)clearInterval(iv);
},25);

const circ=2*Math.PI*85;
document.getElementById('ring').style.strokeDashoffset=circ-(circ*pct/100);

function renderTags(ids,cid,cls){
  const el=document.getElementById(cid);
  el.innerHTML=ids.length?ids.map(id=>'<span class="g-tag '+cls+'"><i class="ph '+(GI[id]||'ph-film')+'"></i>'+(GM[id]||id)+'</span>').join(''):'<span style="color:var(--muted);font-size:0.8rem">Nenhum selecionado</span>';
}

renderTags(g1,'gt1','gt1');
renderTags(g2,'gt2','gt2');

const commonGenres=g1.filter(x=>g2.includes(x));
const genreId=commonGenres.length?commonGenres[0]:'28';

fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&with_genres=${genreId}&page=1`)
  .then(r=>r.json())
  .then(data=>{
    const mc=document.getElementById('movies');
    if(data.results&&data.results.length){
      mc.innerHTML='<div class="movies-grid">'+data.results.slice(0,12).map(m=>{
        const img=m.poster_path?'<img class="mc-img" src="https://image.tmdb.org/t/p/w300'+m.poster_path+'" alt="" loading="lazy">':'<div class="mc-ph"><i class="ph ph-film-strip"></i></div>';
        const yr=m.release_date?m.release_date.slice(0,4):'—';
        const rt=m.vote_average?m.vote_average.toFixed(1):'—';
        const ov=m.overview?m.overview.slice(0,80)+'...':'Sem descricao disponivel.';
        const tgs=(m.genre_ids||[]).slice(0,2).map(id=>'<span class="mc-tag">'+(GM[id]||'')+'</span>').join('');
        return '<div class="mc">'+img+'<div class="mc-body"><div class="mc-title">'+m.title+'</div>'
          +'<div class="mc-meta">'+yr+' &middot; '+(m.original_language||'').toUpperCase()+'<br><small>'+ov+'</small></div>'
          +'<div class="mc-tags">'+tgs+'</div>'
          +'<div class="mc-rating"><i class="ph ph-star-fill"></i>'+rt+'</div></div></div>';
      }).join('')+'</div>';
    }else{
      mc.innerHTML='<div class="load-txt" style="padding:40px 0">Nao foi possivel carregar filmes. Verifique sua conexao.</div>';
    }
  })
  .catch(()=>{
    document.getElementById('movies').innerHTML='<div class="load-txt" style="padding:40px 0">Erro ao carregar filmes.</div>';
  });
