# Catálogo de assets — Math Quest

## Kit do brand board (em uso no app)

Origem: brand board e folha de poses do mascote fornecidos pela VSA Tecnologia, guardados em `assets/brand/reference/`. Os recortes são gerados por `scripts/extract-brand-kit.py` (Pillow + numpy), que remove o fundo escuro dos personagens e itens preservando o visor do robô.

| Pasta | Conteúdo | Uso |
|---|---|---|
| [kit/hero](kit/hero/) | Arte principal com a marca e "A aventura da matemática" | Tela inicial |
| [kit/mascot](kit/mascot/) | 10 expressões (`expr-*`) e 4 poses de corpo inteiro (`pose-*`) | Feedback, mapa, celebrações |
| [kit/scenarios](kit/scenarios/) | Laboratório Matemático, Fábrica de Robôs, Base Espacial, Ilha dos Desafios (com o nome do cenário) | Mundos da home e faixas das telas |
| [kit/items](kit/items/) | Moeda, energia, engrenagem, cristal, chip IA, baú, estrela, conquista, XP, chave | Coleção, cabeçalho, progresso |
| [kit/printables](kit/printables/) | Prévia do Caderno de Missões | Seção de materiais impressos |

Limitação: o board tem 1672 px de largura, então expressões, cenários e itens foram ampliados 2× a partir de recortes pequenos. Para telas grandes, vale gerar versões em alta resolução de cada elemento e substituir os arquivos mantendo os nomes.

## Identidade visual

- Logo oficial: [math-quest-logo.svg](../brand/math-quest-logo.svg)
- Expressões e poses do mascote: [mascot-expressions.svg](../characters/mascot-expressions.svg)

## Cenários

- Laboratório matemático vetorial: [math-lab.svg](../environments/math-lab.svg)
- Fábrica de robôs: [robot-factory.svg](../environments/robot-factory.svg)
- Base espacial: [space-base.svg](../environments/space-base.svg)
- Ilha dos desafios: [challenge-island.svg](../environments/challenge-island.svg)
- Prévia de cenário premium gerado no Higgsfield (GPT Image 2.6, 16:9): [abrir imagem](https://d8j0ntlcm91z4.cloudfront.net/user_3JEBvIBbBxFXhwnFWwMOJeZAkLe/hf_20261119_154202_16a9fee9-6bdd-4216-a50e-2f407c4711ba.png)
  - Estado: geração concluída.
  - Consumo estimado: 0,25 crédito da conta Higgsfield.
  - Uso: referência visual para o cenário do laboratório.
  - Nota: a prévia está hospedada na biblioteca/CDN do Higgsfield; o SVG vetorial é o asset versionado no GitHub nesta etapa.

## Personagens complementares

- Personagens auxiliares Ponto e Lumi: [companions.svg](../characters/companions.svg)

## Materiais físicos para impressão

- [Missão 01 — Grupos iguais](printables/mission-01-equal-groups.svg)
- [Missão 02 — Matrizes](printables/mission-02-arrays.svg)
- [Missão 03 — Problemas de aventura](printables/mission-03-word-problems.svg) — retomada básica, não representa o nível principal.
- [Missão 04 — Operação Resgate](printables/mission-04-strategy-level.svg) — nível principal do 5º ano.
- [Missão 05 — Geometria e lógica](printables/mission-05-geometry-logic.svg) — nível principal do 5º ano.
- [Gabarito do educador](../../../docs/CHALLENGE-ANSWER-KEY.md)
- Orientações pedagógicas e de impressão: [docs/PRINTABLES.md](../../../docs/PRINTABLES.md)

## Itens de jogo

- Colecionáveis iniciais: [collectibles.svg](../items/collectibles.svg)
- Itens representados: moeda, energia, engrenagem, cristal e estrela.

## Convenções

- Preservar a paleta do brand board: `#0B1B3B`, `#0D6EFD`, `#00E5FF`, `#FF8A00`, `#FFCB57` (acerto `#21C02B`).
- Não usar imagens geradas como substitutas do logo mestre.
- Não inserir textos essenciais dentro de imagens; manter textos no HTML para acessibilidade e tradução.
- Assets devem funcionar em telas mobile e manter contraste.
- Registrar origem, modelo, custo em créditos e finalidade de cada asset gerado.
