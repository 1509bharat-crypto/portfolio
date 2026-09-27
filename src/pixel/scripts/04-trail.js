(function(){
if(matchMedia('(hover:none), (pointer:coarse), (prefers-reduced-motion: reduce)').matches)return;
const cv=document.getElementById('trail'),x=cv.getContext('2d');
// ---- subtle glitch blips, one per trail pixel ----
let ac=null,master=null,lastBlip=0,muted=true;try{muted=localStorage.getItem('bb-sound')!=='on'}catch(e){}
const NOTES=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.51];
const unlock=()=>{if(ac)return;try{ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=0.05;
 const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;master.connect(lp);lp.connect(ac.destination)}catch(e){ac=null}};
window.__blip=blip;window.__audioUnlock=()=>{if(!muted){unlock();if(ac&&ac.state==='suspended')ac.resume()}};
const btn=document.getElementById('snd');
const label=()=>{btn.textContent=muted?'Sound off':'Sound on';btn.setAttribute('aria-pressed',String(!muted))};
const setMuted=v=>{muted=v;try{localStorage.setItem('bb-sound',v?'off':'on')}catch(e){}label();if(!v){unlock();if(ac&&ac.state==='suspended')ac.resume();setTimeout(()=>blip(4,0,1),30)}};
label();
const reveal=()=>btn.classList.add('show');if(window.__splashDone)reveal();else addEventListener('splashdone',reveal,{once:true});
btn.addEventListener('click',()=>setMuted(!muted));
addEventListener('pointerdown',()=>{if(!muted&&window.__introDone){unlock();if(ac&&ac.state==='suspended')ac.resume()}},{passive:true});
addEventListener('keydown',e=>{if(e.key==='m'||e.key==='M')setMuted(!muted)});
function blip(ci,gx,gy){if(!ac||muted||ac.state!=='running')return;const now=ac.currentTime;if(now-lastBlip<0.045)return;lastBlip=now;
 const f=NOTES[ci%NOTES.length]*(gy%3===0?0.5:1);
 const o=ac.createOscillator(),g=ac.createGain();o.type=Math.random()<0.7?'square':'triangle';
 o.frequency.setValueAtTime(f,now);if(Math.random()<0.5)o.frequency.setValueAtTime(f*(Math.random()<0.5?1.5:0.75),now+0.012);
 g.gain.setValueAtTime(0.0001,now);g.gain.linearRampToValueAtTime(1,now+0.002);g.gain.exponentialRampToValueAtTime(0.0001,now+0.028+Math.random()*0.02);
 o.connect(g);g.connect(master);o.start(now);o.stop(now+0.06);
 if(Math.random()<0.25){const n=ac.createBufferSource(),b=ac.createBuffer(1,Math.floor(ac.sampleRate*0.012),ac.sampleRate),d=b.getChannelData(0);let hold=0,v=0;for(let i=0;i<d.length;i++){if(hold--<=0){v=Math.random()*2-1;hold=8}d[i]=v*(1-i/d.length)}
  const ng=ac.createGain();ng.gain.value=0.35;n.buffer=b;n.connect(ng);ng.connect(master);n.start(now+0.004)}}
const P=['#E63312','#1F4DB7','#F2C114','#2E9E4F','#F07D1C','#D63A8E','#2FA8D8','#6B3FA0'];
const G=6,LIFE=3;let dpr=1,cells=[],last=null,running=false,lastStep=0;
const size=()=>{dpr=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0)};
size();addEventListener('resize',size);
const add=(px,py)=>{if(Math.random()>0.45)return;const j=()=>Math.random()<0.3?(Math.random()<0.5?-1:1):0;
 const gx=Math.floor(px/G)+j(),gy=Math.floor(py/G)+j();if(cells.some(c=>c.gx===gx&&c.gy===gy))return;
 const ci=Math.floor(Math.random()*P.length);cells.push({gx,gy,c:P[ci],t:LIFE});if(cells.length>36)cells.shift();blip(ci,gx,gy)};
addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const p={x:e.clientX,y:e.clientY};
 if(last){const dx=p.x-last.x,dy=p.y-last.y,n=Math.max(1,Math.floor(Math.hypot(dx,dy)/G));for(let i=1;i<=n;i++)add(last.x+dx*i/n,last.y+dy*i/n)}else add(p.x,p.y);
 last=p;if(!running){running=true;setTimeout(loop,0)}},{passive:true});
addEventListener('pointerleave',()=>{last=null});
document.addEventListener('mouseleave',()=>{last=null});
function loop(){cells.forEach(c=>c.t--);cells=cells.filter(c=>c.t>0);
 x.clearRect(0,0,innerWidth,innerHeight);
 cells.forEach(c=>{x.fillStyle=c.c;if(c.t>1)x.fillRect(c.gx*G,c.gy*G,G,G);else{const h=G/2;x.fillRect(c.gx*G+h/2,c.gy*G+h/2,h,h)}});
 if(cells.length)setTimeout(loop,125);else{running=false;x.clearRect(0,0,innerWidth,innerHeight)}}
})();
