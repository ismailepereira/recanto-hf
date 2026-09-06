# Inteligência — Recanto HF

> Leia este arquivo antes de mexer no site ou escrever qualquer peça.
> Evita reabrir Instagram, Maps e Takeat a cada sessão.

## Identificação
| Campo | Valor |
|---|---|
| Nome fantasia | Recanto HF (no Takeat: "Empório recanto hf") |
| Categoria | Gastrobar e cafeteria |
| Cidade | Anapu — PA (CEP 68365-000) |
| Endereço | Av. Getúlio Vargas, em frente à Casa do Boi |
| Coordenadas | -3.4703981, -51.201216 |
| Telefone / WhatsApp | (94) 99138-9831 → wa.me/5594991389831 |
| Instagram | [@recantohf](https://www.instagram.com/recantohf/) — 3.176 seguidores |
| Cardápio digital | https://cardapio.takeat.app/emporiorecantohf |
| Site próprio | **não tinha** — este projeto é o primeiro |

## Números usados no site
- **5,0** — nota no Google Maps (categoria "Cafeteria")
- **96** — itens no cardápio (15 categorias, depois de tirar adicionais/balcão)
- **3,1 mil** — seguidores no Instagram
- **7/7** — abre todos os dias

## Horário
- Instagram (bio): "Aberto das 09:00 as 23:30"
- Google Maps: mostrava "Abre às 10:00"
- **O site usa 9h–23h30.** Confirmar com o cliente qual é o correto.

## Posicionamento (palavras do próprio cliente)
> "Gastrobar e cafeteria. A melhor experiência gastronômica em Anapu-Pa."
> — bio do Instagram

Destaques fixados no perfil: Reinauguração, Aniversariantes, Drinks, Cardápio.

## Estrutura do cardápio
15 categorias no site: Drinks autorais (17), Drinks sem álcool (6), Para começar
(12), Pratos especiais (5), Executivos (4), Chapas HF (5), Panelinhas (4),
Lanches (16), Sobremesas (5), Cafeteria (6), Caldos (1), Bebidas (9),
Cervejas (2), Doses (2), Vinhos (2).

Ficaram de fora (não são vitrine): adicionais, doces de balcão, picolé, queijos
por quilo — a lista de exclusões está em `tools/sync_menu.py`.

**Carro-chefe visual:** drinks autorais (Moscow Mule, Especial HF, Gin Tropical,
Lagoa Azul), chapas e panelinhas que servem 3–4 pessoas, e a linha de cafeteria.

**Faixa de preço:** café tradicional R$ 3 · drinks R$ 15–35 · chapas e
panelinhas R$ 60–150 · porção de camarão R$ 120.

## Fonte técnica dos dados
API pública do Takeat (usada pelo `tools/sync_menu.py`):
- `https://backend-gd.takeat.app/public/restaurant/emporiorecantohf`
- `https://backend-gd.takeat.app/public/restaurants/menu/165511?menuTable=true`

O `restaurantId` é **165511**. Se o cliente trocar de sistema, o script para de
funcionar e o `menu.json` vira a fonte manual.

## Observações comerciais
- Anapu-PA é a mesma cidade do cliente **Brasileirão Express** — há rede local.
- O Recanto HF fica **em frente à Casa do Boi**, outro cliente da carteira.
- Nota 5,0 e 3,1 mil seguidores com **zero site** — o argumento de venda é
  presença própria no Google e um link de bio que não é de terceiro.
