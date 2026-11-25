const positive=n=>typeof n==='number'&&Number.isFinite(n)&&n>0&&n<=Number.MAX_SAFE_INTEGER;
const representable=n=>Number.isFinite(n)&&Math.abs(n)<=Number.MAX_SAFE_INTEGER;
export function calculateBMI(heightCm,weightKg){if(!positive(heightCm)||!positive(weightKg))return null;const bmi=weightKg/(heightCm/100)**2;return representable(bmi)&&bmi>0?bmi:null;}
export function calculateBodyComposition(weightKg,fatPercent){if(!positive(weightKg)||!positive(fatPercent)||fatPercent>=100)return null;const fat=weightKg*fatPercent/100,lean=weightKg-fat;return representable(fat)&&representable(lean)?{fat,lean}:null;}
export function calculateWeightChange(previous,current){if(!positive(previous)||!positive(current))return null;const delta=current-previous,percent=delta/previous*100;return representable(delta)&&representable(percent)?{delta,percent}:null;}
export function formatSigned(value){const text=value.toFixed(1);return Number(text)===0?'0.0':value>0?'+'+text:text;}
