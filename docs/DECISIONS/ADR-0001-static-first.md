# ADR-0001 — MVP estático com GitHub Pages

- Status: Aceito
- Data: 2026-11-19

## Contexto
O primeiro objetivo é validar a experiência pedagógica e o uso em celular sem criar custo operacional ou backend prematuramente.

## Decisão
Usar React, TypeScript e Vite como aplicação estática, publicada pelo GitHub Actions no GitHub Pages. O progresso inicial fica no IndexedDB via Dexie.

## Consequências
- Deploy simples e baixo custo.
- Pode funcionar offline após cache inicial.
- Não há sincronização entre dispositivos.
- Dados locais podem ser apagados pelo navegador.
- Recursos que exigem segredo ou dados compartilhados ficam fora do MVP.
