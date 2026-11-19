# Perfis por faixa de idade

Na primeira vez que o app é aberto, um adulto escolhe quem vai jogar. O app guarda **apenas a faixa de idade** neste aparelho (nunca data de nascimento ou nome) e abre a experiência correspondente. A troca fica na área de Progresso/Adultos, com confirmação em dois toques para evitar trocas acidentais. O progresso de cada perfil fica salvo separadamente.

| Perfil | Faixa | Experiência |
|---|---|---|
| Pequeno Explorador | 3 a 6 anos | 10 brincadeiras curtas, com 7 níveis cada e professor de voz |
| Explorador Estratégico | 11 a 13 anos | Mapa de missões, memória, laboratório e diagnóstico |

> O banco atual de missões estratégicas foi escrito no nível do 5º ano com extensão ao 6º. Para alunos de 12 e 13 anos, o próximo passo é acrescentar missões mais desafiadoras.

## Pequeno Explorador (3 a 6 anos)

### Princípios pedagógicos
- **Concreto antes do abstrato** (Montessori, Singapura/CPA): a criança toca em objetos para contar; o numeral vem depois.
- **Correspondência termo a termo**: em "Conte comigo" e "Juntar", cada toque marca um objeto e o professor fala o número.
- **Cardinalidade**: a dica ensina que "o último número que falamos mostra quantos tem".
- **Uma ideia por vez e poucas opções**: no nível 1 há só duas opções e números até 3.
- **Aprendizagem sem erro (errorless learning)**: a opção escolhida que não serve apaga e a criança tenta de novo, com a ajuda do professor. Não há tempo nem punição.
- **Rodadas curtas**: 4 perguntas, respeitando a atenção das crianças pequenas.
- **Redundância de cor e forma**: nas sequências e no "Ache o igual", forma e cor mudam juntas, o que ajuda crianças daltônicas.
- **Apoio para quem ainda não lê números**: no nível 1, cada numeral vem com pontinhos.

### Alinhamento com a BNCC (Educação Infantil)
Campo de experiência **"Espaços, tempos, quantidades, relações e transformações"**, grupos *crianças bem pequenas* (EI02) e *crianças pequenas* (EI03). Alinhamento de referência, descrito com nossas palavras; valide no [documento oficial](http://basenacionalcomum.mec.gov.br/) com um educador.

| Brincadeira | Objetivos |
|---|---|
| Ache o igual, Qual é diferente?, Grande e pequeno, Formas | EI02ET05 (classificar por um atributo: tamanho, cor, forma), EI03ET05 (classificar por semelhanças e diferenças) |
| Conte comigo | EI02ET07 (contar oralmente objetos), EI03ET07 (relacionar números às quantidades) |
| Onde tem mais?, Juntar, Tirar | EI03ET07 |
| O que vem depois?, Antes e depois | EI03ET07 (antes, depois e entre em uma sequência) |

O professor de voz também exercita a escuta e a compreensão de instruções orais (campo "Escuta, fala, pensamento e imaginação"). O alinhamento completo, incluindo o perfil de 11 a 13 anos, está no [README](../README.md#alinhamento-com-a-bncc).

### Brincadeiras
| Brincadeira | Habilidade | Do nível 1 ao nível 7 | A partir de |
|---|---|---|---|
| Ache o igual | Discriminar e classificar por forma, cor e tamanho | 2 opções bem diferentes → 4 opções que diferem em um só atributo, incluindo tamanho | 3 anos |
| Qual é diferente? | Achar a figura que não combina | 3 figuras (forma e cor diferentes) → 5 figuras em que só a cor, a forma ou o tamanho muda | 3 anos |
| Grande e pequeno | Comparar tamanhos | 2 objetos (maior) → 4 objetos com diferenças sutis → "o do meio" | 3 anos |
| Conte comigo | Contar tocando um a um e relacionar ao numeral | Até 3 → 5 → 6 → 8 → 10 → 12 → 15 | 3 anos |
| Onde tem mais? | Comparar quantidades | 2 grupos com diferença grande → 3 grupos até 12, com "mais" e "menos" | 3 anos |
| Formas | Reconhecer formas | Círculo, quadrado e triângulo → retângulo, oval, losango e estrela | 3 anos |
| O que vem depois? | Reconhecer e continuar padrões | AB → AAB → ABC → AABB → figura faltando no meio da fila | 4 anos |
| Antes e depois | Vizinhos dos números | "Depois" até 5 → "antes" → "entre" → até 20 | 4 anos |
| Juntar | Adição com objetos | Soma até 4 → até 10 | 5 anos |
| Tirar | Subtração com objetos ("quantos ficaram?") | Tirar 1 de até 3 → tirar vários de até 10 | 5 anos |

### Níveis adaptativos
Cada brincadeira tem **7 níveis**, definidos em tabelas no código (`src/learning/early.ts`: `MATCH_LEVELS`, `ODD_LEVELS`, `SIZE_LEVELS`, `COUNT_LEVELS`, `COMPARE_LEVELS`, `SHAPE_LEVELS`, `PATTERN_LEVELS`, `NEIGHBOR_LEVELS`, `JOIN_LEVELS`, `TAKE_LEVELS`). O nível sobe sozinho com evidência:

| Nível | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|
| Acertos de primeira | 4 | 8 | 12 | 16 | 20 | 25 |
| Proporção mínima de acertos de primeira | 60% | 65% | 65% | 70% | 70% | 75% |

O que muda com o nível: número de opções (de 2 até 4 ou 5), tamanho das quantidades, sutileza das diferenças (um só atributo, inclusive tamanho), novas formas (retângulo, oval, losango, estrela), padrões mais longos e figura faltando no meio. No nível 1 e 2, cada numeral até 5 vem com pontinhos de apoio.

Estrelas = acertos de primeira. Errar nunca tira estrelas.

### Professor de voz
- Explica cada brincadeira ao abrir, depois fala só o pedido de cada pergunta.
- Voz calma: velocidade 0,78 por padrão ("Bem devagar"), frases curtas e pausa de cerca de 0,65 s entre elas. O adulto pode escolher "Normal".
- Depois de uma tentativa que não deu certo, dá uma dica passo a passo; ao contar, cada objeto acende junto com a palavra falada.
- A frase atual aparece escrita no balão do mascote (legenda), e o botão "Ouvir de novo" repete a explicação mesmo com o som desligado.
- Tecnologia: síntese de voz do próprio aparelho (Web Speech API, pt-BR), sem enviar nada a servidores. A qualidade depende da voz instalada (no Android, a voz do Google em português do Brasil).
- Evolução prevista: as frases são fixas e podem ser gravadas com uma voz profissional (por exemplo, ElevenLabs) e registradas com `registerVoiceClips`, que passa a tocar o áudio no lugar da voz sintética.

## Dados
- Tabela `settings`: `{ id: 'ageProfile', value: 'age-3-6' | 'age-11-13' }`.
- Tabela `earlyAttempts`: brincadeira, nível, acerto de primeira, número de tentativas e horário.
- Nenhum dado sai do aparelho.
