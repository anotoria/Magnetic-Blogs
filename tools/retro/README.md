# Retro da semana (Stories de segunda, 07h)

Toda segunda às 07h (Brasília) sobem Stories no estilo **O Diário Magnético** recapitulando os posts de feed da semana anterior (segunda a domingo) e mostrando a previsão dos posts da semana que começa.

## Rotina (feita pela tarefa agendada de domingo)

1. **Ler os posts no HighLevel** (MCP Highlevel, `get-posts`, locationId `6i6bFmaWCvKhKAE7OLqd`):
   - `type: "published"` da segunda anterior 03:00Z até o domingo 03:00Z do dia seguinte → os posts da semana. Use só os de `type: "post"` (ignore stories).
   - `type: "scheduled"` da segunda 03:00Z até o sábado seguinte → a previsão. Só `type: "post"`.
   - Se o resultado for grande demais, salve em arquivo e filtre com Python.
2. **Montar o JSON** em `tools/retro/semanas/<AAAA-MM-DD da segunda>.json` (modelo: `2026-10-05.json`):
   - Um item em `dias` por dia que teve post, com uma matéria por post: `titulo` curto (com `*palavra*` em destaque), `resumo` de 1 frase, `palavra` (a palavra-chave do "Comenta X" da legenda) e `capa` (URL do `media[0]` do post).
   - `palavras`: cada palavra-chave da semana uma vez, com o material que ela entrega (tirado da legenda). HIGH por último.
   - `previsao`: um tema por dia da semana nova (só o primeiro post de cada dia), e `previsao_frase` divertida de "previsão do tempo".
   - **Tudo sai das legendas.** Nada de número, resultado ou dado inventado.
3. **Gerar:** `python3 tools/retro/retro.py tools/retro/semanas/<data>.json` → `social/retro-<data>/story-N.jpg`. Olhe as prévias em `/tmp/retro-<data>/story-N.png` e corrija textos que estourarem.
4. **Publicar no GitHub:** commit (autor `Rodrigo Mendes <gestao.notoria@gmail.com>`) e push na `main`. Use o hash do commit nas URLs: `https://raw.githubusercontent.com/anotoria/Magnetic-Blogs/<hash>/social/retro-<data>/story-N.jpg` (confira que respondem 200).
5. **Agendar no HighLevel** (`create-post`), um por story, a partir de 07:00 de Brasília (10:00Z), 1 minuto de intervalo:
   ```json
   {"path":{"locationId":"6i6bFmaWCvKhKAE7OLqd"},"body":{"accountIds":["6a207ecf5eb1df19fc1f80f5_6i6bFmaWCvKhKAE7OLqd_17841416513865174"],"userId":"BIzPzYc4OsSMJotVZnUO","type":"story","status":"scheduled","scheduleDate":"<data>T10:00:00.000Z","summary":"","media":[{"url":"<url>","type":"image/jpeg"}],"instagramPostDetails":{"type":"story"}}}
   ```
   Antes, confira com `get-posts` (scheduled, 09:55Z–10:30Z da segunda) se a retro dessa segunda já não foi agendada, pra não duplicar.
