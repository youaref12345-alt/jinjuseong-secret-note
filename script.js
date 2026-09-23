const missions=[
 {title:"성문의 암호",location:"공북문",story:"첫 번째 단서는 진주성의 문에서 시작된다. 현장의 안내와 모습을 관찰해 암호를 풀어라.",question:"[임시 문제] 이 장소의 이름을 입력하세요.",answers:["공북문"]},
 {title:"장군의 이름",location:"김시민 장군 관련 장소",story:"성을 지킨 인물에 대한 기록이 훼손되어 있다. 현장에서 그의 이름을 찾아 기록을 복원하라.",question:"[임시 문제] 임진왜란 당시 진주대첩을 이끈 장군의 이름은?",answers:["김시민","김시민장군"]},
 {title:"관문의 기록",location:"영남포정사",story:"오래된 건물에 세 번째 단서가 숨겨져 있다. 주변 안내판을 세심하게 살펴보자.",question:"[임시 문제] 현재 서 있는 장소의 이름을 입력하세요.",answers:["영남포정사"]},
 {title:"누각의 단서",location:"촉석루",story:"남강을 내려다보는 누각에서 네 번째 기록을 찾아야 한다.",question:"[임시 문제] 진주성의 대표적인 누각 이름은?",answers:["촉석루"]},
 {title:"바위에 남은 기억",location:"의암",story:"강가에 남겨진 이야기가 다섯 번째 단서다. 안내문을 확인하고 장소의 이름을 찾아라.",question:"[임시 문제] 이 바위의 이름을 입력하세요.",answers:["의암"]},
 {title:"최종 암호",location:"최종 집결지",story:"다섯 개의 단서가 모였다. 마지막 암호를 풀어 비밀문서를 완성하라.",question:"[임시 문제] 오늘 탐험한 성의 이름은?",answers:["진주성"]}
];

let state=JSON.parse(localStorage.getItem("jinjuSecretState")||"null")||{started:false,grade:"2",classNo:"",team:"",completed:[]};
const $=id=>document.getElementById(id);
let current=0;

function save(){localStorage.setItem("jinjuSecretState",JSON.stringify(state))}
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");scrollTo(0,0)}
function normalize(s){return s.trim().replace(/\s/g,"").toLowerCase()}
function render(){
 $("teamLabel").textContent=`${state.grade}학년 ${state.classNo?state.classNo+"반 · ":""}${state.team}`;
 $("progressText").textContent=`${state.completed.length} / ${missions.length}`;
 $("progressBar").style.width=`${state.completed.length/missions.length*100}%`;
 const list=$("missionList"); list.innerHTML="";
 missions.forEach((m,i)=>{
   const done=state.completed.includes(i), unlocked=i===0||state.completed.includes(i-1);
   const card=document.createElement("div"); card.className=`mission-card ${done?"done":""} ${!unlocked?"locked":""}`;
   card.innerHTML=`<button ${unlocked?"":"disabled"}><span class="num">${String(i+1).padStart(2,"0")}</span><span><h3>${m.title}</h3><p>${unlocked?m.location:"이전 임무를 완료하세요"}</p></span><span class="state">${done?"✓":unlocked?"→":"🔒"}</span></button>`;
   if(unlocked) card.querySelector("button").onclick=()=>openMission(i);
   list.appendChild(card);
 });
}
function openMission(i){
 current=i; const m=missions[i]; $("missionNumber").textContent=`MISSION ${String(i+1).padStart(2,"0")}`;
 $("missionTitle").textContent=m.title;$("missionStory").textContent=m.story;$("missionLocation").textContent=m.location;$("missionQuestion").textContent=m.question;
 $("answerInput").value="";$("feedback").textContent="";
 $("missionStamp").textContent="CLEAR";$("missionStamp").classList.toggle("show",state.completed.includes(i));
 show("detailScreen");
}
$("startBtn").onclick=()=>{
 const team=$("teamName").value.trim(); if(!team){alert("팀명을 입력해주세요.");return}
 state={started:true,grade:$("grade").value,classNo:$("classNo").value.trim(),team,completed:[]};save();render();show("missionScreen");
};
$("answerBtn").onclick=()=>{
 const m=missions[current], a=normalize($("answerInput").value);
 if(m.answers.some(x=>normalize(x)===a)){
   if(!state.completed.includes(current)) state.completed.push(current);
   state.completed.sort((a,b)=>a-b);save();$("feedback").textContent="✓ MISSION CLEAR! 다음 단서가 열렸습니다.";$("missionStamp").classList.add("show");
   setTimeout(()=>{if(state.completed.length===missions.length){$("completeTeam").textContent=`${state.team}, 모든 임무를 완료했습니다.`;show("completeScreen")}else{render();show("missionScreen")}},900);
 }else $("feedback").textContent="암호가 맞지 않습니다. 현장을 다시 관찰해보세요.";
};
$("backBtn").onclick=()=>{render();show("missionScreen")};
$("homeBtn").onclick=()=>{render();show("missionScreen")};
$("resetBtn").onclick=()=>{if(confirm("진행 기록을 모두 초기화할까요?")){localStorage.removeItem("jinjuSecretState");location.reload()}};
$("answerInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("answerBtn").click()});
if(state.started){render();show(state.completed.length===missions.length?"completeScreen":"missionScreen");if(state.completed.length===missions.length)$("completeTeam").textContent=`${state.team}, 모든 임무를 완료했습니다.`}
