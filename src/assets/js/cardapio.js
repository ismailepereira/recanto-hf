/* Recanto HF — monta o cardápio a partir de assets/data/menu.json.
   O JSON é gerado por tools/sync_menu.py (fonte: cardápio digital do cliente). */

(function () {
  'use strict';

  var root = document.getElementById('menu-root');
  var chipsBox = document.getElementById('menu-chips');
  if (!root) return;

  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderItem(item) {
    var article = el('article', 'menu-item');

    var figure = el('div', 'menu-item-img');
    if (item.img) {
      var img = new Image();
      img.src = item.img;
      img.alt = item.nome;
      img.loading = 'lazy';
      img.decoding = 'async';
      figure.appendChild(img);
    } else {
      figure.classList.add('is-empty');
    }
    article.appendChild(figure);

    var top = el('div', 'menu-item-top');
    top.appendChild(el('h3', null, item.nome));
    top.appendChild(el('span', 'menu-item-price', brl.format(item.preco)));
    article.appendChild(top);

    if (item.descricao) {
      article.appendChild(el('p', null, item.descricao));
    }
    return article;
  }

  function renderCategory(cat) {
    var section = el('section', 'menu-cat');
    section.id = 'cat-' + cat.id;

    var head = el('div', 'menu-cat-head');
    head.appendChild(el('h2', null, cat.nome));
    head.appendChild(el('span', 'menu-cat-count', cat.itens.length + (cat.itens.length === 1 ? ' item' : ' itens')));
    section.appendChild(head);

    var grid = el('div', 'menu-grid');
    cat.itens.forEach(function (item) { grid.appendChild(renderItem(item)); });
    section.appendChild(grid);

    return section;
  }

  function renderChips(categorias) {
    if (!chipsBox) return;
    categorias.forEach(function (cat) {
      var a = el('a', 'chip', cat.nome);
      a.href = '#cat-' + cat.id;
      a.dataset.target = 'cat-' + cat.id;
      chipsBox.appendChild(a);
    });
  }

  /* Destaca o chip da categoria visível e o mantém à vista na barra. */
  function trackActiveChip() {
    if (!chipsBox || !('IntersectionObserver' in window)) return;
    var chips = Array.prototype.slice.call(chipsBox.querySelectorAll('.chip'));

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        chips.forEach(function (chip) {
          var on = chip.dataset.target === entry.target.id;
          chip.classList.toggle('is-active', on);
          if (on) chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    root.querySelectorAll('.menu-cat').forEach(function (s) { io.observe(s); });
  }

  fetch('assets/data/menu.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      root.innerHTML = '';
      renderChips(data.categorias);
      data.categorias.forEach(function (cat) { root.appendChild(renderCategory(cat)); });
      trackActiveChip();
    })
    .catch(function (err) {
      root.innerHTML = '';
      var p = el('p', null, 'Não foi possível carregar o cardápio agora. Veja no cardápio digital: ');
      p.style.cssText = 'padding-block:4rem;color:var(--cream-mid);';
      var a = el('a', null, 'cardapio.takeat.app/emporiorecantohf');
      a.href = 'https://cardapio.takeat.app/emporiorecantohf';
      a.target = '_blank';
      a.rel = 'noopener';
      a.style.color = 'var(--copper-lt)';
      p.appendChild(a);
      root.appendChild(p);
      console.error('[cardapio]', err);
    });
})();
