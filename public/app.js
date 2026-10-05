const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const stateKey="resumeforge-draft-v1";
const fields=["name","role","email","phone","location","linkedin","summary","skills","job"];
let data={experience:[],education:[],projects:[]};

function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
function val(id){return $("#"+id)?.value||""}
function setVal(id,v){if($("#"+id))$("#"+id).value=v||""}

function addExperience(x={}){data.experience.push({id:crypto.randomUUID(),title:x.title||"",company:x.company||"",dates:x.dates||"",bullets:x.bullets||[""]});renderInputs();update()}
function addEducation(x={}){data.education.push({id:crypto.randomUUID(),degree:x.degree||"",school:x.school||"",dates:x.dates||""});renderInputs();update()}
function addProject(x={}){data.projects.push({id:crypto.randomUUID(),name:x.name||"",tech:x.tech||"",description:x.description||""});renderInputs();update()}

function renderInputs(){
  $("#experienceList").innerHTML=data.experience.map((x,i)=>`<div class="repeat"><button class="remove" data-remove="experience" data-i="${i}">Remove</button>
  <div class="grid two"><label>Job title<input data-k="title" data-type="experience" data-i="${i}" value="${esc(x.title)}" placeholder="Software Intern"></label><label>Company<input data-k="company" data-type="experience" data-i="${i}" value="${esc(x.company)}" placeholder="Company name"></label></div>
  <label>Dates<input data-k="dates" data-type="experience" data-i="${i}" value="${esc(x.dates)}" placeholder="Jun 2025 – Aug 2025"></label>
  <label>Achievement bullets<textarea data-k="bullets" data-type="experience" data-i="${i}" rows="3" placeholder="Built a feature...">${esc(x.bullets.join("\n"))}</textarea></label></div>`).join("");
  $("#educationList").innerHTML=data.education.map((x,i)=>`<div class="repeat"><button class="remove" data-remove="education" data-i="${i}">Remove</button><div class="grid two"><label>Degree<input data-k="degree" data-type="education" data-i="${i}" value="${esc(x.degree)}" placeholder="B.E. Computer Science"></label><label>Institution<input data-k="school" data-type="education" data-i="${i}" value="${esc(x.school)}" placeholder="University"></label></div><label>Dates<input data-k="dates" data-type="education" data-i="${i}" value="${esc(x.dates)}" placeholder="2023 – 2027"></label></div>`).join("");
  $("#projectList").innerHTML=data.projects.map((x,i)=>`<div class="repeat"><button class="remove" data-remove="projects" data-i="${i}">Remove</button><label>Project name<input data-k="name" data-type="projects" data-i="${i}" value="${esc(x.name)}" placeholder="Smart Campus Helpdesk"></label><label>Technologies<input data-k="tech" data-type="projects" data-i="${i}" value="${esc(x.tech)}" placeholder="Java, LangGraph, PostgreSQL"></label><label>Description<textarea data-k="description" data-type="projects" data-i="${i}" rows="2" placeholder="What did you build?">${esc(x.description)}</textarea></label></div>`).join("");
}
function syncRepeats(e){
  const el=e.target;if(!el.dataset.type)return;
  const arr=data[el.dataset.type];const obj=arr[+el.dataset.i];if(!obj)return;
  obj[el.dataset.k]=el.dataset.k==="bullets"?el.value.split("\n"):el.value;update();
}
function collect(){const o={};fields.forEach(f=>o[f]=val(f));o.experience=data.experience;o.education=data.education;o.projects=data.projects;return o}
function save(){localStorage.setItem(stateKey,JSON.stringify(collect()))}
function update(){
  $("#pName").textContent=val("name")||"Your Name";$("#pRole").textContent=val("role")||"Target Role";
  const contact=[val("email"),val("phone"),val("location")].filter(Boolean).map(esc).join(" • ");$("#pContact").textContent=contact||"email • phone • location";
  $("#pLink").textContent=val("linkedin");
  $("#pSummary").textContent=val("summary")||"Your professional summary will appear here.";
  $("#pExp").innerHTML=data.experience.filter(x=>x.title||x.company||x.bullets.some(Boolean)).map(x=>`<div class="item-title">${esc(x.title)} ${x.company?"— "+esc(x.company):""}</div><div class="muted">${esc(x.dates)}</div><ul>${x.bullets.filter(Boolean).map(b=>`<li>${esc(b)}</li>`).join("")}</ul>`).join("");
  $("#pExpSec").style.display=$("#pExp").innerHTML?"block":"none";
  $("#pProject").innerHTML=data.projects.filter(x=>x.name||x.description).map(x=>`<div class="item-title">${esc(x.name)}</div><div class="muted">${esc(x.tech)}</div><p>${esc(x.description)}</p>`).join("");
  $("#pProjectSec").style.display=$("#pProject").innerHTML?"block":"none";
  $("#pEdu").innerHTML=data.education.filter(x=>x.degree||x.school).map(x=>`<div class="item-title">${esc(x.degree)}</div><div class="muted">${esc(x.school)} ${x.dates?"• "+esc(x.dates):""}</div>`).join("");
  $("#pEduSec").style.display=$("#pEdu").innerHTML?"block":"none";
  $("#pSkills").textContent=val("skills");
  $("#pSkillsSec").style.display=val("skills")?"block":"none";
  save();
}
async function askAI(action){
  const btns=$$(".ai-btn");btns.forEach(b=>b.disabled=true);
  toast("AI is improving your resume…");
  try{
    const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,resume:collect(),job:val("job")})});
    const d=await r.json();if(!r.ok)throw new Error(d.error||"AI request failed");
    if(action==="summary"&&d.summary)setVal("summary",d.summary);
    if(action==="skills"&&d.skills?.length)setVal("skills",[...new Set((val("skills")+", "+d.skills.join(", ")).split(",").map(s=>s.trim()).filter(Boolean))].join(", "));
    if((action==="experience"||action==="tailor")&&Array.isArray(d.experience))d.experience.forEach(a=>{const x=data.experience.find(x=>x.id===a.id)||data.experience.find(x=>x.title===a.title);if(x&&a.bullets?.length)x.bullets=a.bullets});
    if((action==="projects"||action==="tailor")&&Array.isArray(d.projects))d.projects.forEach(a=>{const x=data.projects.find(x=>x.id===a.id)||data.projects.find(x=>x.name===a.name);if(x&&a.description)x.description=a.description});
    renderInputs();update();toast(d.advice||"AI changes applied.");
    if(action==="tailor"&&d.keywords?.length)toast("Target keywords: "+d.keywords.slice(0,8).join(", "));
  }catch(e){toast(e.message.includes("setup")?"Add an AI provider key in Hatchable Setup first.":e.message)}
  finally{btns.forEach(b=>b.disabled=false)}
}
fields.forEach(f=>$("#"+f).addEventListener("input",update));
$("#experienceList").addEventListener("input",syncRepeats);$("#educationList").addEventListener("input",syncRepeats);$("#projectList").addEventListener("input",syncRepeats);
document.addEventListener("click",e=>{
  const ai=e.target.closest("[data-ai]");if(ai)return askAI(ai.dataset.ai);
  const rem=e.target.closest("[data-remove]");if(rem){data[rem.dataset.remove].splice(+rem.dataset.i,1);renderInputs();update()}
});
$("#addExp").onclick=()=>addExperience();$("#addEdu").onclick=()=>addEducation();$("#addProject").onclick=()=>addProject();
$("#tailorBtn").onclick=()=>askAI("tailor");
$("#printBtn").onclick=()=>window.print();
$("#clearBtn").onclick=()=>{if(confirm("Clear this resume draft?")){localStorage.removeItem(stateKey);location.reload()}};

try{const saved=JSON.parse(localStorage.getItem(stateKey)||"null");if(saved){fields.forEach(f=>setVal(f,saved[f]));data.experience=saved.experience||[];data.education=saved.education||[];data.projects=saved.projects||[]}}catch{}
if(!data.experience.length)addExperience();if(!data.education.length)addEducation();if(!data.projects.length)addProject();renderInputs();update();