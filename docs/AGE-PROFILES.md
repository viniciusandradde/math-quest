# Perfis por faixa de idade

Na primeira vez que o app é aberto, um adulto escolhe quem vai jogar. O app guarda **apenas a faixa de idade** neste aparelho (nunca data de nascimento ou nome) e abre a experiência correspondente. A troca fica na área de Progresso/Adultos, com confirmação em dois toques para evitar trocas acidentais. O progresso de cada perfil fica salvo separadamente.

| Perfil | Faixa | Experiência |
|---|---|---|
| Pequeno Explorador | 3 a 6 anos | 6 brincadeiras curtas com professor de voz |
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

Alinhamento de referência (a validar com educador): BNCC, Educação Infantil, campo de experiência "Espaços, tempos, quantidades, relações e transformações": contar oralmente objetos, relacionar números às quantidades, comparar quantidades, classificar por atributos (forma e cor) e reconhecer sequências.

### Brincadeiras
| Brincadeira | Habilidade | A partir de |
|---|---|---|
| Ache o igual | Discriminação visual e classificação por forma e cor | 3 anos |
| Conte comigo | Contagem com correspondência termo a termo (1 a 3, 5, 10) | 3 anos |
| Onde tem mais? | Comparação de quantidades (mais e, no nível 3, menos) | 3 anos |
| Formas | Círculo, quadrado e triângulo (retângulo no nível 3) | 3 anos |
| O que vem depois? | Padrões AB e, no nível 3, AAB e ABC | 4 anos |
| Juntar | Adição com objetos (até 4, 6 e 10) | 5 anos |

### Níveis adaptativos
O nível de cada brincadeira sobe sozinho com evidência (`src/learning/early.ts`):
- **Nível 1**: duas opções, quantidades pequenas.
- **Nível 2**: a partir de 5 acertos de primeira com pelo menos 60% de acerto de primeira.
- **Nível 3**: a partir de 12 acertos de primeira com pelo menos 70%.

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
