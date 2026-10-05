import { ai } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function(req,res){
  const body=req.body||{};
  const action=String(body.action||"summary");
  const resume=body.resume||{};
  const job=String(body.job||"").slice(0,7000);
  const system=`You are an expert resume writer and ATS optimization specialist. Write concise, truthful, professional resume content. Never invent employers, degrees, dates, metrics, certifications, or technologies. Improve wording using only supplied facts. Return ONLY valid JSON with this shape: {"summary":"...", "skills":["..."], "experience":[{"id":"","bullets":["..."]}], "projects":[{"id":"","description":"..."}], "keywords":["..."], "advice":"..."}.`;
  const prompt=`Task: ${action}
Candidate data:
${JSON.stringify(resume).slice(0,14000)}
Target job:
${job}
For summary, generate a 3-4 sentence ATS-friendly summary. For skills, suggest relevant skills only when supported by the candidate data or clearly marked as recommendations. For experience, rewrite each supplied bullet into strong achievement-oriented bullets without fabricating facts. For projects, improve descriptions while preserving facts. For tailor, identify job keywords and suggest targeted edits across the resume.`;
  try{
    const requestedModel=String(body.model||"gemini");
    const allowedModels=new Set(["sonnet","haiku","opus","gpt","gpt-mini","gemini","gemini-pro"]);
    const model=allowedModels.has(requestedModel)?requestedModel:"gemini";
    const result=await ai.generateText({model,system,prompt,maxSteps:1,purpose:"resume-builder"});
    const text=String(result.text||"").replace(/^\`\`\`json\s*/,"").replace(/\s*\`\`\`$/,"").trim();
    let data;
    try{data=JSON.parse(text)}catch{data={summary:text,skills:[],experience:[],projects:[],keywords:[],advice:""}}
    res.json(data);
  }catch(e){
    console.error("resume AI error",e);
    res.status(e?.status||502).json({error:e?.message||"AI generation failed"});
  }
}