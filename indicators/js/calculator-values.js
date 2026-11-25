import {calculateBMI,calculateBodyComposition,calculateWeightChange} from './calculations.js';
const safe=n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=Number.MAX_SAFE_INTEGER;
const positive=n=>safe(n)&&n>0;
const row=(label,n,unit)=>safe(n)?[label,(Object.is(Number((n+Math.sign(n)*Number.EPSILON*Math.abs(n)).toFixed(2)),-0)?0:Number((n+Math.sign(n)*Number.EPSILON*Math.abs(n)).toFixed(2)))+' '+unit]:null;
export function calcValues(kind,v){
 const [x,y,l,e]=v;let rows=[];
 if(kind==='bp'){
  const right=positive(x)&&positive(y)&&x>y,left=positive(l)&&positive(e)&&l>e;
  rows=[right&&row('右腕の脈圧',x-y,'mmHg'),left&&row('左腕の脈圧',l-e,'mmHg'),right&&left&&row('最高血圧の左右差',Math.abs(x-l),'mmHg'),right&&left&&row('最低血圧の左右差',Math.abs(y-e),'mmHg')];
 }else if(kind==='bmi'){const n=calculateBMI(x,y);if(n!==null)rows=[row('BMI',n,'')];
 }else if(kind==='fat'){const n=calculateBodyComposition(x,y);if(n)rows=[row('推定体脂肪量',n.fat,'kg'),row('推定除脂肪量',n.lean,'kg')];
 }else if(kind==='weight'){const n=calculateWeightChange(x,y);if(n)rows=[row('変化量（＋増加／−減少）',n.delta,'kg'),row('変化率（＋増加／−減少）',n.percent,'％')];
 }else if(kind==='gait'&&positive(x)&&positive(y)){const speed=x/y;if(positive(speed)&&safe(speed*3.6))rows=[row('歩行速度',speed,'m/秒'),row('時速換算',speed*3.6,'km/h')];
 }else if(kind==='sleep'&&positive(x)&&x<=24&&safe(y)&&y>=0&&y<=x)rows=[row('睡眠効率',y/x*100,'％')];
 return rows.filter(Boolean);
}
