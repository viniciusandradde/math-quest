/**
 * Perfis por faixa de idade. Guardamos apenas a faixa escolhida — nunca data de nascimento.
 */
export type AgeProfileId = 'age-3-6' | 'age-11-13';

export type AgeProfile = {
  id: AgeProfileId;
  ageRange: string;
  title: string;
  description: string;
  highlights: string[];
};

export const ageProfiles: AgeProfile[] = [
  {
    id: 'age-3-6',
    ageRange: '3 a 6 anos',
    title: 'Pequeno Explorador',
    description: 'Brincadeiras com quantidades, formas e sequências, com um professor de voz que explica tudo bem devagar.',
    highlights: ['Contar tocando em cada objeto', 'Achar o igual e as formas', 'Mais e menos, sequências e juntar']
  },
  {
    id: 'age-11-13',
    ageRange: '11 a 13 anos',
    title: 'Explorador Estratégico',
    description: 'Missões em várias etapas com frações, decimais, porcentagem, geometria e lógica.',
    highlights: ['Mapa com 6 missões estratégicas', 'Memória matemática', 'Laboratório e diagnóstico']
  }
];

export function isAgeProfileId(value: unknown): value is AgeProfileId {
  return ageProfiles.some(profile => profile.id === value);
}

export function getAgeProfile(id: AgeProfileId): AgeProfile {
  return ageProfiles.find(profile => profile.id === id)!;
}
