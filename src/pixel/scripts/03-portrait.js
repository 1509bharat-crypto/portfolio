(function(){
const W=40,H=38,FPS=8,CUT=0.76;
const LUM=[1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.99,0.78,0.78,0.87,0.98,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.98,0.77,0.65,0.67,0.27,0.2,0.29,0.58,0.73,0.84,0.98,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.87,0.32,0.17,0.16,0.21,0.16,0.13,0.15,0.18,0.33,0.45,0.69,0.89,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.84,0.47,0.13,0.15,0.2,0.16,0.23,0.12,0.15,0.24,0.18,0.19,0.3,0.49,0.95,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.84,0.55,0.26,0.17,0.15,0.12,0.22,0.25,0.13,0.16,0.12,0.13,0.19,0.16,0.22,0.64,0.79,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.96,0.48,0.25,0.13,0.11,0.09,0.11,0.16,0.16,0.22,0.12,0.15,0.11,0.13,0.16,0.16,0.29,0.51,0.88,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.8,0.24,0.22,0.13,0.11,0.22,0.13,0.13,0.13,0.16,0.06,0.15,0.17,0.17,0.11,0.17,0.18,0.31,0.82,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.96,0.54,0.15,0.19,0.11,0.25,0.45,0.31,0.47,0.36,0.37,0.23,0.19,0.31,0.24,0.12,0.1,0.18,0.28,0.7,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.85,0.29,0.14,0.2,0.14,0.38,0.64,0.57,0.63,0.61,0.63,0.61,0.49,0.58,0.19,0.16,0.14,0.17,0.22,0.43,0.99,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.84,0.26,0.11,0.13,0.16,0.4,0.33,0.28,0.44,0.62,0.66,0.56,0.45,0.52,0.51,0.25,0.08,0.1,0.15,0.55,0.96,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.63,0.16,0.19,0.16,0.23,0.28,0.24,0.25,0.24,0.32,0.42,0.28,0.26,0.36,0.4,0.36,0.12,0.11,0.2,0.56,0.91,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.68,0.25,0.13,0.15,0.33,0.31,0.25,0.19,0.26,0.36,0.36,0.22,0.15,0.28,0.42,0.38,0.25,0.25,0.19,0.33,0.88,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.91,0.27,0.25,0.24,0.48,0.55,0.51,0.44,0.44,0.64,0.61,0.49,0.35,0.45,0.53,0.59,0.37,0.26,0.17,0.35,0.97,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.89,0.38,0.31,0.33,0.68,0.57,0.53,0.36,0.4,0.8,0.79,0.42,0.53,0.62,0.6,0.7,0.5,0.46,0.33,0.69,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.98,0.73,0.23,0.38,0.62,0.58,0.43,0.33,0.43,0.55,0.67,0.6,0.36,0.5,0.81,0.74,0.55,0.49,0.24,0.9,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.95,0.27,0.37,0.45,0.39,0.15,0.22,0.25,0.23,0.25,0.3,0.35,0.36,0.71,0.67,0.49,0.44,0.41,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.63,0.35,0.38,0.29,0.11,0.25,0.41,0.44,0.54,0.58,0.26,0.15,0.58,0.57,0.49,0.33,0.79,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.45,0.31,0.25,0.26,0.37,0.55,0.65,0.64,0.67,0.41,0.16,0.51,0.52,0.41,0.49,0.98,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.68,0.18,0.18,0.25,0.43,0.36,0.39,0.41,0.52,0.56,0.25,0.4,0.4,0.56,0.98,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.95,0.22,0.15,0.21,0.39,0.38,0.4,0.41,0.5,0.49,0.24,0.29,0.36,0.9,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.8,0.29,0.15,0.11,0.27,0.35,0.33,0.38,0.44,0.35,0.23,0.28,0.65,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.76,0.08,0.18,0.32,0.12,0.17,0.19,0.18,0.29,0.41,0.27,0.29,0.55,0.36,0.81,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.92,0.19,0.12,0.32,0.46,0.3,0.16,0.12,0.18,0.3,0.35,0.31,0.57,0.69,0.28,0.19,0.94,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.82,0.32,0.12,0.53,0.49,0.51,0.45,0.41,0.38,0.47,0.58,0.65,0.69,0.74,0.73,0.33,0.07,0.38,0.91,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.96,0.61,0.27,0.23,0.31,0.78,0.6,0.53,0.51,0.48,0.47,0.56,0.69,0.71,0.73,0.76,0.68,0.52,0.16,0.16,0.32,0.63,0.9,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.93,0.66,0.37,0.26,0.26,0.23,0.51,0.83,0.79,0.58,0.51,0.53,0.57,0.59,0.67,0.7,0.74,0.72,0.71,0.68,0.3,0.17,0.23,0.3,0.24,0.47,0.9,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.89,0.55,0.34,0.34,0.27,0.29,0.27,0.3,0.55,0.87,0.82,0.81,0.71,0.65,0.65,0.65,0.66,0.72,0.78,0.85,0.85,0.68,0.4,0.19,0.23,0.28,0.3,0.24,0.31,0.67,0.98,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.77,0.32,0.33,0.42,0.36,0.32,0.29,0.27,0.31,0.45,0.86,0.87,0.83,0.81,0.83,0.85,0.86,0.85,0.87,0.87,0.84,0.8,0.69,0.29,0.22,0.22,0.31,0.45,0.27,0.25,0.25,0.44,0.91,1.0,1.0,1.0,1.0,1.0,1.0,0.81,0.31,0.28,0.43,0.36,0.36,0.35,0.33,0.36,0.34,0.29,0.8,0.88,0.85,0.85,0.85,0.85,0.84,0.83,0.81,0.8,0.8,0.81,0.69,0.22,0.16,0.29,0.27,0.13,0.38,0.25,0.27,0.27,0.41,0.92,1.0,1.0,1.0,1.0,0.93,0.36,0.25,0.24,0.22,0.29,0.3,0.25,0.2,0.38,0.36,0.32,0.67,0.85,0.86,0.82,0.85,0.84,0.83,0.8,0.8,0.78,0.78,0.83,0.69,0.15,0.24,0.29,0.31,0.18,0.36,0.3,0.27,0.27,0.32,0.48,0.97,1.0,1.0,0.99,0.49,0.26,0.24,0.24,0.18,0.1,0.05,0.06,0.12,0.38,0.34,0.31,0.53,0.83,0.88,0.84,0.83,0.85,0.83,0.8,0.8,0.75,0.85,0.83,0.61,0.14,0.22,0.28,0.33,0.09,0.25,0.41,0.23,0.29,0.31,0.34,0.61,1.0,1.0,0.73,0.27,0.25,0.23,0.22,0.17,0.13,0.1,0.14,0.13,0.22,0.4,0.33,0.39,0.83,0.88,0.86,0.83,0.85,0.85,0.83,0.8,0.79,0.88,0.83,0.51,0.16,0.23,0.24,0.33,0.21,0.16,0.25,0.24,0.27,0.31,0.34,0.34,0.82,1.0,0.44,0.31,0.25,0.21,0.19,0.17,0.21,0.22,0.25,0.2,0.18,0.08,0.34,0.31,0.8,0.86,0.87,0.85,0.85,0.86,0.87,0.81,0.83,0.89,0.82,0.42,0.21,0.24,0.35,0.19,0.24,0.22,0.26,0.24,0.28,0.3,0.33,0.32,0.53,1.0,0.26,0.34,0.22,0.22,0.2,0.18,0.23,0.22,0.25,0.21,0.19,0.08,0.1,0.32,0.71,0.85,0.88,0.86,0.86,0.83,0.87,0.85,0.83,0.89,0.81,0.35,0.24,0.26,0.36,0.19,0.29,0.28,0.31,0.26,0.31,0.3,0.3,0.33,0.41,0.87,0.2,0.22,0.19,0.21,0.19,0.18,0.24,0.21,0.27,0.25,0.27,0.15,0.1,0.19,0.61,0.84,0.88,0.87,0.88,0.79,0.86,0.85,0.84,0.89,0.8,0.29,0.27,0.31,0.3,0.2,0.31,0.31,0.32,0.29,0.29,0.33,0.29,0.37,0.31,0.59,0.17,0.14,0.18,0.21,0.18,0.19,0.24,0.2,0.28,0.29,0.25,0.2,0.14,0.08,0.51,0.84,0.89,0.87,0.87,0.77,0.83,0.83,0.84,0.89,0.76,0.25,0.29,0.38,0.27,0.25,0.31,0.32,0.33,0.31,0.27,0.35,0.32,0.37,0.29,0.4];
const PAL=['#E63312','#1F4DB7','#F2C114','#2E9E4F','#F07D1C','#D63A8E','#2FA8D8','#6B3FA0'];
const blank=(v='.')=>Array.from({length:5},()=>Array(5).fill(v));
const put=(g,cells,v)=>{cells.forEach(([r,c])=>{if(r>=0&&r<5&&c>=0&&c<5)g[r][c]=v});return g};
const map=fn=>{const g=blank();for(let r=0;r<5;r++)for(let c=0;c<5;c++)g[r][c]=fn(r,c);return g};
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const range=n=>[...Array(n).keys()];
const hold=(arr,h)=>arr.flatMap(g=>Array(h).fill(g));
const rot90=g=>map((r,c)=>g[4-c][r]);
const RING=[[0,1],[0,2],[0,3],[1,4],[2,4],[3,4],[4,3],[4,2],[4,1],[3,0],[2,0],[1,0]];
const INNER=[[1,1],[1,2],[1,3],[2,3],[3,3],[3,2],[3,1],[2,1]];
const SP=(()=>{const S=[];let t=0,b=4,l=0,rr=4;while(t<=b&&l<=rr){for(let c=l;c<=rr;c++)S.push([t,c]);t++;for(let r=t;r<=b;r++)S.push([r,rr]);rr--;if(t<=b){for(let c=rr;c>=l;c--)S.push([b,c]);b--}if(l<=rr){for(let r=b;r>=t;r--)S.push([r,l]);l++}}return S})();
const SNAKE=(()=>{const P=[];for(let r=0;r<5;r++)for(let c=0;c<5;c++)P.push([r,r%2?4-c:c]);return P})();
const SNAKEV=SNAKE.map(([r,c])=>[c,r]);
const chase=(path,tail,extra)=>range(path.length).map(k=>{const g=blank();path.forEach((p,i)=>{const d=((i-k)%path.length+path.length)%path.length;if(d===0)put(g,[p],'w');else if(d<=tail)put(g,[p],'g')});if(extra)extra(g,k);return g});
const wave=(dist,n)=>range(n).map(k=>map((r,c)=>{const v=((dist(r,c)-k)%n+n)%n;return v===0?'w':v===n-1?'g':'.'}));
const stripe=(fn,m,h)=>hold(range(m).map(k=>map((r,c)=>{const v=((fn(r,c)+k)%m+m)%m;return v===0?'w':v===1?'g':'.'})),h);
const auto=(rule,seed,up)=>{let rows=[seed];const nxt=s=>range(5).map(i=>{const a=s[(i+4)%5],b=s[i],c=s[(i+1)%5];return(rule>>(a*4+b*2+c))&1}).join('');for(let i=0;i<15;i++)rows.push(nxt(rows[rows.length-1]));return range(16).map(t=>map((r,c)=>{const rr=up?4-r:r;const v=rows[(t+rr)%16][c]==='1';return v?(rr===4?'w':'g'):'.'}))};
const eq=(fn,n)=>range(n).map(t=>map((r,c)=>{const h=fn(c,t);return r===4-h?'w':r>4-h?'g':'.'}));
const rain=(seed,dir)=>{const R=rng(seed);const off=range(5).map(()=>Math.floor(R()*7));return range(7).map(t=>{const g=blank();off.forEach((o,i)=>{const y=(t+o)%7-1;const p=dir==='d'?[[y-1,i],[y,i]]:dir==='u'?[[5-y,i],[4-y,i]]:[[i,y-1],[i,y]];put(g,[p[0]],'g');put(g,[p[1]],'w')});return g})};
const twinkle=(seed,n,gl)=>{const R=rng(seed);const ph=range(25).map(()=>Math.floor(R()*n));return range(n).map(t=>map((r,c)=>{const v=(t+ph[r*5+c])%n;return v===0?'w':v<gl?'g':'.'}))};
const bars=(seed,vert)=>{const R=rng(seed);const L=range(5).map(()=>1+Math.floor(R()*4)),O=range(5).map(()=>Math.floor(R()*7));return range(7).map(t=>map((r,c)=>{const[i,j]=vert?[c,r]:[r,c];const p=((j+O[i]-t)%7+7)%7;return p<L[i]?(p===0?'w':'g'):'.'}))};
const spin=(cells,h)=>{let g=put(blank(),cells,'w');const o=[];for(let k=0;k<4;k++){for(let i=0;i<h;i++)o.push(g);g=rot90(g)}return o};
const walk=(seed,n)=>{const R=rng(seed);let r=2,c=2;const trail=[];return range(n).map(()=>{const d=[[0,1],[1,0],[0,-1],[-1,0]][Math.floor(R()*4)];let nr=r+d[0],nc=c+d[1];if(nr<0||nr>4||nc<0||nc>4){nr=r-d[0];nc=c-d[1]}trail.unshift([nr,nc]);trail.length=Math.min(trail.length,4);r=nr;c=nc;const g=blank();put(g,trail.slice(1),'g');put(g,[trail[0]],'w');return g})};
const randeq=(seed,n)=>{const R=rng(seed);let h=range(5).map(()=>1+Math.floor(R()*3));return range(n).map(()=>{h=h.map(v=>Math.max(0,Math.min(4,v+Math.floor(R()*3)-1)));return map((r,c)=>r===4-h[c]?'w':r>4-h[c]?'g':'.')})};
const A=[];
A.push(wave((r,c)=>r+c,11));
A.push(hold([0,1,2,1].map(k=>{const g=blank();[[2-k,2-k],[2-k,2+k],[2+k,2-k],[2+k,2+k]].forEach(p=>put(g,[p],k?'g':'w'));if(k)g[2][2]='w';return g}),3));
(()=>{const o=[];for(let k=0;k<4;k++){const g=blank();g[2][2]='g';[[0,0],[0,1],[1,0]].forEach(([r,c])=>{const q=[[r,c],[c,4-r],[4-r,4-c],[4-c,r]];put(g,[q[k]],'w');put(g,[q[(k+2)%4]],'g')});o.push(g,g,g)}A.push(o)})();
A.push(chase(SP,3,(g,k)=>{const p=SP[(k+12)%25];put(g,[p],'g')}));
A.push(eq((c,t)=>Math.round(2+2*Math.sin((c+t)/12*Math.PI*2)),12));
A.push(hold(range(4).map(k=>map((r,c)=>{const d=Math.abs(r-2)+Math.abs(c-2);return d===k?'w':d===k+1?'g':'.'})),2));
A.push(auto(30,'00100',false));A.push(bars(23,false));A.push(twinkle(77,8,3));
A.push(range(12).map(k=>{const g=blank();put(g,[RING[(12-k)%12]],'g');put(g,[RING[k]],'w');g[2][2]=k%4<2?'w':'g';return g}));
A.push(chase(SNAKE,2));A.push(stripe((r,c)=>c-r,5,2));
(()=>{const R=rng(99);const D=[];for(let r=0;r<5;r+=2)for(let c=0;c<5;c+=2)D.push([r,c]);A.push(hold(range(8).map(()=>{const g=blank();D.forEach(d=>put(g,[d],R()<.3?'w':'g'));return g}),2))})();
A.push(stripe((r,c)=>r+c,4,2));A.push(rain(12,'d'));
A.push(hold(range(5).map(i=>{const g=blank();if(i===0)g[2][2]='w';if(i===1){put(g,[[2,2]],'w');put(g,[[1,2],[2,1],[2,3],[3,2]],'w');put(g,[[1,1],[1,3],[3,1],[3,3]],'g')}if(i===2){put(g,[[0,2],[2,0],[2,4],[4,2]],'w');put(g,[[1,2],[2,1],[2,3],[3,2]],'g')}if(i===3){put(g,[[0,0],[0,4],[4,0],[4,4]],'w');put(g,[[1,1],[1,3],[3,1],[3,3]],'g')}if(i===4)put(g,[[0,0],[0,4],[4,0],[4,4]],'g');return g}),2));
A.push(wave((r,c)=>8-r-c,11));A.push(wave((r,c)=>Math.max(r,c),7));A.push(wave((r,c)=>Math.max(4-r,4-c),7));A.push(wave((r,c)=>Math.abs(r-2)+Math.abs(4-c),8));
A.push(range(12).map(k=>{const g=blank();put(g,[RING[(k+11)%12],RING[(k+5)%12]],'g');put(g,[RING[k],RING[(k+6)%12]],'w');return g}));
A.push(range(24).map(k=>{const g=blank();put(g,[RING[k%12]],'w');put(g,[INNER[(24-k)%8]],'w');put(g,[RING[(k+11)%12],INNER[(25-k)%8]],'g');return g}));
A.push(chase(SNAKEV,2));A.push(chase(SNAKE.slice().reverse(),4));
A.push(chase(SP.slice().reverse(),2,(g,k)=>{put(g,[SP[24-(k+8)%25],SP[24-(k+16)%25]],'w')}));
A.push(chase(RING,5,(g,k)=>{g[2][2]=k%3===0?'w':'.'}));
A.push(stripe((r,c)=>c,5,2));A.push(stripe((r,c)=>r,5,2));A.push(stripe((r,c)=>r-c,5,2));A.push(stripe((r,c)=>Math.abs(c-2)+r,5,2));A.push(stripe((r,c)=>Math.abs(r-2)+Math.abs(c-2),5,2));A.push(stripe((r,c)=>(r+c)%2?c:-c,5,2));
A.push(auto(110,'00001',false));A.push(auto(30,'00100',true));A.push(auto(150,'00100',false));
A.push(eq((c,t)=>Math.round(2+2*Math.cos((c*2+t)/8*Math.PI*2)),8));A.push(eq((c,t)=>Math.round(2+2*Math.sin((t)/8*Math.PI*2+c)),8));
A.push(range(12).map(t=>map((r,c)=>{const h=Math.round(2+2*Math.sin((r+t)/12*Math.PI*2));return c===h?'w':c<h?'g':'.'})));
A.push(rain(31,'u'));A.push(rain(58,'r'));A.push(twinkle(13,10,2));A.push(bars(66,true));
A.push(spin([[0,2],[1,2],[2,2],[3,2],[4,2],[2,3],[2,4]],3));A.push(spin([[0,0],[1,1],[2,2],[3,3],[4,4]],3));
A.push(walk(44,24));A.push(randeq(45,16));A.push(auto(30,'10110',false));A.push(twinkle(46,6,4));
const cv=document.getElementById('cv'),ctx=cv.getContext('2d');
const T=12,S=T/5,GAM=0.6;
let seed=1,PIDX=[],PHASE=[],INK=[];
const pick=(R,set)=>{const a=set[Math.floor(R()*set.length)];let b=set[Math.floor(R()*set.length)];if(b===a)b=set[(set.indexOf(a)+1)%set.length];return[a,b]};
function assign(){const R=rng(seed);PIDX=range(W*H).map(()=>Math.floor(R()*A.length));PHASE=range(W*H).map(()=>Math.floor(R()*40));
 INK=range(W*H).map(i=>{const l=LUM[i];
  if(l<0.24){const p=pick(R,['#1a1714','#1a1714',PAL[1],PAL[7],PAL[3],PAL[5]]);return R()<0.55?['#1a1714',p[1]]:p}
  if(l<0.36)return pick(R,[PAL[1],PAL[7],PAL[3],PAL[6],PAL[5],PAL[0]]);
  if(l<0.6)return pick(R,[PAL[4],PAL[0],PAL[2],PAL[5],PAL[4],PAL[6]]);
  return pick(R,[PAL[2],PAL[4],PAL[6],PAL[3]])})}
let tick=0;
function show(){ctx.clearRect(0,0,cv.width,cv.height);
 for(let i=0;i<W*H;i++){const r=Math.floor(i/W),c=i%W;const l=LUM[i];if(cutNow<=0.001)continue;const d=Math.max(0,(cutNow-l)/cutNow);const k=Math.round(Math.pow(d,GAM)*25);if(k<=0)continue;
  const fr=A[PIDX[i]],g=fr[(tick+PHASE[i])%fr.length];const ws=[],gs=[],rest=[];SP.forEach(([y,x])=>{const v=g[y][x];(v==='w'?ws:v==='g'?gs:rest).push([y,x,v])});
  const seqc=ws.concat(gs,rest).slice(0,k);const[a,b]=INK[i];
  seqc.forEach(([y,x,v])=>{ctx.fillStyle=v==='w'?a:b;ctx.fillRect(c*T+x*S,r*T+y*S,S,S)})}}
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let cutNow=0;
function lines(){const c=document.querySelector('.copy');const walk=n=>{[...n.childNodes].forEach(ch=>{if(ch.nodeType===3){const f=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{const sp=document.createElement('span');sp.className='w';sp.textContent=t;f.appendChild(sp)}});ch.replaceWith(f)}else if(ch.nodeType===1)walk(ch)})};walk(c);
 const ws=[...c.querySelectorAll('.w')];if(reduce){LG=[ws];ws.forEach(w=>w.classList.add('on'));c.querySelectorAll('a').forEach(a=>a.classList.add('on'));return}
 const tops=[];ws.forEach(w=>{const r=w.getClientRects();const y=Math.round((r[r.length-1]||w.getBoundingClientRect()).top);let i=tops.findIndex(t=>Math.abs(t-y)<4);if(i<0){tops.push(y);i=tops.length-1}w._l=i});
 const order=[...tops.keys()].sort((a,b)=>tops[a]-tops[b]);LG=order.map(li=>ws.filter(w=>w._l===li));showLines(125)}
let LG=null;
const setLine=(g,on)=>g.forEach(w=>{w.classList.toggle('on',on);const a=w.closest('a');if(a)a.classList.toggle('on',on?true:[...a.querySelectorAll('.w')].some(x=>x!==w&&x.classList.contains('on')))});
function showLines(delay,done){if(!LG){done&&done();return}LG.forEach((g,n)=>setTimeout(()=>{setLine(g,true);window.__blip&&window.__blip(Math.floor(Math.random()*8),0,Math.floor(Math.random()*3));if(n===LG.length-1&&done)done()},delay+n*125))}
function hideLines(done){if(!LG){done&&done();return}const r=LG.slice().reverse();r.forEach((g,n)=>setTimeout(()=>{setLine(g,false);window.__blip&&window.__blip(Math.floor(Math.random()*8),0,Math.floor(Math.random()*3));if(n===r.length-1&&done)done()},0))}
function animCut(to,dur,done){const from=cutNow,t0=performance.now();const st=()=>{const t=Math.min(1,(performance.now()-t0)/dur);const e=to>from?1-Math.pow(1-t,3):t*t;cutNow=from+(to-from)*e;if(to===0&&cutNow<0.12)cutNow=0;if(t<1)setTimeout(st,125);else{cutNow=to;done&&done()}};st()}
window.__s1={hide(done){let n=0;const fin=()=>{if(++n===2&&done)done()};hideLines(fin);cutNow=0;fin()},
 show(done){let n=0;const fin=()=>{if(++n===2&&done)done()};if(reduce){cutNow=CUT;fin()}else{cutNow=0.14;animCut(CUT,2000,fin)}showLines(250,fin)}};
function reveal(){document.body.classList.add('ready');lines();if(reduce){cutNow=CUT;show();return}const t0=performance.now(),DUR=2200;
 const step=()=>{const t=Math.min(1,(performance.now()-t0)/DUR);const e=1-Math.pow(1-t,3);const C0=0.14;cutNow=C0+(CUT-C0)*e;if(t<1)setTimeout(step,125)};step()}
if(window.__splashDone)reveal();else addEventListener('splashdone',reveal,{once:true});
window.__PAT=A;
assign();show();
if(!reduce)setInterval(()=>{tick++;show()},1000/FPS);

document.getElementById('shuf').addEventListener('click',()=>{seed++;assign();show()});
})();
