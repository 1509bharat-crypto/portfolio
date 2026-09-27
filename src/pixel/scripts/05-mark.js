(function(){
const cv=document.getElementById('mk');if(!cv)return;const x=cv.getContext('2d');
const BP=[[4,0],[3,0],[2,0],[1,0],[0,0],[0,1],[0,2],[0,3],[1,4],[2,3],[3,4],[4,3],[4,2],[4,1],[2,2],[2,1]];
const PALM=['#E63312','#F07D1C','#1F4DB7','#2FA8D8'];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let k=0,level=0,filling=true,timer=null;
const paint=()=>{x.clearRect(0,0,110,50);[0,1].forEach(L=>{const ox=L*60,h=(k+L*8)%16,t=(h+15)%16;BP.forEach(([r,c],i)=>{if(r<5-level)return;x.fillStyle=(i===h||i===t)?PALM[L*2]:PALM[L*2+1];x.fillRect(ox+c*10,r*10,10,10)})})};
let busy=false;
paint();
const enter=()=>{busy=true;timer=setInterval(()=>{level++;paint();if(level>=5){clearInterval(timer);busy=false}},125)};
let hover=false;
const lap=()=>{hover=true;if(busy||level<5)return;busy=true;timer=setInterval(()=>{k=(k+1)%16;paint();if(!hover&&k===0){clearInterval(timer);busy=false}},125)};
const start=()=>{if(reduce){level=5;paint();return}setTimeout(enter,125)};
if(window.__splashDone)start();else addEventListener('splashdone',start,{once:true});
if(!reduce){cv.parentElement.addEventListener('pointerenter',lap);cv.parentElement.addEventListener('pointerleave',()=>{hover=false});}
})();
