export type Challenge = {
  id: string;
  title: string;
  area: string;
  difficulty: 'Intermediário' | 'Avançado';
  prompt: string;
  question: string;
  unit?: string;
  answer: number;
  tolerance?: number;
  hint: string;
  explanation: string;
};

export const challenges: Challenge[] = [
  {
    id: 'rescue-stock',
    title: 'Estoque de energia',
    area: 'Operações em várias etapas',
    difficulty: 'Intermediário',
    prompt: 'O laboratório tem 70 células. Separe 5 para reserva técnica. Depois, use 8 células em cada um dos 6 robôs.',
    question: 'Depois de separar a reserva e abastecer os robôs, quantas células ficam no estoque geral?',
    answer: 17,
    hint: 'Calcule 6 × 8 para descobrir o consumo. Subtraia esse valor de 70 e depois retire as 5 células reservadas.',
    explanation: '6 × 8 = 48 células para os robôs. 70 − 48 = 22. Como 5 foram separadas para reserva técnica, o estoque geral fica com 22 − 5 = 17 células.'
  },
  {
    id: 'fraction-parts',
    title: 'Peças da nave',
    area: 'Frações de uma quantidade',
    difficulty: 'Intermediário',
    prompt: 'Uma caixa contém 60 peças para reparar a nave. A equipe de engenharia utiliza 2/5 das peças pela manhã e 1/4 do total à tarde.',
    question: 'Quantas peças foram utilizadas ao todo?',
    answer: 39,
    hint: 'Calcule 2/5 de 60 e 1/4 de 60 separadamente. Depois some os resultados.',
    explanation: '2/5 de 60 = 24. 1/4 de 60 = 15. Ao todo: 24 + 15 = 39 peças.'
  },
  {
    id: 'market-change',
    title: 'Compra no centro de comando',
    area: 'Números decimais e dinheiro',
    difficulty: 'Avançado',
    prompt: 'Para montar um kit, a equipe compra 3 cadernos a R$ 12,75 cada e 2 canetas especiais a R$ 4,60 cada. O pagamento é feito com uma nota de R$ 60,00.',
    question: 'Qual é o troco? Digite o valor em reais, usando vírgula ou ponto.',
    unit: 'R$',
    answer: 12.55,
    tolerance: 0.001,
    hint: 'Calcule o custo dos 3 cadernos, depois o das 2 canetas. Some os custos e subtraia de R$ 60,00.',
    explanation: '3 × 12,75 = 38,25. 2 × 4,60 = 9,20. Compra: 38,25 + 9,20 = 47,45. Troco: 60,00 − 47,45 = R$ 12,55.'
  },
  {
    id: 'geometry-platform',
    title: 'Plataforma de pouso',
    area: 'Geometria: área e perímetro',
    difficulty: 'Avançado',
    prompt: 'A equipe vai construir uma plataforma retangular com 18 metros de comprimento e 7 metros de largura.',
    question: 'Quantos metros quadrados de piso serão necessários para cobrir toda a plataforma?',
    unit: 'm²',
    answer: 126,
    hint: 'Para descobrir a área de um retângulo, multiplique comprimento pela largura.',
    explanation: 'Área do retângulo = comprimento × largura = 18 × 7 = 126 m². O perímetro seria 2 × (18 + 7) = 50 m, mas a pergunta solicita a área.'
  },
  {
    id: 'logic-sequence',
    title: 'Sequência do código',
    area: 'Raciocínio lógico',
    difficulty: 'Avançado',
    prompt: 'O painel mostra a sequência: 5, 11, 23, 47, 95, ...',
    question: 'Qual é o próximo número? Descubra a regra antes de responder.',
    answer: 191,
    hint: 'Observe o que acontece quando cada número é multiplicado por 2 e depois recebe mais 1.',
    explanation: 'A regra é multiplicar por 2 e somar 1: 5 × 2 + 1 = 11; 11 × 2 + 1 = 23; 23 × 2 + 1 = 47; 47 × 2 + 1 = 95. Então 95 × 2 + 1 = 191.'
  },
  {
    id: 'combined-fractions',
    title: 'Distribuição de suprimentos',
    area: 'Frações e operações',
    difficulty: 'Avançado',
    prompt: 'Uma estação recebeu 60 unidades de oxigênio e 40 unidades de água. A equipe utiliza 2/5 do oxigênio e 3/4 da água durante a primeira etapa.',
    question: 'Quantas unidades de suprimentos foram utilizadas nessa etapa, somando oxigênio e água?',
    answer: 54,
    hint: 'Calcule 2/5 de 60 e 3/4 de 40. Some as duas quantidades.',
    explanation: '2/5 de 60 = 24 unidades de oxigênio. 3/4 de 40 = 30 unidades de água. Total utilizado: 24 + 30 = 54 unidades.'
  }
];

export function checkChallengeAnswer(challenge: Challenge, raw: string): boolean {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (!normalized) return false;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return false;
  return Math.abs(value - challenge.answer) <= (challenge.tolerance ?? 0);
}
