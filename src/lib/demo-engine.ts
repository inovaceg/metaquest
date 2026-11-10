import type { Patient } from '@/data/patients';
export type Message = { role:'professional'|'patient';text:string };
export interface ConversationEngine { respond(patient:Patient, message:string, level:string, history:Message[]):Promise<string> }
export class DemoEngine implements ConversationEngine {
 async respond(patient:Patient,message:string,level:string,history:Message[]){
  const lower=message.toLocaleLowerCase('pt-BR');const disclosure=patient.disclosures.find(d=>d.keywords.some(k=>lower.includes(k))&&!history.some(m=>m.role==='patient'&&m.text.includes(d.reply)));
  if(disclosure){if(level==='avancado'&&history.filter(m=>m.role==='professional').length<2)return 'Ainda não sei se consigo falar disso. Podemos ir com calma?';return disclosure.reply;}
  if(/entendo|imagino|obrigad|acolh|tempo|à vontade|a vontade/.test(lower))return level==='avancado'?'Tudo bem… preciso de um pouco de tempo.':'Obrigad'+(patient.id==='marina'||patient.id==='helena'?'a':'o')+' por me ouvir. É difícil colocar isso em palavras.';
  if(/\?|como|conte|pode|gostaria/.test(lower))return level==='iniciante'?patient.disclosures.find(d=>!history.some(m=>m.text===d.reply))?.reply??'Acho que já contei o que consigo por hoje. Gostaria de pensar um pouco nisso.':'Você pode me perguntar algo mais específico? Não sei muito bem por onde começar.';
  return 'Pode me explicar melhor o que você quer dizer?';
 }
}
export const demoEngine=new DemoEngine();
export type DemoReport={id:string;patientId:string;patientName:string;level:string;duration:number;createdAt:string;notes:string;messages?:Message[];observations:{title:string;evidence:string;reflection:string}[]};
export function createReport(patient:Patient,level:string,duration:number,notes:string,messages:Message[],keepTranscript:boolean):DemoReport{
 const professional=messages.filter(m=>m.role==='professional');
 const question=professional.find(m=>/\?|como|conte|pode/.test(m.text.toLowerCase()));
 const empathy=professional.find(m=>/entendo|imagino|obrigad|sente|sentindo|difícil|dificil|tempo/.test(m.text.toLowerCase()));
 return {id:crypto.randomUUID(),patientId:patient.id,patientName:patient.name,level,duration,notes,createdAt:new Date().toISOString(),...(keepTranscript?{messages}:{}),observations:[
 {title:'Formulação de perguntas',evidence:question?(keepTranscript?`Pergunta registrada: “${question.text}”`:'Foi identificada uma pergunta. O trecho não foi salvo, conforme sua escolha de privacidade.'):'Não foi encontrada uma pergunta pelos critérios simples da demonstração.',reflection:'Reflita se as perguntas abriram espaço para a narrativa ou restringiram as possibilidades de resposta.'},
 {title:'Acolhimento e comunicação',evidence:empathy?(keepTranscript?`Trecho para reflexão: “${empathy.text}”`:'Foi identificado um possível trecho de acolhimento. O conteúdo não foi salvo, conforme sua escolha de privacidade.'):'Não foi localizado um trecho pelos critérios simples de acolhimento. Isso não demonstra ausência de empatia.',reflection:'Como você validou a experiência da pessoa sem antecipar explicações ou interpretações?'},
 {title:'Escuta e informações relevantes',evidence:`Foram registradas ${professional.length} intervenções do profissional nesta demonstração roteirizada.`,reflection:'Que informações foram exploradas? O que ainda gostaria de compreender sobre rotina, contexto e apoio?'},
 {title:'Organização e condução',evidence:`Tempo no ambiente: ${Math.floor(duration/60)} min ${duration%60} s. Pausas não estão incluídas.`,reflection:'Houve espaço para abertura, exploração e fechamento? Que objetivo você escolheria para a próxima prática?'}]};
}
export function savedReports():DemoReport[]{try{return JSON.parse(sessionStorage.getItem('vrclinic-reports')||'[]');}catch{return [];}}
export function saveReport(report:DemoReport){sessionStorage.setItem('vrclinic-reports',JSON.stringify([report,...savedReports()]));}
