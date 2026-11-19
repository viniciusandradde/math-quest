# Identidade visual — Math Quest

## Conceito
Um copiloto robótico que acompanha crianças e pré-adolescentes em missões de matemática, tecnologia e descoberta.

## Assinatura
Aprender matemática. Resolver desafios. Criar possibilidades.

## Brand board (referência oficial)
A fonte da identidade é o brand board em `assets/brand/reference/math-quest-brand-board.png`, com a folha de poses do mascote em `assets/brand/reference/math-quest-mascot-poses.png`. Os elementos são usados no app na íntegra, recortados por `scripts/extract-brand-kit.py` para `public/assets/kit/`.

## Paleta
| Papel | Cor | Token CSS |
|---|---|---|
| Primária (fundos) | #0B1B3B | `mq-navy` |
| Secundária (botões azuis) | #0D6EFD | `mq-blue` |
| Destaque (brilhos, foco, progresso) | #00E5FF | `mq-cyan` |
| Ação (botão principal) | #FF8A00 | `mq-orange` |
| Apoio (estrelas, recompensas) | #FFCB57 | `mq-yellow` |
| Acerto (telas de exemplo) | #21C02B | `mq-green` |

Os tokens ficam em `src/styles/index.css` (`@theme` do Tailwind) e geram classes como `bg-mq-navy` e `text-mq-cyan`.

## Tipografia
- **Orbitron** para títulos, rótulos curtos e o botão JOGAR.
- **Inter** para textos, números e contas (classe `num`). Os algarismos da Orbitron são estilizados demais para leitura de contas por crianças.
- As duas fontes são empacotadas localmente (`@fontsource`, subconjunto latino) para funcionar offline.
- Atenção: na Orbitron, o til de "ã" e "õ" é um traço curto e pode lembrar um acento grave. Prefira títulos curtos e revise palavras com til.

## Mascote no app
| Situação | Elemento |
|---|---|
| Avatar do explorador | Expressão Feliz |
| Próxima missão | Incentivando |
| Enunciado do desafio | Desafiando |
| Acerto | Comemorando (+ confete e som) |
| Resposta a rever | Incentivando (sem punição) |
| Memória: início, par, sem par | Estudando, Animado, Surpreso |
| Diagnóstico e resultado | Pensativo, Confiante |
| Laboratório | Explicando (3 × 4 = 12) |
| Área de progresso | Confiante |
| Mapa de missões, missão concluída, diagnóstico | Poses apresentando, pulando, pensando e acenando |

## Itens e recompensas
Os 10 itens do board formam a coleção do explorador. Cada um é ganho com uma evidência de aprendizagem (regras em `src/learning/rewards.ts`): moeda (primeiro acerto), energia (5 acertos no aquecimento), engrenagem (tentar as 6 missões), cristal (3 missões resolvidas), chip IA (1 partida da memória), baú (todas as missões), estrela (primeira missão), conquista (3 partidas), XP (nível 3) e chave (diagnóstico). O XP vem de acertos e conclusões; errar nunca tira pontos.

## Direção de arte
- Futurista e tecnológica, sem parecer infantilizada.
- Robótica, laboratório, circuitos e exploração.
- Alto contraste e legibilidade em telas pequenas.
- Animações funcionais, sem excesso de estímulos; todas respeitam `prefers-reduced-motion`.
- Efeitos sonoros curtos sintetizados no navegador, com botão para silenciar.
- O mascote deve apoiar a aprendizagem, nunca competir com o conteúdo.

## Arquivos
- assets/brand/math-quest-logo.svg: logo vetorial fonte.
- public/brand/math-quest-logo.svg: logo usado pela aplicação.
- public/favicon.svg: favicon.
- public/icons/: ícones PWA.
- public/assets/kit/: elementos do brand board (hero, mascote, cenários, itens e caderno).

## Uso
Não distorcer proporções, não alterar cores arbitrariamente e manter área de respiro ao redor do logo.
