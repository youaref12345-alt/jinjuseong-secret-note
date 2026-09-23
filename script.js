const missions=[
{title:"성문의 암호",location:"공북문",story:"첫 번째 단서는 진주성의 문에서 시작된다.",photo:"공북문이 보이도록 현장 사진을 촬영하세요.",question:"[임시 문제] 이 장소의 이름을 입력하세요.",answers:["공북문"]},
{title:"장군의 이름",location:"김시민 장군 관련 장소",story:"성을 지킨 장군의 기록을 찾아라.",photo:"김시민 장군과 관련된 장소 또는 안내물이 나오도록 촬영하세요.",question:"[임시 문제] 진주대첩을 이끈 장군의 이름은?",answers:["김시민","김시민장군"]},
{title:"관문의 기록",location:"영남포정사",story:"오래된 건물에서 세 번째 단서를 찾아라.",photo:"영남포정사의 특징이 드러나도록 촬영하세요.",question:"[임시 문제] 현재 장소의 이름은?",answers:["영남포정사"]},
{title:"누각의 단서",location:"촉석루",story:"남강을 내려다보는 누각에 기록이 남아 있다.",photo:"촉석루가 확인되도록 현장 사진을 촬영하세요.",question:"[임시 문제] 진주성의 대표적인 누각 이름은?",answers:["촉석루"]},
{title:"바위에 남은 기억",location:"의암",story:"강가에 남겨진 이야기가 다섯 번째 단서다.",photo:"의암 또는 의암 안내가 확인되도록 촬영하세요.",question:"[임시 문제] 이 바위의 이름은?",answers:["의암"]},
{title:"최종 암호",location:"최종 집결지",story:"마지막 현장 기록을 남기고 비밀문서를 완성하라.",photo:"팀원들과 진주성 현장 인증사진을 촬영하세요.",question:"[임시 문제] 오늘 탐험한 성의 이름은?",answers:["진주성"]}];

let state=JSON.parse(localStorage.getItem("jinjuSecretStateV2")||"null")||{started:false,grade:"2",classNo:"",team:"",completed:[]};
let current=0, photoReady=false, photoURL=null;
const $=id=>document.getElementById(id);
const save=()=>localStorage.setItem("jinjuSecretStateV2",JSON.stringify(state));
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");scrollTo(0,0)}
function norm(s){return s.trim().replace(/\s/g,"").toLowerCase()}
function render(){
 $("teamLabel").textContent=`${state.grade}학년 ${state.classNo?state.classNo+"반 · ":""}${state.team}`;
 $("progressText").textContent=`${state.completed.length} / ${missions.length}`;$("progressBar").style.width=`${state.completed.length/missions.length*100}%`;
 $("missionList").innerHTML="";
 missions.forEach((m,i)=>{const done=state.completed.includes(i),unlocked=i===0||state.completed.includes(i-1),card=document.createElement("div");card.className=`mission-card ${done?"done":""} ${!unlocked?"locked":""}`;card.innerHTML=`<button ${unlocked?"":"disabled"}><span class="num">${String(i+1).padStart(2,"0")}</span><span><h3>${m.title}</h3><p>${unlocked?m.location:"이전 임무를 완료하세요"}</p></span><span class="state">${done?"✓":unlocked?"→":"🔒"}</span></button>`;if(unlocked)card.querySelector("button").onclick=()=>openMission(i);$("missionList").appendChild(card)});
}
function setPhotoReady(ok){
 photoReady=ok;$("questionBox").classList.toggle("disabled",!ok);$("answerInput").disabled=!ok;$("answerBtn").disabled=!ok;
 $("photoStatus").textContent=ok?"✓ 현장 사진이 확인되었습니다. 이제 문제를 풀어보세요.":"사진을 촬영해야 문제를 풀 수 있습니다.";
 $("photoStatus").classList.toggle("ok",ok);
}
function openMission(i){
 current=i;photoReady=state.completed.includes(i);if(photoURL){URL.revokeObjectURL(photoURL);photoURL=null}
 const m=missions[i];$("missionNumber").textContent=`MISSION ${String(i+1).padStart(2,"0")}`;$("missionTitle").textContent=m.title;$("missionStory").textContent=m.story;$("missionLocation").textContent=m.location;$("photoInstruction").textContent=m.photo;$("missionQuestion").textContent=m.question;$("answerInput").value="";$("feedback").textContent="";$("photoInput").value="";$("previewWrap").classList.remove("show");$("missionStamp").classList.toggle("show",state.completed.includes(i));setPhotoReady(photoReady);show("detailScreen");
}
$("cameraBtn").onclick=()=>$("photoInput").click();
$("retakeBtn").onclick=()=>$("photoInput").click();
$("photoInput").onchange=e=>{
 const f=e.target.files&&e.target.files[0];if(!f)return;
 if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(f);$("photoPreview").src=photoURL;$("previewWrap").classList.add("show");setPhotoReady(true);
};
$("startBtn").onclick=()=>{const team=$("teamName").value.trim();if(!team){alert("팀명을 입력해주세요.");return}state={started:true,grade:$("grade").value,classNo:$("classNo").value.trim(),team,completed:[]};save();render();show("missionScreen")};
$("answerBtn").onclick=()=>{if(!photoReady)return;const m=missions[current],a=norm($("answerInput").value);if(m.answers.some(x=>norm(x)===a)){if(!state.completed.includes(current))state.completed.push(current);state.completed.sort((a,b)=>a-b);save();$("feedback").textContent="✓ MISSION CLEAR! 다음 단서가 열렸습니다.";$("missionStamp").classList.add("show");setTimeout(()=>{if(state.completed.length===missions.length){$("completeTeam").textContent=`${state.team}, 모든 임무를 완료했습니다.`;show("completeScreen")}else{render();show("missionScreen")}},900)}else $("feedback").textContent="암호가 맞지 않습니다. 현장을 다시 관찰해보세요."};
$("backBtn").onclick=()=>{render();show("missionScreen")};$("homeBtn").onclick=()=>{render();show("missionScreen")};
$("resetBtn").onclick=()=>{if(confirm("진행 기록을 모두 초기화할까요?")){localStorage.removeItem("jinjuSecretStateV2");location.reload()}};
$("answerInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("answerBtn").click()});
if(state.started){render();if(state.completed.length===missions.length){$("completeTeam").textContent=`${state.team}, 모든 임무를 완료했습니다.`;show("completeScreen")}else show("missionScreen")}
