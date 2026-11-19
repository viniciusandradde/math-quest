# Análise: Missão de Brincar (Tumba da Máscara) e proposta para o Math Quest

> Fonte analisada: repositório [`viniciusandradde/tomb-of-the-mask`](https://github.com/viniciusandradde/tomb-of-the-mask) (commit `e1a91c7`), jogo próprio "Tumba da Máscara", inspirado na *mecânica* do Tomb of the Mask comercial. A metodologia de pausa saudável descrita aqui é **do projeto Tumba da Máscara**; o jogo comercial original não tem esse recurso.
>
> Arquivos lidos: `pwa/js/wellbeing.js` (460 linhas), `ANALISE.md` §3.2.5 e §3.2.7, `docs/MANUAL.md` §5, `docs/ARQUITETURA.md`, `CHANGELOG.md` 1.7–1.8, `tools/lint-text.js`, ganchos em `pwa/js/game.js`.
>
> O padrão para todas as aplicações está em [standards/CHILD-WELLBEING-STANDARD.md](standards/CHILD-WELLBEING-STANDARD.md).

## 1. Resumo

O Tumba da Máscara implementa uma **pausa saudável mediada pelo próprio jogo**:

1. Depois de um tempo de jogo, no fim de uma fase, o jogo **convida (em voz) para uma missão fora da tela**: brincar com carrinhos, procurar brinquedos, pular, beber água, desenhar, abraçar alguém da família.
2. Durante a pausa, o jogo fica **trancado** e responde com carinho, no máximo 4 vezes.
3. Na volta, um **"toca aqui"** celebra a missão cumprida.
4. Depois das aventuras do dia, aparece **"Até amanhã"** e só um adulto libera.

Tudo é configurável numa **área dos pais protegida por um portão** (segurar 3 segundos e responder uma conta).

A metodologia é sólida e bem fundamentada (SBP, OMS, AAP e o estudo de Hiniker et al., 2016, sobre transições mediadas pelo aparelho). **Recomendo adotá-la no Math Quest e transformá-la em padrão da VSA**, com as correções da seção 4. A principal: o portão parental baseado em tabuada não serve para um app de matemática com perfil de 11 a 13 anos.

## 2. Como funciona no Tumba da Máscara

### 2.1 Fluxo

| Etapa | Comportamento | Onde no código |
|---|---|---|
| Contagem | Soma o tempo só enquanto a criança está jogando (estado `play`) | `wbTick` (wellbeing.js:106) |
| Aviso único | Cerca de 3 min antes do limite, **no fim de uma fase**, nunca no meio: "Mais uma fase e vem uma missão especial". Um sol discreto aparece no canto | `wbMaybeWarn` (:117) |
| Checkpoint | Ao terminar uma fase, se o tempo acabou, abre a missão. Se a próxima fase é um chefão e falta pouco, a missão vem antes | `wbCheckpoint` (:123) |
| Teto duro | Limite + 2 min: abre a missão mesmo no meio de uma fase longa (exceto durante o chefão) | :112 |
| Missão | Tela com ilustração grande, voz pt-BR, sininho, botão "ouvir de novo", a **mão como botão** ("toque na mão e vá") e um chime distinto para o adulto ouvir de longe | `wbStartMission`, `renderMission` (:152, :344) |
| Escolha da missão | Sorteio sem repetir as 3 últimas, com peso maior para o tema do mundo e os brinquedos favoritos. **À noite** (18h ou mais) prefere missões calmas e, a partir das 19h, exclui as agitadas | :154–166 |
| Pausa | A Máscara dorme e um sol atravessa o céu até uma casinha: o tempo aparece **sem números**. O app sobrevive a fechar e reabrir, porque usa relógio de parede salvo | `renderBreak` (:368), `wbLoad` (:85) |
| Insistência | Tocar na tela durante a pausa gera no máximo **4 falas**, com 20 s de intervalo e tom crescente: convite, lembrete, "eu espero", "chame um adulto" (com chime). Depois, só um pulso visual. **O tempo nunca reinicia** | `wbInsist` (:189) |
| Retorno | Botão "VOLTEI!", depois uma mão gigante para o "toca aqui", com confete, vibração e parabéns falado | `wbReturn`, `wbHiFive` (:199, :203) |
| Recompensa | Figurinha da missão no "Quadro de Aventuras" e uma medalha. Nada compra fases ou itens | :206–209, :434 |
| Limite diário | Depois das aventuras do dia (padrão 2), mostra "Até amanhã" com lua e a Máscara dormindo. Zera no dia seguinte | :210–219, :91 |
| Liberar antes | O adulto libera e o jogo responde com uma frase **neutra, sem julgamento** | `wbParentUnlock` (:221) |

### 2.2 Área dos pais

- **Acesso:** em Opções > "Pausa saudável (pais)", ou segurando 3 s a engrenagem nas telas da pausa, seguido de uma multiplicação (6×7, 8×7…).
- **Configurações:**
  - ligar/desligar (ligado por padrão no Modo Lúdico);
  - tempo de jogo: 10, 15, 20, 30 ou 45 min, 1 h, 1h30 ou 2 h (padrão 15 min);
  - tempo da pausa: 10, 15, 20 ou 30 min (padrão 15);
  - aventuras por dia: 1, 2 ou 3 (padrão 2);
  - nome da criança, usado nas falas;
  - usar também no Modo Clássico.
- **Ações:** "pausar agora" (missão no fim da fase), "liberar agora" e "zerar o contador de hoje".
- **Informação:** minutos da rodada, aventuras do dia, missões cumpridas, e o texto "SBP / OMS / AAP: até 1 hora de tela por dia de 2 a 5 anos… nada na hora de dormir".

### 2.3 Sobre "horários de uso e bloqueio"

O projeto define **durações**, não **janelas de horário**:
- **Tempo de jogo** por rodada, **tempo da pausa** e **número de rodadas por dia**.
- **Bloqueio até o dia seguinte** depois da última rodada.
- O relógio só é usado para escolher **missões calmas à noite**.

**Não existe** uma regra como "não abrir depois das 19h" ou "só das 8h às 18h". O painel até recomenda "nada na hora de dormir", mas não aplica isso. A proposta para o Math Quest (seção 5) acrescenta essa janela de horários.

### 2.4 Linguagem e voz

- **Voz:** Web Speech pt-BR, velocidade 0,88, um sininho antes de cada fala.
- **Falas:** curtas e na ordem "elogio de processo → convite → missão → ação" (Gunderson et al., 2013).
- **Erros evitados**, por recomendação dos especialistas do projeto: bloquear no meio da fase, contagem regressiva, mensagens longas com "porquês", tom de culpa, falar a cada toque, reiniciar a pausa como punição, recompensa em moedas, vermelho e "X" nas telas da pausa.
- **Verificador de linguagem no CI** (`tools/lint-text.js`): barra palavras como "golpe", "esmag…", "derrotad…", "matar", "morreu", "violên…".

## 3. Pontos fortes que vale padronizar

1. **O app avisa e convida; quem conduz a transição é o adulto.** É co-regulação, adequada até cerca de 6 anos.
2. **Transição em ponto natural de parada**, com a próxima atividade anunciada, menos conflito do que um alarme (Hiniker et al., 2016).
3. **Missão concreta fora da tela** (brinquedos, movimento, família), que troca a tela por algo atraente em vez de só "proibir".
4. **Insistência limitada** (4 falas) e **tempo que nunca reinicia**: firme sem ser punitivo.
5. **Ritual de volta** ("toca aqui") e **recompensa que não compra nada**.
6. **Estado persistente** com relógio de parede: fechar o app não burla a pausa.
7. **Verificador de linguagem no CI**: a regra vira teste automático.
8. **Fontes citadas** e **padrões conservadores**, mas tudo ajustável pelo adulto.

## 4. Problemas encontrados (corrigir na adoção)

| # | Problema | Evidência | Recomendação |
|---|---|---|---|
| 1 | **O dia vira em UTC.** No Brasil (UTC−3), o limite diário zera às **21h**, liberando novas rodadas na hora de dormir | `today = () => new Date().toISOString().slice(0, 10)` (wellbeing.js:82) | Usar a data local (ano-mês-dia do fuso do aparelho) |
| 2 | **Portão parental com tabuada de 1 dígito** (6×7, 8×9…). Crianças a partir de cerca de 8 anos resolvem, e num app de matemática isso é exatamente o que elas treinam | `parentQuestions` (:78), `renderGate` (:233) | 3 a 6 anos: segurar 3 s + conta de dois dígitos. 11 a 13 anos: **PIN de 4 dígitos** criado pelo adulto (seção 5.5) |
| 3 | **Personagens licenciados** nas missões ("Homem de Ferro", "Capitão América"). É risco de marca num produto comercial | :34–35 | Usar "seu super-herói favorito", "seu boneco preferido" |
| 4 | **Linguagem familiar restrita** ("mamãe ou o papai") | :56, :73 | "um adulto", "alguém da família" |
| 5 | **Nome da criança** armazenado e falado | `childName` (:89, :102) | No Math Quest, não coletar nome (política de privacidade atual); usar "explorador(a)" ou nada |
| 6 | **"Nada na hora de dormir" não é aplicado** | texto no painel (:277–279) | Janela de horários configurável (seção 5.3) |
| 7 | **Relógio do aparelho** pode ser adiantado para encurtar a pausa | relógio de parede (:187) | Limitação aceitável num app sem servidor; documentar para os pais |
| 8 | Lógica, conteúdo e desenho no mesmo arquivo, acoplados à classe do jogo | wellbeing.js estende `Game.prototype` | Separar núcleo puro e testável, conteúdo e interface (seção 6) |
| 9 | Pensado para cerca de 5 anos (mão gigante, Máscara dormindo); não há tom para pré-adolescentes | — | Variante "Pausa ativa" para 11 a 13 anos (seção 5.2) |

## 5. Proposta para o Math Quest

### 5.1 Princípio

> **O Math Quest avisa e convida; o adulto decide e conduz.** A pausa é uma ponte para o mundo real, de preferência levando a própria matemática para fora da tela.

### 5.2 Comportamento por perfil

| | Pequeno Explorador (3 a 6) | Explorador Estratégico (11 a 13) |
|---|---|---|
| Ligado por padrão | Sim | Sim (o adulto pode desligar) |
| Referência SBP | 2 a 5 anos: até 1 h/dia, com supervisão | 11 a 18 anos: 2 a 3 h/dia, com supervisão; nunca "virar a noite" |
| Tempo de uso (padrão) | **15 min** (opções 10 a 30) | **30 min** (opções 20 a 60) |
| Pausa (padrão) | **15 min** (10 a 30) | **10 min** (5 a 20) |
| Rodadas por dia (padrão) | **2** (1 a 3), cerca de 30 min/dia | **3** (1 a 4), cerca de 1h30/dia |
| Ponto de parada | Fim da rodada de 4 perguntas | Fim da missão ou da partida |
| Aviso | 1 aviso falado pelo professor de voz, cerca de 3 min antes | 1 aviso discreto na tela, cerca de 3 min antes |
| Missão | Voz calma, ilustração grande, "toque na mão e vá" | Cartão "Pausa ativa" com desafio do mundo real e checklist; tom de igual para igual |
| Volta | "Toca aqui" com confete e figurinha | "Missão cumprida" com figurinha; sem infantilizar |
| Fim do dia | "Até amanhã" (o robô vai dormir) | "Bom trabalho hoje", com resumo do dia |

### 5.3 Janela de horários (novo, além do Tumba)

- **Horário permitido** por perfil:
  - 3 a 6 anos: das 8h às 19h por padrão;
  - 11 a 13 anos: das 7h às 21h por padrão.
- Fora da janela, o app abre na tela **"Hora de descansar"**, com missão calma (história, banho, arrumar a mochila) e sem jogo.
- Se a janela termina durante o uso, a transição acontece no próximo ponto de parada, com o mesmo aviso único.
- Dias da semana diferentes (por exemplo, mais tempo no fim de semana) ficam para uma segunda versão.

### 5.4 Missões do mundo real (ligadas à BNCC)

As missões levam a habilidade do app para o ambiente da criança, além de movimento, hidratação, afeto e criatividade. A ideia é ter 12 ou mais missões por perfil, com categoria, energia (calma ou ativa) e horário recomendado.

**3 a 6 anos** (exemplos):
- **Contar:** "Pegue 5 brinquedos e conte em voz alta, um por um" (EI02ET07, EI03ET07).
- **Formas na casa:** "Ache uma coisa redonda, uma quadrada e uma triangular" (EI03ET05).
- **Separar por cor:** "Junte as meias ou os blocos por cor" (EI02ET05).
- **Fila de tamanhos:** "Arrume 3 brinquedos do menor para o maior" (EI03ET05).
- **Pulos contados:** "Dê 10 pulos contando comigo".
- **Água de explorador:** "Peça um copo de água para um adulto".
- **Abraço e história:** "Escolha um livro e peça para alguém ler com você".
- **Guardar o tesouro:** "Guarde 5 brinquedos no lugar certo".

**11 a 13 anos** (exemplos):
- **Área do quarto:** "Meça o quarto em passos e estime a área" (EF05MA20, EF06MA24).
- **Receita com frações:** "Com um adulto, separe 1/2 xícara e 3/4 de colher" (EF05MA03).
- **Desconto real:** "Procure um preço com desconto e calcule o valor final" (EF05MA06).
- **Pausa visual 20-20-20:** "Olhe para algo a 6 metros por 20 segundos".
- **Movimento:** "Faça 20 polichinelos e alongue as costas".
- **Leitura**, **organizar a mesa**, **ajudar em casa**.

### 5.5 Área dos pais (portão)

- **Entrada:** pela aba "Adultos"/"Progresso" e, nas telas da pausa, segurando 3 s o ícone de engrenagem.
- **Portão para 3 a 6 anos:** segurar 3 s + conta de dois dígitos (por exemplo, 23 + 48). Crianças pequenas ainda não fazem isso.
- **Portão para 11 a 13 anos:** **PIN de 4 dígitos** definido pelo adulto no primeiro acesso, com dica de recuperação local. A tabuada não funciona como portão para quem a está aprendendo.
- **Painel:**
  - ligar/desligar;
  - tempo de uso, tempo de pausa, rodadas por dia e janela de horários;
  - "pausar agora" (missão no próximo ponto de parada), "liberar agora" (frase neutra) e "zerar hoje";
  - **resumo** de hoje e da semana: minutos, rodadas, missões cumpridas, sem dados pessoais.
- Os textos de orientação da SBP aparecem no próprio painel, com link.

### 5.6 Dados e privacidade

- Tudo continua **no aparelho** (IndexedDB/Dexie), com dois novos registros:
  - `wellbeingConfig` por perfil;
  - `wellbeingState`: contagem, estado, início da pausa, missões recentes, data local e rodadas do dia.
- Sem nome da criança. O PIN fica salvo como *hash* com sal, nunca em texto puro.
- A data do dia segue o **fuso local**, o que corrige o problema 1.

### 5.7 Linguagem

- Adotar o verificador de linguagem no CI do Math Quest, estendido para:
  - violência;
  - culpa ("você não obedeceu", "de castigo");
  - termos que excluem ("mamãe ou papai" vira "um adulto");
  - nomes de marcas ou personagens licenciados.

## 6. Plano de implementação no Math Quest

| Etapa | Entrega | Teste |
|---|---|---|
| 1. Núcleo | `src/wellbeing/core.ts`: máquina de estados pura (`idle → warned → mission → break → return → idle/done`, mais `outside-hours`), com relógio injetável e data local | Unitários com relógio falso: aviso único, teto duro, pausa que não reinicia, virada do dia local, janela de horários |
| 2. Conteúdo | `src/wellbeing/missions.ts`: missões por perfil, com categoria, energia, horário e habilidade da BNCC; regras de sorteio | Sem repetir as últimas 3; missões calmas à noite; cobertura por perfil |
| 3. Persistência | Dexie v5: `wellbeingConfig` e `wellbeingState`, preservando a v4 | Migração e estado que sobrevive à recarga |
| 4. Interface 3 a 6 | Missão com professor de voz, pausa com sol atravessando o céu, insistência limitada, "toca aqui" e "até amanhã", integrados ao fim da rodada no `EarlyApp` | Testing Library + Playwright com `page.clock` |
| 5. Interface 11 a 13 | Cartão "Pausa ativa", aviso discreto, resumo do dia, integrados ao fim da missão e da memória no `ExplorerApp` | Idem |
| 6. Área dos pais | Portão por perfil (conta de dois dígitos / PIN), painel de configurações, resumo, "pausar/liberar/zerar" | Fluxos de portão, PIN errado, "liberar" com frase neutra |
| 7. Linguagem e docs | Verificador no CI, `PRIVACY.md`, `AGE-PROFILES.md`, README | CI barra regressões |

## 7. Decisões para o responsável pelo produto

1. **Padrões por perfil** (seção 5.2): 15/15/2 para 3 a 6 anos e 30/10/3 para 11 a 13 anos?
2. **Janela de horários** padrão: 8h–19h e 7h–21h?
3. **Portão:** conta de dois dígitos para 3 a 6 anos e PIN para 11 a 13 anos?
4. **11 a 13 anos ligado por padrão** ou desligado?
5. **Missões com personagens**: confirmar a troca de nomes de marca por termos genéricos.

## Fontes

- Tumba da Máscara: `ANALISE.md` §3.2.5 (metodologia e fontes) e `pwa/js/wellbeing.js`.
- SBP, [#MenosTelas #MaisSaúde](https://www.sbp.com.br/fileadmin/user_upload/_22246c-ManOrient_-__MenosTelas__MaisSaude.pdf) e [atualização 2024](https://portaldeboaspraticas.iff.fiocruz.br/biblioteca/menos-telas-mais-saude-atualizacao-2024/). Faixas: 0–2 anos sem telas; 2–5 até 1 h/dia; 6–10 de 1 a 2 h/dia; 11–18 de 2 a 3 h/dia, nunca "virar a noite"; nada de telas nas refeições. Há notícia de uma atualização de dezembro de 2025 com números diferentes ([Tribuna de Minas](https://tribunademinas.com.br/?p=822612)); conferir no site oficial antes de publicar valores.
- OMS, [2019](https://www.who.int/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more). AAP, [limite de 1 h para pré-escolares](https://www.healio.com/news/pediatrics/20161020/aap-recommends-1-hour-limit-on-digital-media-use-for-preschoolers).
- Hiniker et al., CHI 2016, [transições mediadas pelo aparelho](https://www.washington.edu/news/2016/05/05/two-minute-warnings-make-kids-screen-time-tantrums-worse/). Gunderson et al., 2013, [elogio de processo](https://pmc.ncbi.nlm.nih.gov/articles/PMC3655123). [Co-regulação (OPRE)](https://acf.gov/opre/report/co-regulation-birth-through-young-adulthood-practice-brief).
