# Retro da semana (Stories de segunda, 06h50)

Toda segunda às 06:50 (Brasília) — antes dos stories normais do dia, que ficam às 07:00 — sobem Stories no estilo **O Diário Magnético** recapitulando os posts de feed da semana anterior (segunda a domingo) e mostrando a previsão dos posts da semana que começa.

## Rotina (feita pela tarefa agendada de domingo)

0. **Primeiro faça a checagem** da seção "Antes de tudo" no fim deste arquivo.
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
5. **Agendar no HighLevel** (`create-post`), um por story, a partir de **06:50 de Brasília (09:50Z)**, 1 minuto de intervalo. A retro tem que terminar antes das 07:00 (10:00Z), porque às 07:00 entram os stories normais do dia (`social/stories-<data>/`). Se a retro tiver mais de 10 stories, comece mais cedo (10:00Z menos o número de stories) para o último ficar no máximo às 09:59Z.
   ```json
   {"path":{"locationId":"6i6bFmaWCvKhKAE7OLqd"},"body":{"accountIds":["6a207ecf5eb1df19fc1f80f5_6i6bFmaWCvKhKAE7OLqd_17841416513865174"],"userId":"BIzPzYc4OsSMJotVZnUO","type":"story","status":"scheduled","scheduleDate":"<data>T09:50:00.000Z","summary":"","media":[{"url":"<url>","type":"image/jpeg"}],"instagramPostDetails":{"type":"story"}}}
   ```
   Use `idempotencyKey` `retro-<data>-N`.

## Antes de tudo: checagem (passo 0, ANTES de ler posts ou gerar imagens)

Faça um `get-posts` (`type: "scheduled"`) da segunda inteira: `<data>T03:00:00.000Z` até `<data+1>T03:00:00.000Z`.

- **A retro já existe?** Só conta como retro um story cujo `media[0].url` contém `/social/retro-<data>/`. Se achar algum, a retro já foi agendada: pare e avise (não duplique).
- **Stories de outras pastas** (ex.: `/social/stories-<data>/`, os stories normais do dia) **NÃO são a retro** e não são motivo para parar. Nunca mova, apague ou edite esses stories.
- **O horário da retro está livre?** Veja se algum story de outra pasta cai dentro da faixa que a retro vai ocupar (09:50Z até o último story dela). Se cair, volte a faixa inteira de 10 em 10 minutos (09:40Z, 09:30Z, ...) até achar uma faixa livre que termine antes de 10:00Z, e diga na mensagem final o horário usado.
