(function(){
const mobile=matchMedia('(max-width:640px)').matches;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const W2=[...document.querySelectorAll('.bw')];
const area=document.querySelector('.scene2 .area');
const PXC=['#E63312','#1F4DB7','#F2C114','#2E9E4F','#F07D1C','#D63A8E','#2FA8D8','#6B3FA0'];
const PX=W2.map((w,i)=>{const d=document.createElement('i');d.setAttribute('aria-hidden','true');d.style.background=PXC[(i*3)%PXC.length];if(Math.random()<0.5)d.classList.add('lit');w.prepend(d);return d});
if(!reduce)setInterval(()=>PX.forEach(d=>{if(Math.random()<0.09)d.classList.toggle('lit')}),125);
const balance=()=>{if(mobile)return;area.style.transform='';let l=1e9,r=-1e9,t=1e9,b=-1e9;W2.forEach(w=>{const q=w.getBoundingClientRect();l=Math.min(l,q.left);r=Math.max(r,q.right);t=Math.min(t,q.top);b=Math.max(b,q.bottom)});
 const dx=innerWidth/2-(l+r)/2,dy=innerHeight/2-(t+b)/2-innerHeight*0.012;area.style.transform=`translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`};
balance();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(balance);addEventListener('resize',balance);
const up=W2.slice().sort((a,b)=>parseFloat(b.style.top)-parseFloat(a.style.top));
const showWords=done=>{up.forEach((w,n)=>setTimeout(()=>{w.classList.add('on');if(window.__blip)window.__blip(Math.floor(Math.random()*8),n,Math.floor(Math.random()*3));if(n===up.length-1&&done)done()},reduce?0:n*125))};
const hideWords=done=>{const r=up.slice().reverse();r.forEach((w,n)=>setTimeout(()=>{w.classList.remove('on');if(window.__blip)window.__blip(Math.floor(Math.random()*8),n,Math.floor(Math.random()*3));if(n===r.length-1&&done)done()},0))};
// ---- arrow ----
const btn=document.getElementById('scr'),cv=document.getElementById('arw'),x=cv.getContext('2d');
const ARROW=[[0,2],[1,2],[2,0],[2,2],[2,4],[3,1],[3,2],[3,3],[4,2]];
const HEAD=new Set(['2,0','2,4','3,1','3,3','4,2']);
const OFF=[0,0,0,0,0,1,2,3,4,5,-4,-3,-2,-1];let ai=0,dir=1;
const drawArrow=()=>{x.clearRect(0,0,50,50);const o=reduce?0:OFF[ai%OFF.length];ARROW.forEach(([r,c])=>{let rr=dir>0?r+o:(4-r)-o;if(rr<0||rr>4)return;x.fillStyle=HEAD.has(r+','+c)?'#E63312':'#F07D1C';x.fillRect(c*10,rr*10,10,10)});ai++};
let scene=0,busy=false;
const setDir=d=>{dir=d;btn.setAttribute('aria-label',d>0?'Next':'Back to top');ai=0};
// ---- timeline ----
const TB=[...document.querySelectorAll('.tb')],NOW=TB.length-1,note=document.getElementById('note'),noteTxt=document.getElementById('noteTxt');
const DOT=[];for(let r=0;r<5;r++)for(let c=0;c<5;c++)DOT.push([r,c]);
const RINGD=[[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4],[4,3],[4,2],[4,1],[4,0],[3,0],[2,0],[1,0]];
let active=NOW,tk=0;
const PIDX=[6,3,14,27,44,0,4,25];
const TINK=[['#1F4DB7','#2FA8D8'],['#6B3FA0','#D63A8E'],['#2FA8D8','#1F4DB7'],['#F07D1C','#F2C114'],['#D63A8E','#E63312'],['#2E9E4F','#F2C114'],['#6B3FA0','#2FA8D8'],['#E63312','#F07D1C']];
const REST=PIDX.map(pi=>{const fr=window.__PAT[pi];let best=0,bi=0;fr.forEach((g,j)=>{let n=0;g.forEach(r=>r.forEach(v=>{if(v!=='.')n++}));if(n>best&&n<25){best=n;bi=j}});return bi});
const drawDot=(b,i)=>{const c=b.querySelector('canvas').getContext('2d');c.clearRect(0,0,50,50);const live=i===active;
 if(live&&!reduce&&i===NOW&&active===NOW&&(tk%8)>=6)return;c.fillStyle=live?TINK[i][0]:'#b3aa98';c.fillRect(20,20,10,10)};
const drawAll=()=>TB.forEach(drawDot);
const na=document.getElementById('noteArw').getContext('2d');[[0,2],[1,2],[2,2],[3,2],[4,2]].forEach(([r,c])=>{na.fillStyle=r===4?'#E63312':'#1c1a17';na.fillRect(c*10,r*10,10,10)});
const drawLine=()=>{};let lg=0;
const placeNote=()=>{const tl=note.parentElement.getBoundingClientRect(),q=TB[active].querySelector('canvas').getBoundingClientRect();let x=q.left+q.width/2-tl.left;
 note.style.left=x+'px';noteTxt.textContent=TB[active].dataset.role;const n=note.getBoundingClientRect();const over=n.right-(tl.right+innerWidth*0.08);if(over>0)note.style.left=(x-over)+'px';const under=(tl.left-innerWidth*0.08)-n.left;if(under>0)note.style.left=(x+under)+'px'};
const setActive=i=>{if(active===i)return;active=i;lg=0;drawAll();placeNote();drawLine()};
TB.forEach((b,i)=>{b.addEventListener('pointerenter',()=>setActive(i));b.addEventListener('focus',()=>setActive(i));b.addEventListener('pointerleave',()=>setActive(NOW));b.addEventListener('blur',()=>setActive(NOW))});
drawAll();drawLine();setInterval(()=>{tk++;drawDot(TB[active],active);drawLine()},125);
const B=()=>window.__blip&&window.__blip(Math.floor(Math.random()*8),0,Math.floor(Math.random()*3));
const showTL=done=>{document.body.classList.add('s3');active=NOW;drawAll();TB.forEach((b,n)=>setTimeout(()=>{b.classList.add('on');B();if(n===TB.length-1){setTimeout(()=>{lg=0;placeNote();note.classList.add('on');B();done&&done()},125)}},reduce?0:n*125))};
const hideTL=done=>{note.classList.remove('on');B();const r=TB.slice().reverse();r.forEach((b,n)=>setTimeout(()=>{b.classList.remove('on');B();if(n===r.length-1){document.body.classList.remove('s3');done&&done()}},0))};
addEventListener('resize',()=>{if(note.classList.contains('on'))placeNote()});
// ---- work library ----
const WB=[...document.querySelectorAll('.wb')],wIntro=document.querySelector('.wk-intro');
if(wIntro)(()=>{const pp=wIntro.querySelector('p');const f=document.createDocumentFragment();pp.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{const sp=document.createElement('span');sp.className='w';sp.textContent=t;f.appendChild(sp)}});pp.textContent='';pp.appendChild(f)})();
const wws=wIntro?[...wIntro.querySelectorAll('.w')]:[];let WG=[];
const wGroup=()=>{const tops=[];wws.forEach(w=>{const r=w.getClientRects();const y=Math.round((r[r.length-1]||w.getBoundingClientRect()).top);let i=tops.findIndex(t=>Math.abs(t-y)<4);if(i<0){tops.push(y);i=tops.length-1}w._l=i});WG=[...tops.keys()].sort((a,b)=>tops[a]-tops[b]).map(li=>wws.filter(w=>w._l===li))};
let wHover=-1,wk=0;
const wDraw=(b,i)=>{const c=b.querySelector('canvas').getContext('2d');c.clearRect(0,0,45,30);const fr=window.__PAT[+b.dataset.p];const live=i===wHover&&!reduce;const ink=i===wHover?[b.dataset.a,b.dataset.b]:['#a39985','#c4bba9'];
 for(let ty=0;ty<6;ty++)for(let tx=0;tx<9;tx++){const g=live?fr[(wk+tx+ty)%fr.length]:fr[REST2[i]];for(let r=0;r<5;r++)for(let cc=0;cc<5;cc++){const v=g[r][cc];if(v==='.')continue;c.fillStyle=v==='w'?ink[0]:ink[1];c.fillRect(tx*5+cc,ty*5+r,1,1)}}};
const REST2=WB.map(b=>{const fr=window.__PAT[+b.dataset.p];let best=0,bi=0;fr.forEach((g,j)=>{let n=0;g.forEach(r=>r.forEach(v=>{if(v!=='.')n++}));if(n>best&&n<25){best=n;bi=j}});return bi});
WB.forEach((b,i)=>{wDraw(b,i);b.addEventListener('pointerenter',()=>{wHover=i;wDraw(b,i)});b.addEventListener('pointerleave',()=>{wHover=-1;wDraw(b,i)})});
setInterval(()=>{wk++;if(wHover>=0)wDraw(WB[wHover],wHover)},125);
const wH=document.querySelector('.wk-h');
const showWork=done=>{document.body.classList.add('s4');if(wH){wH.classList.add('on');B()}wGroup();const L=WG.length;WG.forEach((g,n)=>setTimeout(()=>{g.forEach(w=>w.classList.add('on'));B()},reduce?0:n*125));
 WB.forEach((b,n)=>setTimeout(()=>{b.classList.add('on');B();if(n===WB.length-1){setTimeout(()=>{moreBtn.classList.add('on');B();done&&done()},reduce?0:125)}},reduce?0:(L+n+1)*125))};
const hideWork=done=>{moreBtn.classList.remove('on');const r=WB.slice().reverse();const rg=WG.slice().reverse();const total=r.length+rg.length;let k=0;const tick=()=>{if(++k===total){setTimeout(()=>{if(wH){wH.classList.remove('on');B()}document.body.classList.remove('s4');done&&done()},125)}};
 r.forEach((b,n)=>setTimeout(()=>{b.classList.remove('on');B();tick()},0));rg.forEach((g,n)=>setTimeout(()=>{g.forEach(w=>w.classList.remove('on'));B();tick()},0))};
// ---- more projects ----
const MB=[...document.querySelectorAll('.mb')],moreBtn=document.getElementById('more');let mHover=-1;
const mRest=MB.map(b=>{const fr=window.__PAT[+b.dataset.p];let best=0,bi=0;fr.forEach((g,j)=>{let n=0;g.forEach(r=>r.forEach(v=>{if(v!=='.')n++}));if(n>best&&n<25){best=n;bi=j}});return bi});
const mDraw=(b,i)=>{const c=b.querySelector('canvas').getContext('2d');c.clearRect(0,0,45,30);const fr=window.__PAT[+b.dataset.p];const live=i===mHover&&!reduce;const ink=i===mHover?[b.dataset.a,b.dataset.b]:['#a39985','#c4bba9'];
 for(let ty=0;ty<6;ty++)for(let tx=0;tx<9;tx++){const g=live?fr[(wk+tx+ty)%fr.length]:fr[mRest[i]];for(let r=0;r<5;r++)for(let cc=0;cc<5;cc++){const v=g[r][cc];if(v==='.')continue;c.fillStyle=v==='w'?ink[0]:ink[1];c.fillRect(tx*5+cc,ty*5+r,1,1)}}};
MB.forEach((b,i)=>{mDraw(b,i);b.addEventListener('pointerenter',()=>{mHover=i;mDraw(b,i)});b.addEventListener('pointerleave',()=>{mHover=-1;mDraw(b,i)})});
setInterval(()=>{if(mHover>=0)mDraw(MB[mHover],mHover)},125);
const showMore=done=>{document.body.classList.add('s5');MB.forEach((b,n)=>setTimeout(()=>{b.classList.add('on');B();if(n===MB.length-1&&done)done()},reduce?0:n*125))};
const hideMore=done=>{const r=MB.slice().reverse();r.forEach((b,n)=>setTimeout(()=>{b.classList.remove('on');B();if(n===r.length-1){document.body.classList.remove('s5');done&&done()}},0))};
const S=[{show:d=>{document.body.classList.remove('s2');window.__s1.show(d)},hide:d=>{document.body.classList.add('s2');window.__s1.hide(d)}},{show:showWords,hide:hideWords},{show:showTL,hide:hideTL},{show:showWork,hide:hideWork},{show:showMore,hide:hideMore}];
const go=to=>{if(busy||mobile||to<0||to>=S.length||to===scene)return;busy=true;dispatchEvent(new Event('sceneout'));S[scene].hide(()=>setTimeout(()=>S[to].show(()=>{scene=to;setDir(scene===S.length-1?-1:1);busy=false}),reduce?0:375))};
const start=()=>{if(!mobile){btn.classList.add('show');drawArrow();if(!reduce)setInterval(drawArrow,125)}};
if(window.__splashDone)start();else addEventListener('splashdone',start,{once:true});
btn.addEventListener('click',()=>go(scene===S.length-1?0:scene+1));
moreBtn.addEventListener('click',()=>go(4));
if(!mobile){
 let acc=0,lastT=0;
 addEventListener('wheel',e=>{if(!window.__splashDone)return;const now=performance.now();if(now-lastT>400)acc=0;lastT=now;acc+=e.deltaY;if(acc>40){acc=0;go(scene+1)}else if(acc<-40){acc=0;go(scene-1)}},{passive:true});
 addEventListener('keydown',e=>{if(!window.__splashDone)return;if(['ArrowDown','PageDown',' '].includes(e.key)){if(e.target.tagName!=='BUTTON'||e.key!==' '){go(scene+1)}}else if(['ArrowUp','PageUp'].includes(e.key))go(scene-1);else if(e.key==='Home')go(0)});
 let ty=null;addEventListener('touchstart',e=>{ty=e.touches[0].clientY},{passive:true});
 addEventListener('touchend',e=>{if(ty==null)return;const d=ty-e.changedTouches[0].clientY;if(d>50)go(scene+1);else if(d<-50)go(scene-1);ty=null},{passive:true});
}else{
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){showWords();io.disconnect()}}),{threshold:0.2});io.observe(document.getElementById('s2'));
 const io3=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){TB.forEach((b,n)=>setTimeout(()=>{b.classList.add('on');B()},n*125));io3.disconnect()}}),{threshold:0.2});io3.observe(document.getElementById('s3'));
 const io4=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){wws.forEach(w=>w.classList.add('on'));WB.forEach((b,n)=>setTimeout(()=>{b.classList.add('on');B()},n*125));io4.disconnect()}}),{threshold:0.15});io4.observe(document.getElementById('s4'));
 const io5=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){MB.forEach((b,n)=>setTimeout(()=>b.classList.add('on'),n*125));io5.disconnect()}}),{threshold:0.1});io5.observe(document.getElementById('s5'));moreBtn.classList.add('on');moreBtn.addEventListener('click',()=>document.getElementById('s5').scrollIntoView({behavior:'smooth'}));
}
window.__go=go;
})();
