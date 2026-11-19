# Math Quest — Critérios de aceite PWA 0.1.0-beta.2

## Escopo
Teste controlado, sem cadastro e sem lançamento comercial. Público: estudantes do 5º ano, com responsável acompanhando.

## Verificação automática obrigatória
1. `npm ci` (ou `npm install` se não houver lockfile).
2. `npm run typecheck`.
3. `npm run test`.
4. `npm run build`.
5. `npm run verify:pwa`.

Todos os comandos precisam terminar com código 0.

## Publicação
- GitHub Actions executado com sucesso.
- GitHub Pages habilitado em Settings → Pages → Source: GitHub Actions.
- URL HTTPS publicada e acessível no celular.
- Verificar elegibilidade do GitHub Pages para repositório privado e plano atual.

## Teste Android obrigatório
- Abrir no Chrome Android e instalar pelo menu do navegador.
- Confirmar nome, ícone, tela inicial e modo standalone.
- Com o app carregado, desligar Wi-Fi e dados móveis; fechar e reabrir.
- Navegar por Início, Desafios, Laboratório e Diagnóstico sem conexão.
- Realizar tentativa, fechar e reabrir; confirmar persistência local.
- Publicar atualização, reconectar e confirmar atualização sem perda de dados.
- Testar larguras 360 px, 390 px e tablet; foco, contraste, toque e rolagem.
- Testar links das atividades imprimíveis.

## Condições de reprovação
- Erro de build, teste ou CI.
- Instalação indisponível.
- Tela branca ou rota quebrada offline.
- Atualização que apaga dados locais sem aviso.
- Erro matemático em enunciado ou gabarito.

## Resultado
**PENDENTE DE EXECUÇÃO.** Registrar data, dispositivo, versão, URL e evidências após os testes.
