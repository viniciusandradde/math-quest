export type DiagnosticSkill = 'equal-groups' | 'repeated-addition' | 'arrays' | 'symbolic' | 'facts';
export type DiagnosticQuestion = { id:string; skill:DiagnosticSkill; prompt:string; options:string[]; answer:string; explanation:string };
export type DiagnosticResponse = { questionId:string; skill:DiagnosticSkill; selected:string; correct:boolean };
export type DiagnosticResult = { responses:DiagnosticResponse[]; bySkill:Record<DiagnosticSkill,{correct:number;total:number;level:'needs-support'|'developing'|'secure'}>; completedAt:string };

export const diagnosticQuestions:DiagnosticQuestion[]=[
{id:'groups-1',skill:'equal-groups',prompt:'Há 3 caixas com 4 estrelas em cada uma. Qual desenho representa a situação?',options:['3 grupos de 4','4 grupos de 3','3 + 4'],answer:'3 grupos de 4',explanation:'São 3 caixas, e cada caixa tem 4 estrelas.'},
{id:'groups-2',skill:'equal-groups',prompt:'Cada robô recebe 2 baterias. Quantas baterias recebem 5 robôs?',options:['7','10','25'],answer:'10',explanation:'São 5 grupos de 2: 2 + 2 + 2 + 2 + 2 = 10.'},
{id:'addition-1',skill:'repeated-addition',prompt:'Qual adição representa 4 × 3?',options:['4 + 3','3 + 3 + 3 + 3','4 + 4 + 4'],answer:'3 + 3 + 3 + 3',explanation:'4 × 3 representa 4 grupos de 3.'},
{id:'arrays-1',skill:'arrays',prompt:'Uma matriz tem 3 linhas com 5 pontos em cada linha. Quantos pontos há?',options:['8','15','35'],answer:'15',explanation:'3 linhas de 5 pontos: 3 × 5 = 15.'},
{id:'symbolic-1',skill:'symbolic',prompt:'Qual expressão representa 6 grupos com 2 elementos?',options:['6 × 2','6 + 2','6 − 2'],answer:'6 × 2',explanation:'O sinal de multiplicação representa grupos iguais.'},
{id:'facts-1',skill:'facts',prompt:'Quanto é 7 × 8?',options:['54','56','64'],answer:'56',explanation:'7 × 8 = 56. Se não lembrou agora, isso indica um fato para praticar, não uma falha.'}
];

export function evaluateDiagnostic(responses:DiagnosticResponse[],completedAt=new Date().toISOString()):DiagnosticResult {
 const skills:DiagnosticSkill[]=['equal-groups','repeated-addition','arrays','symbolic','facts'];
 const bySkill=Object.fromEntries(skills.map(skill=>{
  const items=responses.filter(item=>item.skill===skill);
  const correct=items.filter(item=>item.correct).length;
  const ratio=items.length?correct/items.length:0;
  return [skill,{correct,total:items.length,level:ratio>=0.8?'secure':ratio>=0.5?'developing':'needs-support'}];
 })) as DiagnosticResult['bySkill'];
 return {responses,bySkill,completedAt};
}
