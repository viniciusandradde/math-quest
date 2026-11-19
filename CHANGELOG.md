# Changelog

## Não publicado
- Pausa saudável (Padrão VSA de Bem-Estar Digital Infantil): depois do tempo combinado, no próximo ponto de parada, o app propõe uma missão fora da tela. 3 a 6 anos: missão falada pelo professor de voz, "toque na mão e vá", sol atravessando o céu sem números, no máximo 4 falas de insistência, "toca aqui" na volta e "Até amanhã" depois das rodadas do dia. 11 a 13 anos: aviso discreto, cartão "Pausa ativa" com matemática do mundo real e resumo do dia.
- Padrões aprovados: 15 min de uso, 15 de pausa e 2 rodadas (3 a 6 anos, das 8h às 19h); 30, 10 e 3 (11 a 13 anos, das 7h às 21h, ligado por padrão). Teto de 2 min além do limite e data sempre no fuso local.
- 25 missões fora da tela (13 + 12), com habilidade da BNCC nas de matemática, sorteio sem repetir as 3 últimas e só missões calmas à noite.
- Área dos adultos protegida: segurar 3 s + conta de dois dígitos (3 a 6) ou PIN de 4 números guardado como hash com sal, com bloqueio de 30 s após 3 erros (11 a 13). A troca de perfil passou para dentro dela.
- Painel "Pausa saudável": ligar/desligar, tempo de uso, pausa, rodadas, janela de horários, pausar no próximo ponto de parada, liberar (frase neutra), zerar o dia, gráfico dos últimos 7 dias e referência da SBP.
- Banco local schema v5 (tabela `wellbeing` por perfil), preservando os dados anteriores.
- Verificador de linguagem `npm run lint:text` no CI (violência, culpa, "mamãe ou papai" e marcas licenciadas).
- Pequeno Explorador ampliado: 4 brincadeiras novas (Qual é diferente?, Grande e pequeno, Antes e depois, Tirar) e 7 níveis por brincadeira, com novas formas (oval, losango, estrela), tamanho como atributo, 3 grupos para comparar, padrões AABB, figura faltando no meio e números até 20.
- README reescrito com a metodologia completa: referências e onde aparecem, ciclo pedagógico, princípios para 3 a 6 e 11 a 13 anos, professor de voz, avaliação e recompensas, acessibilidade e alinhamento com a BNCC (Educação Infantil e Matemática do Ensino Fundamental).
- Perfis por idade: na primeira abertura o adulto escolhe 3 a 6 ou 11 a 13 anos; só a faixa fica salva e a troca exige confirmação.
- Pequeno Explorador (3 a 6 anos): Ache o igual, Conte comigo (tocar e contar), Onde tem mais?, Formas, O que vem depois? e Juntar, com duas opções no nível 1, níveis adaptativos e estrelas por acerto de primeira.
- Professor de voz calmo (Web Speech pt-BR, bem devagar, frases curtas com pausas, legenda e botão "Ouvir de novo"), com velocidade ajustável na área dos adultos.
- Banco local schema v4 (`settings` e `earlyAttempts`), preservando os dados anteriores.
- Novo visual baseado no brand board: paleta oficial, Orbitron + Inter empacotadas para uso offline, botões com profundidade, campo de estrelas, confete e animações que respeitam "reduzir movimento".
- Todos os elementos do board em uso: arte principal, 10 expressões e 4 poses do mascote, 4 cenários, 10 itens e o Caderno de Missões.
- Tela inicial no estilo do board: cartão do explorador com nível e XP, botão JOGAR, próxima missão, Mapa de Missões em trilha e coleção de itens.
- Recompensas ligadas a evidências de aprendizagem (XP, nível e itens), com aviso animado ao conquistar um item.
- Efeitos sonoros sintetizados (acerto, tente de novo, recompensa) com botão para silenciar.
- Barra de abas inferior no estilo de aplicativo; aquecimento e laboratório viraram módulos próprios.
- Corrige regra de botão fora de camada CSS que anulava tamanhos e fontes do Tailwind.
- Corrige a build do TypeScript que bloqueava o CI e a publicação (chave ausente no App e tipos do PWA).
- Jogo da memória matemática no app: frações, porcentagem, decimais, área e perímetro, sem cronômetro e com feedback explicativo.
- Tentativas dos desafios estratégicos e partidas de memória salvas no IndexedDB (schema v3, preservando dados anteriores).
- Área de responsáveis com progresso por desafio, memória e aquecimento.
- Navegação adaptada a celulares estreitos e marcação da tela atual para leitores de tela.
- Testes de componentes, do App e do banco local (fake-indexeddb).

## 0.1.0 — Fundação do MVP
- README institucional e documentação inicial do produto.
- Identidade visual vetorial e ícones PWA.
- Aplicação React, TypeScript e Vite.
- Primeira atividade interativa de multiplicação.
- Registro local de tentativas usando Dexie e IndexedDB.
- Testes unitários das regras de multiplicação.
- Pipeline de qualidade e publicação no GitHub Pages.
