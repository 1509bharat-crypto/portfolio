(function(){
const I=document.getElementById('intro'),box=I.querySelector('.ibox'),btn=document.getElementById('enter');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
box.querySelectorAll('p').forEach(pp=>{const f=document.createDocumentFragment();pp.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{const sp=document.createElement('span');sp.className='w';sp.textContent=t;f.appendChild(sp)}});pp.textContent='';pp.appendChild(f)});
const spk=document.createElement('canvas');spk.width=50;spk.height=50;spk.className='spk w';spk.setAttribute('aria-hidden','true');box.insertBefore(spk,box.firstChild);
const sx=spk.getContext('2d');const SF=[
 [[2,2,'w']],
 [[2,2,'w'],[1,2,'g'],[3,2,'g'],[2,1,'g'],[2,3,'g']],
 [[2,2,'w'],[1,2,'w'],[3,2,'w'],[2,1,'w'],[2,3,'w'],[0,2,'g'],[4,2,'g'],[2,0,'g'],[2,4,'g']],
 [[2,2,'w'],[1,1,'g'],[1,3,'g'],[3,1,'g'],[3,3,'g'],[0,2,'g'],[4,2,'g'],[2,0,'g'],[2,4,'g']],
 [[2,2,'w'],[1,1,'g'],[1,3,'g'],[3,1,'g'],[3,3,'g']],
 [[2,2,'g']],[[2,2,'g']],[[2,2,'w']],[[2,2,'w']],[[2,2,'g']]];
let sk=0;const drawSpk=()=>{sx.clearRect(0,0,50,50);SF[sk%SF.length].forEach(([r,c,v])=>{sx.fillStyle=v==='w'?'#F2C114':'#F07D1C';sx.fillRect(c*10,r*10,10,10)});sk++};
drawSpk();if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const si=setInterval(()=>{if(!document.getElementById('intro'))return clearInterval(si);drawSpk()},125)}
const ws=[...box.querySelectorAll('.w')];let G=[];
const group=()=>{const tops=[];ws.forEach(w=>{const r=w.getClientRects();const y=Math.round((r[r.length-1]||w.getBoundingClientRect()).top);let i=tops.findIndex(t=>Math.abs(t-y)<4);if(i<0){tops.push(y);i=tops.length-1}w._l=i});G=[...tops.keys()].sort((a,b)=>tops[a]-tops[b]).map(li=>ws.filter(w=>w._l===li))};
const B=()=>window.__blip&&window.__blip(Math.floor(Math.random()*8),0,Math.floor(Math.random()*3));
const open=()=>{group();if(reduce){ws.forEach(w=>w.classList.add('on'));btn.classList.add('on');return}
 G.forEach((g,n)=>setTimeout(()=>g.forEach(w=>w.classList.add('on')),250+n*125));setTimeout(()=>{btn.classList.add('on')},250+G.length*125+125)};
addEventListener('keydown',e=>{if(e.key==='Enter'&&document.getElementById('intro')&&!btn.disabled&&btn.classList.contains('on')){e.preventDefault();btn.click()}});
const done=()=>{I.remove();window.__introDone=true;dispatchEvent(new Event('introdone'))};
btn.addEventListener('click',()=>{if(window.__audioUnlock)window.__audioUnlock();btn.disabled=true;if(reduce){done();return}
 setTimeout(()=>{btn.classList.remove('on');B()},0);const r=G.slice().reverse();r.forEach((g,n)=>setTimeout(()=>{g.forEach(w=>w.classList.remove('on'));B()},0));setTimeout(done,125)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(open);else addEventListener('load',open);
})();
