# Math Quest 0.1.0-beta.1 — aceite técnico do PWA

**Estado:** candidato beta; não declarar publicado, instalável ou validado antes dos testes.

## Escopo
- Desafios matemáticos do 5º ano e materiais para impressão.
- Diagnóstico inicial e laboratório de multiplicação como apoio.
- Aplicativo mobile-first com manifest e service worker.
- Progresso da prática de multiplicação salvo localmente no IndexedDB.
- Controle de instalação quando o navegador disponibiliza o evento.
- Indicação de conexão e aviso de atualização disponível.
- Sem cadastro, backend, anúncios ou sincronização.

**Limitações:** a área de responsáveis resume desafios, memória e aquecimento, mas ainda não mostra o diagnóstico nem recomendações. Os ícones atuais são SVG, cuja aceitação para instalação varia entre navegadores. Para distribuição Android ampla, criar e validar ícones PNG 192 e 512 pixels. A indicação "sem internet" não garante que todos os recursos foram armazenados em cache; isso exige teste real após a primeira visita online.

## Critérios de aceite obrigatórios

### CI
- [ ] GitHub Actions habilitado e execução de push na main visível.
- [ ] `npm run typecheck` passou.
- [ ] `npm run test` passou.
- [ ] `npm run build` passou.
- [ ] `npm run verify:pwa` passou.
- [ ] Artefato `dist` gerado sem erros.

### Publicação
- [ ] GitHub Pages disponível para a visibilidade do repositório e plano da conta.
- [ ] Settings → Pages → Source = GitHub Actions.
- [ ] Workflow de deploy concluído com sucesso.
- [ ] URL HTTPS acessível em `https://viniciusandradde.github.io/math-quest/`.
- [ ] Manifest e service worker encontrados pelo DevTools.
- [ ] Ícone da aplicação confere com a marca aprovada.

### Teste no Android
- [ ] Abrir pelo Chrome no Android, com internet.
- [ ] Verificar se o navegador oferece a instalação; usar a opção do menu quando necessário.
- [ ] Instalar e abrir pelo ícone na tela inicial.
- [ ] Confirmar navegação, desafios e impressão/abertura de folhas.
- [ ] Desligar internet, fechar e reabrir; confirmar funcionamento das telas visitadas e arquivos necessários.
- [ ] Registrar tentativa na prática, reiniciar e confirmar persistência.
- [ ] Publicar nova versão e confirmar aviso de atualização.
- [ ] Verificar legibilidade, contraste, tamanho de toque e rolagem no celular.
- [ ] Verificar comportamento em Android com navegador sem suporte a instalação PWA.

### Piloto educacional
- [ ] Responsável informado de que se trata de beta.
- [ ] Conteúdos e gabaritos revisados por educador.
- [ ] Teste supervisionado, sem contas de crianças nem dados enviados a servidores.
- [ ] Problemas registrados no GitHub e priorizados antes de oferta pública.

## Procedimento de verificação local

```bash
npm install
npm run typecheck
npm run test
npm run build
npm run verify:pwa
npm run preview
```

O comando `verify:pwa` verifica a existência de manifest, service worker e arquivos essenciais e a coerência básica das rotas. Ele **não substitui** um teste real de instalação ou uso offline.

## Decisão

- **Aceite de código beta:** somente após CI verde.
- **Aceite de PWA instalável:** somente após teste real em Android e HTTPS.
- **Oferta a outras crianças:** somente após revisão pedagógica, privacidade, acessibilidade e piloto supervisionado.
