# Privacidade e proteção de crianças

Este documento registra os princípios de privacidade para o MVP. Não substitui a política de privacidade pública nem a avaliação jurídica necessária antes da oferta comercial.

## MVP local
- Não exige cadastro.
- Não envia progresso para servidor.
- Pergunta apenas a faixa de idade de quem vai jogar (3 a 6 ou 11 a 13 anos) e guarda só essa faixa no aparelho; não pede nome nem data de nascimento.
- Mantém tentativas no armazenamento local do navegador (IndexedDB):
  - prática de multiplicação: combinação, tentativas, acertos e data;
  - diagnóstico: alternativa escolhida por questão e data;
  - desafios estratégicos: identificador do desafio, acerto, valor numérico respondido e data;
  - memória matemática: número de tentativas e pares de cada partida concluída e data;
  - brincadeiras de 3 a 6 anos: brincadeira, nível, se acertou de primeira, número de tentativas e data.
- O professor de voz usa a síntese de voz do próprio aparelho; nenhum texto ou áudio é enviado a servidores.
- Não armazena respostas em texto livre: só o valor numérico, para evitar que nomes ou outros dados digitados pela criança sejam guardados.
- Não solicita localização, contatos, câmera ou microfone.
- Não inclui publicidade comportamental.
- Não cria perfil público ou ranking de estudantes.

## Riscos conhecidos
- Pessoas com acesso ao mesmo dispositivo podem visualizar o progresso local.
- Limpar dados do navegador pode apagar o histórico.
- O cache offline pode manter recursos até ser atualizado ou removido.
- A publicação do código no GitHub Pages torna os arquivos frontend acessíveis publicamente.

## Evolução com contas
Antes de lançar contas, sincronização ou gestão de turmas:
- definir base legal e fluxos de consentimento aplicáveis;
- observar o melhor interesse de crianças e adolescentes;
- coletar apenas dados necessários;
- criar controles para responsáveis;
- documentar retenção, exportação e exclusão;
- implementar autenticação, autorização e isolamento entre usuários;
- avaliar fornecedores, transferências internacionais e operadores;
- publicar política de privacidade clara e acessível.

## Referência
A implementação deve ser revisada conforme a LGPD (Lei nº 13.709/2018), especialmente as regras aplicáveis ao tratamento de dados pessoais de crianças e adolescentes.
