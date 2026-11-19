/** Caminhos dos elementos extraídos do brand board (public/assets/kit). */
const base = import.meta.env.BASE_URL + 'assets/kit/';

export type Expression =
  | 'feliz' | 'animado' | 'pensativo' | 'surpreso' | 'confiante'
  | 'explicando' | 'comemorando' | 'estudando' | 'desafiando' | 'incentivando';
export type Pose = 'idle' | 'presenting' | 'celebrating' | 'thinking';
export type Scenario = 'laboratorio' | 'fabrica' | 'base-espacial' | 'ilha';

export const expressionLabel: Record<Expression, string> = {
  feliz: 'Robô Math Quest feliz',
  animado: 'Robô Math Quest animado',
  pensativo: 'Robô Math Quest pensativo',
  surpreso: 'Robô Math Quest surpreso',
  confiante: 'Robô Math Quest confiante',
  explicando: 'Robô Math Quest explicando 3 × 4 = 12',
  comemorando: 'Robô Math Quest comemorando',
  estudando: 'Robô Math Quest estudando',
  desafiando: 'Robô Math Quest desafiando',
  incentivando: 'Robô Math Quest incentivando com uma estrela'
};

export const poseLabel: Record<Pose, string> = {
  idle: 'Robô Math Quest acenando',
  presenting: 'Robô Math Quest apresentando',
  celebrating: 'Robô Math Quest pulando de alegria',
  thinking: 'Robô Math Quest pensando'
};

export const scenarioLabel: Record<Scenario, string> = {
  laboratorio: 'Laboratório Matemático',
  fabrica: 'Fábrica de Robôs',
  'base-espacial': 'Base Espacial',
  ilha: 'Ilha dos Desafios'
};

export const kit = {
  hero: base + 'hero/math-quest-hero.webp',
  printables: base + 'printables/caderno-de-missoes.webp',
  expression: (name: Expression) => base + 'mascot/expr-' + name + '.webp',
  pose: (name: Pose) => base + 'mascot/pose-' + name + '.webp',
  scenario: (name: Scenario) => base + 'scenarios/' + name + '.webp',
  item: (name: string) => base + 'items/' + name + '.webp'
};
