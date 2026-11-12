
(() => {
 const root=document.querySelector('[data-infection-calendar]');if(!root)return;
 const rules={"influenza":["influenza","症状が出た日","熱が下がった日","発症後5日と解熱後2日（幼児は3日）の両方が経過する必要がある。"],"covid-19":["covid","症状が出た日","症状が軽くなった日","発症後5日と症状軽快後1日の両方が経過する必要がある。無症状の場合は検体採取日から5日経過。"],"pertussis":["condition","確認した日",null,"特徴的なせきがなくなるか、適切な抗菌薬の5日間の治療が終了するまで。"],"measles":["day4","熱が下がった日",null,"解熱した日を0日目として3日を経過するまで。"],"mumps":["day6","耳の下などが腫れ始めた日",null,"腫れ始めた日を0日目として5日経過し、全身の状態が良好になるまで。"],"rubella":["condition","確認した日",null,"発疹が消えるまで。"],"chickenpox":["condition","確認した日",null,"すべての発疹がかさぶたになるまで。"],"pharyngoconjunctival-fever":["day3","主な症状がなくなった日",null,"主な症状がなくなった日を0日目として2日経過するまで。"],"tuberculosis":["condition","確認した日",null,"医師が感染のおそれがないと判断するまで。"],"meningococcal-meningitis":["condition","確認した日",null,"医師が感染のおそれがないと判断するまで。"],"epidemic-keratoconjunctivitis":["condition","確認した日",null,"学校は医師の判断が必要。保育所は結膜炎の症状が消えていることなどが目安。"],"ehec":["condition","確認した日",null,"医師が感染のおそれがないと判断するまで。"],"strep-throat":["condition","確認した日",null,"学校に一律の日数はない。保育所では抗菌薬開始後24～48時間が経過し、全身の状態が良好であることなどが目安。"],"hand-foot-mouth":["condition","確認した日",null,"一律の出席停止日数はない。保育所は熱や口の痛みの影響がなく、普段の食事がとれることなどが目安。"],"herpangina":["condition","確認した日",null,"一律の出席停止日数はない。保育所は熱やのどの痛みの影響がなく、普段の食事がとれることなどが目安。"],"viral-gastroenteritis":["condition","確認した日",null,"一律の出席停止日数はない。保育所は嘔吐や下痢がおさまり、普段の食事がとれることなどが目安。"]};
 const rule=rules[root.dataset.infectionCalendar];if(!rule)return;
 const kind=rule[0];
 const heading=document.createElement('h3');heading.textContent='日付で確認するカレンダー';root.appendChild(heading);
 const hint=document.createElement('p');hint.textContent='下の日付を選んで、学校・園に戻る目安を確認する。';root.appendChild(hint);
 const controls=document.createElement('div');controls.className='infection-calendar-fields';root.appendChild(controls);
 function dateField(label) {const l=document.createElement('label');l.textContent=label;const v=document.createElement('input');v.type='date';v.setAttribute('aria-label',label);l.appendChild(v);controls.appendChild(l);v.addEventListener('change',render);return v;}
 const first=dateField(rule[1]);const second=rule[2]?dateField(rule[2]):null;
 let age=null,asym=null;
 if(kind==='influenza'){const l=document.createElement('label');l.textContent='通う先';age=document.createElement('select');age.innerHTML='<option value="school">小学生以上</option><option value="young">幼児（幼稚園・保育所など）</option>';l.appendChild(age);controls.appendChild(l);age.addEventListener('change',render);}
 if(kind==='covid'){const l=document.createElement('label');l.textContent='症状';asym=document.createElement('select');asym.innerHTML='<option value="symptoms">症状あり</option><option value="none">無症状（検体採取日を入力）</option>';l.appendChild(asym);controls.appendChild(l);asym.addEventListener('change',()=>{second.closest('label').hidden=asym.value==='none';first.closest('label').firstChild.textContent=asym.value==='none'?'検体を採った日':'症状が出た日';render();});}
 const message=document.createElement('p');message.className='infection-calendar-result';message.setAttribute('aria-live','polite');root.appendChild(message);
 const nav=document.createElement('div');nav.className='infection-calendar-nav';root.appendChild(nav);
 const prev=document.createElement('button');prev.type='button';prev.textContent='前の月';nav.appendChild(prev);
 const title=document.createElement('strong');nav.appendChild(title);
 const next=document.createElement('button');next.type='button';next.textContent='次の月';nav.appendChild(next);
 const calendar=document.createElement('div');calendar.className='infection-calendar-grid';calendar.setAttribute('role','grid');root.appendChild(calendar);
 const legend=document.createElement('p');legend.className='infection-calendar-legend';legend.textContent='● 0日目　■ 経過期間　★ 計算上の最短の日';root.appendChild(legend);
 const caution=document.createElement('p');caution.className='infection-calendar-note';caution.textContent=rule[3]+' この計算だけで登校・登園が決まるわけではない。体調や医師の判断、学校・園の案内も確認する。';root.appendChild(caution);
 const today=new Date();let y=today.getFullYear(),m=today.getMonth(),manual=false;
 function parse(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return null;const a=v.split('-').map(Number),d=new Date(a[0],a[1]-1,a[2]);return d.getFullYear()===a[0]&&d.getMonth()===a[1]-1&&d.getDate()===a[2]?d:null;}
 function add(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);}
 function stamp(d){return d?Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000:null;}
 function label(d){return d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日';}
 function render(){
 const start=parse(first.value),end=second?parse(second.value):null;const none=kind==='covid'&&asym.value==='none';
 let earliest=null;
 if(kind==='influenza'&&start&&end&&stamp(end)>=stamp(start)){earliest=add(start,6);const fever=add(end,age.value==='school'?3:4);if(stamp(fever)>stamp(earliest))earliest=fever;}
 if(kind==='covid'&&start&&(none||(end&&stamp(end)>=stamp(start)))){earliest=add(start,6);if(!none){const improved=add(end,2);if(stamp(improved)>stamp(earliest))earliest=improved;}}
 if(kind==='day4'&&start)earliest=add(start,4);
 if(kind==='day6'&&start)earliest=add(start,6);
 if(kind==='day3'&&start)earliest=add(start,3);
 if(!manual&&(earliest||start)){const d=earliest||start;y=d.getFullYear();m=d.getMonth();}
 if(earliest)message.textContent='計算上の最短の目安：'+label(earliest)+'以降。ただし、ほかの再開条件も確認する。';
 else if(kind==='condition')message.textContent='この感染症は日付だけで登校・登園再開日を決められない。下の条件を確認する。';
 else message.textContent='基準となる日付を入力すると目安日を表示する。';
 if(start&&end&&stamp(end)<stamp(start))message.textContent='日付の前後関係を確認する。';
 title.textContent=y+'年'+(m+1)+'月';calendar.replaceChildren();
 ['月','火','水','木','金','土','日'].forEach(s=>{const e=document.createElement('span');e.className='infection-calendar-dayname';e.textContent=s;calendar.appendChild(e);});
 const offset=(new Date(y,m,1).getDay()+6)%7;for(let i=0;i<offset;i++){const e=document.createElement('span');e.className='infection-calendar-blank';calendar.appendChild(e);}
 const last=new Date(y,m+1,0).getDate();for(let i=1;i<=last;i++){const d=new Date(y,m,i),t=stamp(d),e=document.createElement('div');e.className='infection-calendar-day';e.textContent=i;
 if(start&&t===stamp(start)){e.classList.add('is-start');e.title='0日目';}
 if(start&&earliest&&t>stamp(start)&&t<stamp(earliest)){e.classList.add('is-wait');e.title='経過期間';}
 if(earliest&&t===stamp(earliest)){e.classList.add('is-earliest');e.title='最短の目安';}
 if(t===stamp(today))e.classList.add('is-today');calendar.appendChild(e);}
 legend.hidden=kind==='condition';
 }
 prev.addEventListener('click',()=>{m--;if(m<0){y--;m=11;}manual=true;render();});
 next.addEventListener('click',()=>{m++;if(m>11){y++;m=0;}manual=true;render();});
 render();
})();
