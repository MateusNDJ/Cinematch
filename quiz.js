const GENRES=[
  {id:'28',  name:'Acao',           icon:'ph-sword'},
  {id:'35',  name:'Comedia',         icon:'ph-smiley'},
  {id:'18',  name:'Drama',           icon:'ph-mask-sad'},
  {id:'27',  name:'Terror',          icon:'ph-skull'},
  {id:'10749',name:'Romance',        icon:'ph-heart'},
  {id:'878', name:'Ficcao Cient.',   icon:'ph-rocket'},
  {id:'16',  name:'Animacao',        icon:'ph-paint-brush'},
  {id:'53',  name:'Suspense',        icon:'ph-eye'},
  {id:'12',  name:'Aventura',        icon:'ph-compass'},
  {id:'14',  name:'Fantasia',        icon:'ph-magic-wand'},
  {id:'80',  name:'Crime',           icon:'ph-handcuffs'},
  {id:'99',  name:'Documentario',    icon:'ph-camera-movie'}
];

const QUESTIONS=[
  {t:'Voce prefere finais de filme:',o:['Felizes e previsíveis','Tristes mas realistas','Surpreendentes','Abertos a interpretacao']},
  {t:'Durante um filme chato, voce:',o:['Assiste ate o fim','Pega o celular','Dorme','Sugere trocar']},
  {t:'Qual seu ritual perfeito de cinema?',o:['Pipoca e refrigerante','Comida de verdade','So petiscos','Nada, so o filme']},
  {t:'Voce e do time:',o:['Maratona (varios eps/filmes)','Um por vez e refletir','Depende do humor','Assisto enquanto faco outras coisas']},
  {t:'Filme dublado ou legendado?',o:['Sempre dublado','Sempre legendado','Depende do filme','Tanto faz']},
  {t:'Voce chora assistindo filme?',o:['Nunca','Raramente','Frequentemente','Sempre que e emocionante']},
  {t:'Prefere assistir filmes:',o:['Lancamentos/novidades','Classicos antigos','Cult/independentes','Sucessos de bilheteria']}
];

const PROG_LABELS=['Inicio','Generos','Perguntas','Generos','Perguntas'];
let sg1=[],sg2=[],a1={},a2={},n1='',n2='';

function setStep(s){
  document.getElementById('prog').style.width=(s/5*100)+'%';
  document.getElementById('prog-lbl').textContent=PROG_LABELS[s-1];
  document.getElementById('prog-steps').textContent=s+' / 5';
}

function show(id){
  document.querySelectorAll('.step').forEach(e=>e.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function initNames(){
  const input1=document.getElementById('n1').value.trim();
  const input2=document.getElementById('n2').value.trim();
  
  if(!input1 || !input2){
    const card=document.getElementById('s1');
    card.classList.add('shake');
    setTimeout(()=>card.classList.remove('shake'),500);
    alert('⚠️ Por favor, digite os nomes das duas pessoas para começar!');
    return;
  }
  
  n1=input1;
  n2=input2;
  document.querySelectorAll('.pname1').forEach(e=>e.textContent=n1);
  document.querySelectorAll('.pname2').forEach(e=>e.textContent=n2);
  ['av1','av1b'].forEach(id=>document.getElementById(id).textContent=n1[0].toUpperCase());
  ['av2','av2b'].forEach(id=>document.getElementById(id).textContent=n2[0].toUpperCase());
  buildGenres('gg1',sg1,'sp1','gg1c');show('s2');setStep(2);
}

function buildGenres(cid,arr,cls,cntId){
  const g=document.getElementById(cid);g.innerHTML='';
  GENRES.forEach(x=>{
    const d=document.createElement('div');
    d.className='g-chip'+(arr.includes(x.id)?' '+cls:'');
    d.innerHTML='<div class="g-icon"><i class="ph '+x.icon+'"></i></div>'+x.name;
    d.onclick=()=>{
      if(arr.includes(x.id)){arr.splice(arr.indexOf(x.id),1);d.classList.remove(cls);}
      else if(arr.length<4){arr.push(x.id);d.classList.add(cls);}
      document.getElementById(cntId).textContent=arr.length+' / 4 selecionados';
    };
    g.appendChild(d);
  });
}

function buildQuestions(cid,cls){
  const c=document.getElementById(cid);c.innerHTML='';
  QUESTIONS.forEach((q,qi)=>{
    const b=document.createElement('div');b.className='q-block';
    const opts=q.o.map((o,oi)=>
      '<button class="q-opt" onclick="selOpt(this,\''+cid+'\','+qi+',\''+cls+'\')">'+
      '<i class="ph ph-check-circle"></i>'+o+'</button>'
    ).join('');
    b.innerHTML='<div class="q-text"><span class="q-num">'+(qi+1)+'</span>'+q.t+'</div><div class="q-opts">'+opts+'</div>';
    c.appendChild(b);
  });
}

function selOpt(btn,cid,qi,cls){
  btn.closest('.q-opts').querySelectorAll('.q-opt').forEach(b=>b.classList.remove('op1','op2'));
  btn.classList.add(cls==='sp1'?'op1':'op2');
}

function toQ1(){
  if(!sg1.length){
    const card=document.getElementById('s2');
    card.classList.add('shake');
    setTimeout(()=>card.classList.remove('shake'),500);
    alert('⚠️ Selecione pelo menos 1 gênero para continuar!');
    return;
  }
  buildQuestions('qq1','sp1');
  show('s3');
  setStep(3);
}

function toG2(){
  const answered = document.querySelectorAll('#qq1 .q-opt.op1').length;
  if(answered < QUESTIONS.length){
    const card=document.getElementById('s3');
    card.classList.add('shake');
    setTimeout(()=>card.classList.remove('shake'),500);
    alert('⚠️ Por favor, responda todas as ' + QUESTIONS.length + ' perguntas antes de continuar!\n\nVocê respondeu: ' + answered + '/' + QUESTIONS.length);
    return;
  }
  buildGenres('gg2',sg2,'sp2','gg2c');
  show('s4');
  setStep(4);
}

function toQ2(){
  if(!sg2.length){
    const card=document.getElementById('s4');
    card.classList.add('shake');
    setTimeout(()=>card.classList.remove('shake'),500);
    alert('⚠️ Selecione pelo menos 1 gênero para continuar!');
    return;
  }
  buildQuestions('qq2','sp2');
  show('s5');
  setStep(5);
}

let resultData={};

function calculateCompatibility(g1,g2){
  if(!g1.length||!g2.length)return 50;
  const set1=new Set(g1);
  const set2=new Set(g2);
  const intersection=new Set([...set1].filter(x=>set2.has(x)));
  const union=new Set([...set1,...set2]);
  if(union.size===0)return 50;
  return Math.round((intersection.size/union.size)*100);
}

function submit(){
  const answered = document.querySelectorAll('#qq2 .q-opt.op2').length;
  if(answered < QUESTIONS.length){
    const card=document.getElementById('s5');
    card.classList.add('shake');
    setTimeout(()=>card.classList.remove('shake'),500);
    alert('⚠️ Por favor, responda todas as ' + QUESTIONS.length + ' perguntas antes de ver o resultado!\n\nVocê respondeu: ' + answered + '/' + QUESTIONS.length);
    return;
  }
  
  const pct=calculateCompatibility(sg1,sg2);
  resultData={p1:n1,p2:n2,g1:sg1,g2:sg2,pct:pct};
  
  document.getElementById('mav1').textContent=n1[0].toUpperCase();
  document.getElementById('mav2').textContent=n2[0].toUpperCase();
  document.getElementById('modal').classList.add('show');
  
  setTimeout(()=>{
    const msg=pct>=80?'Voces sao feitos um para o outro!':pct>=60?'Otima combinacao cinematografica!':pct>=40?'Gostos diferentes, mas isso e bom!':'Opostos se atraem no cinema!';
    document.getElementById('mtitle').textContent='Compatibilidade Calculada!';
    document.getElementById('msub').textContent=n1+' & '+n2;
    document.querySelectorAll('.modal-av').forEach(e=>e.classList.remove('loading'));
    
    setTimeout(()=>{
      const pctEl=document.getElementById('mpct');
      pctEl.classList.add('reveal');
      let cur=0;
      const step=pct>50?2:1;
      const interval=setInterval(()=>{
        cur=Math.min(cur+step,pct);
        pctEl.textContent=cur+'%';
        if(cur>=pct)clearInterval(interval);
      },20);
      
      setTimeout(()=>{
        document.getElementById('mmsg').textContent=msg;
        document.getElementById('mmsg').classList.add('reveal');
        document.getElementById('mbtn').classList.add('reveal');
      },800);
    },300);
  },1500);
}

function goToResult(){
  localStorage.setItem('cinematchResult',JSON.stringify(resultData));
  window.location.href='result.html';
}
