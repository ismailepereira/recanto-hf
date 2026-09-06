"""Sincroniza o cardápio do Recanto HF a partir da API pública do Takeat.

Gera src/assets/data/menu.json e baixa as fotos dos pratos para
src/assets/img/menu/. Rode sempre que o cliente atualizar o cardápio no Takeat:

    python tools/sync_menu.py
"""
from __future__ import annotations

import json
import re
import unicodedata
import urllib.request
from pathlib import Path

RESTAURANT_ID = 165511
SLUG = "emporiorecantohf"
API_MENU = f"https://backend-gd.takeat.app/public/restaurants/menu/{RESTAURANT_ID}?menuTable=true"
API_INFO = f"https://backend-gd.takeat.app/public/restaurant/{SLUG}"

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "src" / "assets" / "data"
IMG_DIR = ROOT / "src" / "assets" / "img" / "menu"

# Categorias que não fazem sentido em uma vitrine institucional.
SKIP_CATEGORIES = {"adicionais", "doces balcao", "picole", "queijos"}

# Nome bonito para exibição (a API traz tudo em caixa/grafia livre).
CATEGORY_LABELS = {
    "drinks": "Drinks autorais",
    "drinks sem alcool": "Drinks sem álcool",
    "entradas": "Para começar",
    "pratos especias": "Pratos especiais",
    "executivios": "Executivos",
    "chapas hf": "Chapas HF",
    "panelinhas": "Panelinhas",
    "lanche": "Lanches",
    "sobremesas": "Sobremesas",
    "cafeteria": "Cafeteria",
    "caldos": "Caldos",
    "bebidas": "Bebidas",
    "cervejas": "Cervejas",
    "doses": "Doses",
    "vinhos": "Vinhos",
}


def strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")


def slugify(text: str) -> str:
    text = strip_accents(text).lower()
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def titlecase(text: str) -> str:
    """'CHAPA DE PICANHA' -> 'Chapa de picanha' (respeita siglas curtas)."""
    minor = {"de", "do", "da", "com", "ao", "e", "em", "no", "na", "a", "o", "sem"}
    words = text.strip().lower().split()
    out = []
    for i, w in enumerate(words):
        if w in {"hf"}:
            out.append("HF")
        elif i and w in minor:
            out.append(w)
        else:
            out.append(w.capitalize())
    return " ".join(out)


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download(url: str, dest: Path) -> bool:
    if dest.exists():
        return True
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            dest.write_bytes(resp.read())
        return True
    except Exception as exc:  # noqa: BLE001 - script de apoio, log basta
        print(f"  ! falhou {url}: {exc}")
        return False


def main() -> None:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    info = fetch_json(API_INFO)
    raw = fetch_json(API_MENU)

    categories = []
    for cat in raw:
        raw_name = cat.get("name", "").strip()
        key = strip_accents(raw_name).lower()
        if key in SKIP_CATEGORIES:
            continue

        items = []
        for prod in cat.get("products") or []:
            name = prod.get("name", "").strip()
            if not name:
                continue
            image = (prod.get("image") or {}).get("url")
            local = None
            if image:
                fname = f"{slugify(name)}.webp"
                if download(image, IMG_DIR / fname):
                    local = f"assets/img/menu/{fname}"
            items.append(
                {
                    "nome": titlecase(name),
                    "descricao": " ".join((prod.get("description") or "").split()),
                    "preco": float(prod.get("price") or 0),
                    "disponivel": bool(prod.get("available", True)),
                    "img": local,
                }
            )

        if not items:
            continue
        categories.append(
            {
                "id": slugify(raw_name),
                "nome": CATEGORY_LABELS.get(key, titlecase(raw_name)),
                "itens": items,
            }
        )

    payload = {
        "restaurante": info.get("fantasy_name"),
        "telefone": info.get("phone"),
        "instagram": info.get("instagram"),
        "cidade": f"{(info.get('adress') or {}).get('city')}-{(info.get('adress') or {}).get('state')}",
        "fonte": "Takeat (cardápio digital do cliente)",
        "categorias": categories,
    }
    (DATA_DIR / "menu.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    total = sum(len(c["itens"]) for c in categories)
    print(f"OK: {len(categories)} categorias, {total} itens")
    print(f"Imagens em {IMG_DIR}")


if __name__ == "__main__":
    main()
