# Briefing — Site Recanto HF

## Pedido
Um site de apresentação para o Recanto HF, no mesmo espírito do que foi feito
para o Quintal Pizzaria: vitrine institucional, design sofisticado, com o
**cardápio já embutido**. Regra de composição: **20% texto, 80% imagem**.

O cliente hoje só tem Instagram e um cardápio hospedado no Takeat. Não tem site.

## Objetivo
1. Dar ao Recanto HF um endereço próprio na internet (link de bio, Google, cartão).
2. Mostrar a casa pela comida e pela bebida — não por texto.
3. Levar para WhatsApp (reserva) e para o cardápio digital (pedido).

## Público
Moradores de Anapu e região que saem para jantar, beber ou tomar café;
aniversariantes procurando lugar; quem chega na cidade e busca no Google.

## Decisões de design
**Proporção 20/80.** Nenhum bloco de texto passa de duas linhas. Toda seção é
carregada por fotografia: tríptico no hero, faixa infinita de fotos, três cards
verticais de "mundos", mosaico de 8 pratos, cardápio inteiro ilustrado.

**Paleta noturna em cobre.** O acento `#c6884a` nasce da caneca de cobre do
Moscow Mule — a foto mais forte do acervo. Fundo quase preto para as fotos de
comida (quentes, saturadas) brilharem sem competir com a interface.

**Tipografia.** *Cormorant Garamond* (serif de contraste alto, em caixa baixa nos
títulos) dá o tom de gastrobar; *Jost* em caixa alta e espaçada resolve rótulos
e botões. Deliberadamente diferente do Quintal (Bitter + Montserrat), para os
dois sites não parecerem irmãos.

**Hero em tríptico.** As fotos do cliente são quadradas (feitas no celular). Um
hero full-bleed cortaria demais e ficaria borrado; três colunas verticais
respeitam o enquadramento original e ainda entregam 100% de imagem na primeira
tela.

**Números como elemento gráfico.** 5,0 · 96 · 3,1 mil · 7/7 em serifada grande.
São a prova social da casa, e ocupam o lugar que um parágrafo de "sobre nós"
ocuparia.

## Arquitetura
**index.html** — hero (tríptico + nome + 3 dados) → faixa de fotos → números →
três mundos (Bar / Cozinha / Cafeteria) → vitrine de 8 pratos → citação da bio →
visitar (endereço, horário, contato, mapa) → CTA WhatsApp → rodapé.

**cardapio.html** — 15 categorias, 96 itens, chips de navegação grudados no topo,
grid ilustrado. Renderizado em runtime a partir de `assets/data/menu.json`.

## Conteúdo
Textos escritos a partir da bio do próprio cliente e dos dados públicos
(Instagram, Google Maps, cardápio Takeat) — ver `docs/inteligencia.md`.
As 80 fotos de prato vêm do cardápio digital da casa.

## O que ainda falta do cliente
- Fotos do ambiente, da fachada e da equipe (hoje só há foto de prato).
- Logo oficial em vetor ou PNG transparente.
- Confirmação do horário (9h ou 10h) e do número na avenida.
- Definição sobre domínio próprio.
