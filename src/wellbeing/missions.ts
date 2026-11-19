/**
 * Missões fora da tela e falas da pausa saudável.
 * Regras de conteúdo do Padrão VSA: frase curta, uma ação por missão, segura em casa,
 * sem marcas licenciadas e com "um adulto" ou "alguém da família".
 */
import type { AgeProfileId } from '../learning/profiles';

export type MissionCategory = 'mundo-real' | 'movimento' | 'brinquedo' | 'familia' | 'hidratacao' | 'criatividade' | 'descanso' | 'casa';

export type Mission = {
  id: string;
  profile: AgeProfileId;
  category: MissionCategory;
  energy: 'calma' | 'ativa';
  title: string;
  /** Elogio de processo, convite, missão e ação. */
  text: string;
  /** Item do kit visual usado como ilustração. */
  icon: string;
  /** Habilidade da BNCC quando a missão leva a matemática para o mundo real. */
  skill?: string;
};

const early = (m: Omit<Mission, 'profile'>): Mission => ({ ...m, profile: 'age-3-6' });
const explorer = (m: Omit<Mission, 'profile'>): Mission => ({ ...m, profile: 'age-11-13' });

export const missions: Mission[] = [
  early({ id: 'contar-brinquedos', category: 'mundo-real', energy: 'calma', icon: 'bau', skill: 'EI02ET07', title: 'Conte seus brinquedos',
    text: 'Você contou com muita atenção! Agora pegue cinco brinquedos e conte em voz alta, um por um. Toque na mão e vá!' }),
  early({ id: 'formas-casa', category: 'mundo-real', energy: 'ativa', icon: 'cristal', skill: 'EI03ET05', title: 'Caça às formas',
    text: 'Você conhece muitas formas! Procure pela casa uma coisa redonda, uma quadrada e uma em forma de triângulo. Toque na mão e vá!' }),
  early({ id: 'separar-cores', category: 'mundo-real', energy: 'calma', icon: 'moeda', skill: 'EI02ET05', title: 'Cada cor no seu montinho',
    text: 'Que olhar caprichado! Junte seus blocos ou brinquedos pela cor, cada cor no seu montinho. Toque na mão e vá!' }),
  early({ id: 'fila-tamanhos', category: 'mundo-real', energy: 'calma', icon: 'estrela', skill: 'EI03ET05', title: 'Fila de tamanhos',
    text: 'Você comparou muito bem! Arrume três brinquedos em fila, do menor para o maior. Toque na mão e vá!' }),
  early({ id: 'pulos-contados', category: 'movimento', energy: 'ativa', icon: 'energia', title: 'Pulos contados',
    text: 'Seus dedinhos trabalharam muito. Agora é a vez das pernas! Dê dez pulos e conte cada um em voz alta. Toque na mão e vá!' }),
  early({ id: 'agua', category: 'hidratacao', energy: 'calma', icon: 'cristal', title: 'Água de explorador',
    text: 'Que aventura! Todo explorador precisa de água. Peça para um adulto um copo de água e beba tudinho. Toque na mão e vá!' }),
  early({ id: 'historia', category: 'familia', energy: 'calma', icon: 'chave', title: 'Hora da história',
    text: 'Você foi muito bem! Escolha um livro e peça para alguém da família ler com você. Toque na mão e vá!' }),
  early({ id: 'guardar-tesouro', category: 'casa', energy: 'ativa', icon: 'bau', title: 'Guardar o tesouro',
    text: 'Você guardou muitas estrelas! Agora guarde cinco brinquedos no lugar certo, como um explorador. Toque na mão e vá!' }),
  early({ id: 'abraco', category: 'familia', energy: 'calma', icon: 'conquista', title: 'Abraço de equipe',
    text: 'Você é um ótimo explorador. Dê um abraço bem apertado em alguém da família e conte o que você aprendeu. Toque na mão e vá!' }),
  early({ id: 'desenho', category: 'criatividade', energy: 'calma', icon: 'engrenagem', title: 'Desenho dos números',
    text: 'Você pensou muito hoje! Pegue papel e lápis e desenhe os números que você conhece. Toque na mão e vá!' }),
  early({ id: 'janela', category: 'descanso', energy: 'calma', icon: 'estrela', title: 'Olhos de explorador',
    text: 'Seus olhos merecem um passeio. Vá até a janela e procure um passarinho, uma árvore e uma nuvem. Toque na mão e vá!' }),
  early({ id: 'danca-robo', category: 'movimento', energy: 'ativa', icon: 'chip', title: 'Dança do robô',
    text: 'Você brincou com muita alegria! Peça para um adulto colocar uma música e dance como um robô. Toque na mão e vá!' }),
  early({ id: 'passeio-boneco', category: 'brinquedo', energy: 'ativa', icon: 'xp', title: 'Passeio do boneco',
    text: 'Que bom explorador! Pegue o seu boneco favorito e leve ele para passear por três lugares da casa. Toque na mão e vá!' }),

  explorer({ id: 'area-quarto', category: 'mundo-real', energy: 'ativa', icon: 'engrenagem', skill: 'EF05MA20 · EF06MA24', title: 'Área do quarto',
    text: 'Meça o comprimento e a largura do seu quarto em passos. Multiplique os dois números e estime a área em "passos quadrados".' }),
  explorer({ id: 'receita-fracoes', category: 'mundo-real', energy: 'calma', icon: 'cristal', skill: 'EF05MA03', title: 'Frações na cozinha',
    text: 'Com um adulto, separe 1/2 xícara de água e 3/4 de colher de açúcar. Qual medida é maior?' }),
  explorer({ id: 'desconto', category: 'mundo-real', energy: 'calma', icon: 'moeda', skill: 'EF05MA06', title: 'Desconto de verdade',
    text: 'Ache um preço numa embalagem ou folheto e calcule quanto ficaria com 25% de desconto.' }),
  explorer({ id: 'estimar-passos', category: 'mundo-real', energy: 'ativa', icon: 'energia', title: 'Estimativa em passos',
    text: 'Estime quantos passos há do seu quarto até a porta de casa. Depois conte e compare com a estimativa.' }),
  explorer({ id: 'padrao-casa', category: 'mundo-real', energy: 'calma', icon: 'chip', title: 'Padrões pela casa',
    text: 'Procure um padrão que se repete na casa (azulejo, tecido, grade) e descubra a regra que ele segue.' }),
  explorer({ id: 'olhos-20', category: 'descanso', energy: 'calma', icon: 'estrela', title: 'Pausa para os olhos',
    text: 'Olhe para algo a uns 6 metros de distância por 20 segundos. Repita três vezes, piscando devagar.' }),
  explorer({ id: 'polichinelos', category: 'movimento', energy: 'ativa', icon: 'energia', title: 'Corpo em movimento',
    text: 'Faça 20 polichinelos e alongue braços e costas por um minuto.' }),
  explorer({ id: 'agua', category: 'hidratacao', energy: 'calma', icon: 'cristal', title: 'Hidratação',
    text: 'Beba um copo de água e, se quiser, faça um lanche leve.' }),
  explorer({ id: 'leitura', category: 'descanso', energy: 'calma', icon: 'chave', title: 'Duas páginas',
    text: 'Leia duas páginas de um livro ou gibi que você goste.' }),
  explorer({ id: 'organizar', category: 'casa', energy: 'ativa', icon: 'bau', title: 'Mochila pronta',
    text: 'Organize a sua mesa ou a mochila para amanhã.' }),
  explorer({ id: 'ajudar', category: 'familia', energy: 'ativa', icon: 'conquista', title: 'Ajuda em casa',
    text: 'Ajude alguém da sua casa em uma tarefa por alguns minutos.' }),
  explorer({ id: 'respirar', category: 'descanso', energy: 'calma', icon: 'xp', title: 'Respiração 4 por 4',
    text: 'Respire fundo cinco vezes: 4 segundos para encher o peito e 4 segundos para soltar.' })
];

export function missionsFor(profile: AgeProfileId): Mission[] {
  return missions.filter(mission => mission.profile === profile);
}

export function findMission(profile: AgeProfileId, id: string | undefined): Mission | undefined {
  return missionsFor(profile).find(mission => mission.id === id);
}

/** Sorteio sem repetir as 3 últimas; à noite prefere missões calmas e, a partir das 19h, exclui as agitadas. */
export function pickMission(profile: AgeProfileId, recent: string[], hour: number, random: () => number = Math.random): Mission {
  const pool = missionsFor(profile).filter(mission => !recent.includes(mission.id));
  const candidates = pool.length ? pool : missionsFor(profile);
  const weights = candidates.map(mission => {
    let weight = mission.category === 'mundo-real' ? 1.5 : 1;
    if (hour >= 18 && mission.energy === 'calma') weight *= 2;
    if (hour >= 19 && mission.energy === 'ativa') weight = 0;
    return weight;
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return candidates[0];
  let r = random() * total;
  for (let i = 0; i < candidates.length; i += 1) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

/** Falas da pausa (perfil 3 a 6, professor de voz) e textos para 11 a 13. */
export const lines = {
  early: {
    warning: ['Você está indo muito bem! Mais uma rodada e vem uma missão especial.', 'Olha quantas estrelas! Daqui a pouquinho tem uma aventura fora da tela.'],
    lastWarning: 'Mais uma rodada e vem a última aventura de hoje.',
    accept: ['Isso aí! Vai lá, eu fico aqui esperando.', 'Combinado! Divirta-se. Depois a gente continua.'],
    insist: [
      'Oi! A missão está te esperando. Vai lá, vai ser divertido!',
      'Primeiro a aventura lá fora, depois o jogo. Pode ir!',
      'Eu não vou a lugar nenhum. Quando a mão aparecer, você volta. Combinado?',
      'Vamos chamar um adulto para fazer a missão com você? Vai lá chamar.'
    ],
    back: ['Parabéns! Você completou a missão! Toca aqui na minha mão!', 'Você conseguiu! Bate aqui na mão para continuar!'],
    backLast: 'Parabéns! Essa foi a última aventura de hoje. Toca aqui!',
    hifive: ['Isso! Vamos brincar mais um pouco!', 'Eba! Vamos continuar!'],
    unlock: 'Combinado com o adulto. Vamos continuar!',
    goodnight: 'Que dia de aventuras! Agora o robô vai descansar até amanhã.',
    outsideHours: 'Agora é hora de descansar. Amanhã a gente brinca de novo!'
  },
  explorer: {
    warning: 'Daqui a uns 3 minutos vem uma Pausa ativa. Termine a missão com calma.',
    lastWarning: 'A próxima pausa encerra o tempo de tela de hoje.',
    unlock: 'Liberado por um adulto. Bons estudos!',
    goodnight: 'Bom trabalho hoje! O tempo de tela combinado acabou. Até amanhã.',
    outsideHours: 'Fora do horário combinado. Volte no horário de uso.'
  }
};
