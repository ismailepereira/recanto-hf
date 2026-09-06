# Site — Recanto HF (Gastrobar & Cafeteria · Anapu, PA)

Site institucional de vitrine para o **Recanto HF**, gastrobar e cafeteria na
Av. Getúlio Vargas, em Anapu (PA). Página única + cardápio completo, estética
noturna em cobre e creme, na proporção **20% texto / 80% imagem**.

🔗 **No ar:** https://ismailepereira.github.io/recanto-hf/

## Stack
HTML + CSS + JavaScript puro, sem build e sem framework. Fontes via Google Fonts.
Hospedado no GitHub Pages, servindo a branch `gh-pages`.

## Estrutura
```
recanto-hf/
├── docs/
│   ├── briefing.md              # spec do projeto e decisões de design
│   └── inteligencia.md          # dados do cliente (ler ANTES de mexer no site)
├── tools/
│   ├── sync_menu.py             # baixa cardápio + fotos do Takeat → menu.json
│   └── servidor_local.py        # servidor de teste com suporte a HTTP Range
├── src/
│   ├── index.html               # hero, números, mundos, vitrine, visitar, CTA
│   ├── cardapio.html            # cardápio completo (renderizado do JSON)
│   ├── robots.txt · sitemap.xml
│   └── assets/
│       ├── css/styles.css       # tokens de design + layout
│       ├── js/main.js           # nav, reveals no scroll, WhatsApp flutuante
│       ├── js/marca.js          # selo oval, folha e lupa como símbolos SVG
│       ├── js/lupa.js           # segurar na foto abre em tela cheia
│       ├── js/hero-video.js     # o vídeo do hero anda com a rolagem
│       ├── video/               # hero-drink.mp4 (1,9 MB) + poster
│       ├── js/cardapio.js       # monta o cardápio a partir do JSON
│       ├── data/menu.json       # 15 categorias · 96 itens (gerado)
│       ├── img/menu/            # 80 fotos reais dos pratos (do cardápio do cliente)
│       └── logo/favicon.svg
└── README.md
```

## Rodando localmente
```
python tools/servidor_local.py 5311 src
```
> Use este servidor, não o `python -m http.server`: o embutido não responde a
> requisições HTTP Range, e sem Range o navegador informa `seekable=[0,0]` —
> o vídeo do hero carrega mas não avança com a rolagem. GitHub Pages e
> qualquer servidor real suportam Range; só o de teste precisava disso.

## Publicando uma atualização
O código-fonte fica na `main`; o que vai pro ar é o conteúdo de `src/`, servido
pela branch `gh-pages`. Depois de commitar na `main`:
```
git subtree push --prefix src origin gh-pages
```
> Havia um workflow do GitHub Actions para automatizar isso, mas o token do `gh`
> desta máquina não tem o escopo `workflow`. Para voltar ao deploy automático:
> `gh auth refresh -s workflow` e então recriar `.github/workflows/pages.yml`.

## Atualizando o cardápio
O cliente mantém o cardápio no Takeat. Para trazer preços e fotos novas:
```
python tools/sync_menu.py
```
O script regrava `src/assets/data/menu.json` e baixa só as fotos que faltam.

## Vídeo do hero
`src/assets/video/hero-drink.mp4` — 10 s, 1280×720, sem áudio, 1,9 MB.
Codificado com keyframe a cada 6 quadros (`-g 6`), que é o que deixa o seek
por rolagem fluido; com o GOP padrão o vídeo engasga ao ser percorrido.

No computador o hero é um trilho de 210svh: a cena fica presa e a rolagem
define o tempo do vídeo. No celular (≤860px) e para quem pede menos movimento,
o trilho some e o vídeo roda sozinho em laço.

Para trocar o vídeo, refaça a conversão:
```
ffmpeg -i entrada.mp4 -vf "scale=1280:720:flags=lanczos" -an   -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow   -g 6 -keyint_min 6 -sc_threshold 0 -movflags +faststart   src/assets/video/hero-drink.mp4
```

> **Atenção de marca:** a taça no vídeo atual traz o logo **LILLET** (aperitivo
> francês). O Recanto HF não tem relação com a marca — vale trocar o vídeo ou
> confirmar com o cliente antes de divulgar.

## Identidade visual
Noturna, de gastrobar:
- Fundo `#0b0908` → `#131010`
- Texto creme `#f3ede4`
- Acento cobre `#c6884a` / `#e2b17a` (nasce da caneca do moscow mule)

Títulos: *Cormorant Garamond* · Texto/UI: *Jost*

## Pendências (a confirmar com o cliente)
- [ ] Fotos do ambiente e da fachada — hoje o site usa só fotos de prato
- [ ] Vídeo próprio para o hero, sem marca de terceiro na taça
- [ ] Logo oficial (hoje é um monograma tipográfico "HF")
- [ ] Confirmar horário (Instagram diz 9h–23h30; Google diz que abre 10h)
- [ ] Endereço com número na Av. Getúlio Vargas
- [ ] Domínio próprio (atualizar canonical, OG e sitemap ao migrar)

## Créditos
- Fotos dos pratos: arte do próprio cliente, extraída do cardápio digital dele
  (Takeat) — uso autorizado pelo contexto do projeto; substituir/ampliar com
  material novo quando o cliente enviar.
- Tipografia: Google Fonts (Cormorant Garamond, Jost).

---
Desenvolvido por [ismailepereira](https://ismailepereira.github.io/)
