#!/usr/bin/env python3
"""Retro da semana - Stories no estilo "O Diário Magnético" (1080x1920).

uso:
  python3 tools/retro/retro.py tools/retro/semanas/2026-10-05.json
  -> gera social/retro-<data>/story-N.jpg (e .png de prévia em /tmp)

JSON:
{
 "data": "2026-10-05",                       # segunda em que os stories vão ao ar
 "edicao": "Edição de segunda · 5 de outubro",
 "periodo": "28/09 a 03/10",
 "manchete": "A semana em *8 posts*",        # *asteriscos* = itálico laranja
 "lead": "texto curto",
 "dias": [ {"dia": "Quinta-feira, 01/10", "curto": "Qui 01/10",
            "materias": [ {"titulo": "...", "resumo": "...", "palavra": "Whats01", "capa": "https://...slide-1.jpg"} ] } ],
 "palavras": [ ["Whats01", "Checklist pra ajustar o WhatsApp"] ],
 "previsao": [ ["Seg 05/10", "8 painéis que todo negócio precisa"] ],   # opcional
 "previsao_frase": "Tempo firme, com pancadas de IA à tarde."           # opcional
}
Regra: todo texto sai das legendas dos posts. Nada de número ou resultado inventado.
"""
import json, sys, os, re, html, base64, io, urllib.request, pathlib

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
E = lambda t: html.escape(str(t or ""))
hl = lambda t: re.sub(r"\*(.+?)\*", r"<i>\1</i>", E(t))

def fontes():
    css = []
    for f in sorted((AQUI / "fonts").glob("*.woff2")):
        m = re.match(r"(.+)-(latin|latin-ext)-(\d00)\.woff2$", f.name)
        fam = {"playfair-display": "Playfair Display", "jetbrains-mono": "JetBrains Mono", "plus-jakarta-sans": "Plus Jakarta Sans"}[m.group(1)]
        rng = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212" if m.group(2) == "latin" else "U+0100-024F,U+1E00-1EFF,U+20A0-20C0"
        b = base64.b64encode(f.read_bytes()).decode()
        css.append(f"@font-face{{font-family:'{fam}';font-weight:{m.group(3)};src:url(data:font/woff2;base64,{b}) format('woff2');unicode-range:{rng}}}")
    return "".join(css)

def img_uri(url):
    try:
        if url.startswith("http"):
            # tenta achar o arquivo no próprio repo (social/...) antes de baixar
            m = re.search(r"/(social/.+)$", url)
            if m and (RAIZ / m.group(1)).exists():
                data = (RAIZ / m.group(1)).read_bytes()
            else:
                with urllib.request.urlopen(url, timeout=20) as r: data = r.read()
        else:
            data = pathlib.Path(url).read_bytes()
        return "data:image/jpeg;base64," + base64.b64encode(data).decode()
    except Exception:
        return ""

LOGO = "data:image/webp;base64," + base64.b64encode((AQUI / "logo.webp").read_bytes()).decode()

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:'Plus Jakarta Sans',sans-serif}
.j{position:absolute;inset:0;background:#F3EDE2;color:#17130F;padding:96px 64px 0}
.j::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,#0000 0 3px,#00000005 3px 4px)}
.mast{text-align:center;border-bottom:6px double #17130F;padding-bottom:18px}
.mast .top{display:flex;justify-content:space-between;align-items:center;font:700 22px 'JetBrains Mono';letter-spacing:.08em;text-transform:uppercase;color:#5b5047;border-bottom:2px solid #17130F;padding-bottom:14px}
.mast .top img{height:34px;vertical-align:middle;margin-right:10px}
.mast h6{font:900 104px/1 'Playfair Display';letter-spacing:-.02em;margin-top:18px}
.mast .ed{display:flex;justify-content:space-between;font:600 24px 'JetBrains Mono';letter-spacing:.06em;color:#5b5047;margin-top:12px;text-transform:uppercase}
.kick{display:inline-block;background:#D15434;color:#fff;font:800 26px 'JetBrains Mono';letter-spacing:.12em;text-transform:uppercase;padding:10px 18px;margin-top:40px}
.man{font:900 104px/.98 'Playfair Display';letter-spacing:-.025em;margin-top:22px}
.man i{font-style:italic;color:#D15434}
.lead{font:400 40px/1.4 'Playfair Display';color:#2b241f;margin-top:26px;border-left:6px solid #D15434;padding-left:26px}
.idx{margin-top:40px;border-top:2px solid #17130F}
.idx div{display:flex;align-items:baseline;gap:16px;padding:18px 0;border-bottom:1px solid #17130F55;font:600 34px/1.25 'Plus Jakarta Sans'}
.idx b{flex:none;width:190px;font:800 26px 'JetBrains Mono';color:#D15434;letter-spacing:.04em;text-transform:uppercase}
.idx span{flex:1}
.idx em{flex:none;font:700 24px 'JetBrains Mono';font-style:normal;color:#5b5047}
.carimbo{position:absolute;right:70px;bottom:120px;transform:rotate(-8deg);border:6px solid #D15434;color:#D15434;font:900 40px/1 'JetBrains Mono';padding:14px 22px;letter-spacing:.06em;text-align:center;z-index:2}
.carimbo small{display:block;font-size:20px;margin-top:6px}
.mat{display:flex;gap:30px;padding:30px 0;border-bottom:1px solid #17130F55}
.mat:first-of-type{border-top:2px solid #17130F;margin-top:30px}
.mat .ft{flex:none;width:250px;height:312px;border:2px solid #17130F;padding:8px;background:#fff}
.mat .ft div{width:100%;height:100%;background-size:cover;background-position:center top;filter:grayscale(1) contrast(1.12)}
.mat h3{font:900 54px/1.02 'Playfair Display';letter-spacing:-.02em}
.mat h3 i{color:#D15434}
.mat p{font:500 31px/1.38 'Plus Jakarta Sans';color:#2b241f;margin-top:14px}
.mat .kw{display:inline-block;margin-top:16px;font:800 24px 'JetBrains Mono';letter-spacing:.06em}
.mat .kw b{background:#D15434;color:#fff;padding:4px 12px}
.m1 .mat{flex-direction:column;gap:34px}.m1 .mat .ft{width:620px;height:775px}.m1 .mat h3{font-size:84px}.m1 .mat p{font-size:40px}.m1 .mat .kw{font-size:30px}
.m2 .mat{padding:40px 0}.m2 .mat .ft{width:320px;height:400px}.m2 .mat h3{font-size:64px}.m2 .mat p{font-size:36px}.m2 .mat .kw{font-size:28px}
.m3 .mat{padding:24px 0}.m3 .mat .ft{width:210px;height:262px}.m3 .mat h3{font-size:46px}.m3 .mat p{font-size:28px}
.cls{margin-top:36px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.cls div{border:3px solid #17130F;padding:28px 26px;background:#fff}
.cls div b{display:block;font:900 52px/1 'Playfair Display';color:#D15434;word-break:break-word}
.cls div span{display:block;font:600 30px/1.3 'Plus Jakarta Sans';margin-top:12px}
.cls div:last-child:nth-child(odd){grid-column:1/3}
.cls div small{display:block;font:800 18px 'JetBrains Mono';letter-spacing:.1em;color:#5b5047;margin-bottom:10px}
.rod{position:absolute;left:64px;right:64px;bottom:110px;border-top:2px solid #17130F;padding-top:22px;font:800 34px/1.3 'Plus Jakarta Sans'}
.rod b{background:#D15434;color:#fff;padding:2px 12px}
.prev{margin-top:36px;border:3px solid #17130F;background:#fff}
.prev .hd{background:#17130F;color:#F3EDE2;font:800 24px 'JetBrains Mono';letter-spacing:.12em;padding:18px 26px;text-transform:uppercase}
.prev div.r{display:flex;gap:22px;padding:22px 26px;border-bottom:1px solid #17130F33;font:600 33px/1.3 'Plus Jakarta Sans'}
.prev div.r b{flex:none;width:170px;font:800 24px/1.6 'JetBrains Mono';color:#D15434;text-transform:uppercase}
.frase{font:italic 400 44px/1.35 'Playfair Display';margin-top:34px;text-align:center}
"""

def mast(ed, pag):
    return f"""<div class="mast"><div class="top"><span><img src="{LOGO}">@rodrigomendesfn</span><span>Retrospectiva</span></div>
<h6>O Diário Magnético</h6><div class="ed"><span>{E(ed)}</span><span>{E(pag)}</span></div></div>"""

def paginas(c):
    P = []
    ed = c["edicao"]
    total = sum(len(d["materias"]) for d in c["dias"])
    idx = "".join(f'<div><b>{E(d.get("curto", d["dia"]))}</b><span>{E(re.sub(r"[*]", "", m["titulo"]))}</span><em>p.{k + 2}</em></div>'
                  for k, d in enumerate(c["dias"]) for m in d["materias"])
    P.append(f"""<div class="j">{mast(ed, "Pág. 1")}<span class="kick">Retrospectiva · {E(c["periodo"])}</span>
<div class="man">{hl(c["manchete"])}</div><div class="lead">{E(c.get("lead", ""))}</div>
<div class="idx">{idx}</div></div><div class="carimbo">A SEMANA<br>EM {total}<small>{E(c["periodo"])}</small></div>""")
    for k, d in enumerate(c["dias"]):
        ms = d["materias"]
        blocos = "".join(f"""<div class="mat"><div class="ft"><div style="background-image:url({img_uri(m.get("capa", ""))})"></div></div>
<div><h3>{hl(m["titulo"])}</h3><p>{E(m.get("resumo", ""))}</p>{f'<span class="kw">Comenta <b>{E(m["palavra"])}</b></span>' if m.get("palavra") else ""}</div></div>""" for m in ms)
        P.append(f"""<div class="j {'m3' if len(ms) >= 3 else ('m2' if len(ms) == 2 else 'm1')}">{mast(ed, f"Pág. {k + 2}")}<span class="kick">{E(d["dia"])}</span>{blocos}
<div class="rod">Perdeu? Tá tudo no perfil. Comenta a palavra no post e eu te mando.</div></div>""")
    if c.get("palavras"):
        cl = "".join(f'<div><small>COMENTA</small><b>{E(p)}</b><span>{E(o)}</span></div>' for p, o in c["palavras"])
        P.append(f"""<div class="j">{mast(ed, "Classificados")}<span class="kick">Materiais da semana</span>
<div class="man" style="font-size:84px">Cada palavra vale <i>um material</i> no direct.</div><div class="cls">{cl}</div>
<div class="rod">Comenta a palavra <b>no post certo</b> e o material chega no seu direct.</div></div>""")
    if c.get("previsao"):
        rr = "".join(f'<div class="r"><b>{E(a)}</b><span>{E(b)}</span></div>' for a, b in c["previsao"])
        P.append(f"""<div class="j">{mast(ed, "Previsão")}<span class="kick">Previsão da semana</span>
<div class="man" style="font-size:88px">O que vem <i>por aí</i></div><div class="prev"><div class="hd">Nos próximos dias no perfil</div>{rr}</div>
<div class="frase">{E(c.get("previsao_frase", ""))}</div></div>""")
    return P

def main():
    cfg = json.load(open(sys.argv[1], encoding="utf-8"))
    out = RAIZ / "social" / f"retro-{cfg['data']}"
    out.mkdir(parents=True, exist_ok=True)
    tmp = pathlib.Path("/tmp/retro-" + cfg["data"]); tmp.mkdir(exist_ok=True)
    head = f"<!doctype html><html><head><meta charset='utf-8'><style>{fontes()}{CSS}</style></head><body>"
    pags = paginas(cfg)
    from playwright.sync_api import sync_playwright
    from PIL import Image
    with sync_playwright() as p:
        exe = "/opt/pw-browsers/chromium"
        b = p.chromium.launch(**({"executable_path": exe} if os.path.exists(exe) else {}))
        pg = b.new_page(viewport={"width": 1080, "height": 1920})
        for i, h in enumerate(pags, 1):
            f = tmp / f"story-{i}.html"; f.write_text(head + h + "</body></html>", encoding="utf-8")
            pg.goto(f.as_uri()); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(200)
            png = tmp / f"story-{i}.png"; pg.screenshot(path=str(png))
            Image.open(png).convert("RGB").save(out / f"story-{i}.jpg", quality=90)
        b.close()
    print(f"{len(pags)} stories em {out}")

if __name__ == "__main__":
    main()
