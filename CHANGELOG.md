# Changelog

## Não publicado
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
