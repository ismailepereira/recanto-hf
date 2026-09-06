/* Recanto HF — monta o cardápio a partir de assets/data/menu.json.
   Cada item vira um cartão no padrão das peças da casa: foto ocupando tudo,
   selo no alto e nome, ingredientes e PREÇO dentro da própria foto.
   O JSON é gerado por tools/sync_menu.py (fonte: cardápio digital do cliente).

   Navegação: índice fixo à esquerda no computador, gaveta no celular, e uma
   barra de progresso — 96 itens só funcionam se a pessoa souber onde está e
   que ainda há mais abaixo. */

(function () {
  'use strict';

  var root = document.getElementById('menu-root');
  if (!root) return;

  var indexBox = document.getElementById('menu-index');
  var drawerList = document.getElementById('menu-drawer-list');
  var drawer = document.getElementById('menu-drawer');
  var barNow = document.getElementById('menu-bar-now');
  var progressBar = document.getElementById('menu-progress-bar');

  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function doisDigitos(n) { return n < 10 ? '0' + n : String(n); }

  /* "morango, kiwi, vodka" -> "MORANGO • KIWI • VODKA".
     Descrições longas continuam como frase: virariam um paredão em caixa alta. */
  function formatarIngredientes(texto) {
    var limpo = texto.replace(/\s+/g, ' ').trim().replace(/[.;]+$/, '');
    if (!limpo) return null;

    var partes = limpo.split(/\s*,\s*/).filter(Boolean);
    var virouLista = partes.length > 1 && limpo.length <= 82;

    return { texto: virouLista ? partes.join(' • ') : limpo, lista: virouLista };
  }

  function renderItem(item) {
    var card = el('article', 'plate');

    if (item.img) {
      var img = new Image();
      img.src = item.img;
      img.alt = item.nome;
      img.loading = 'lazy';
      img.decoding = 'async';
      card.appendChild(img);
    } else {
      card.classList.add('is-empty');
      card.appendChild(el('span', 'plate-mono', 'HF'));
    }

    var selo = el('span', 'plate-logo');
    selo.setAttribute('aria-hidden', 'true');
    selo.innerHTML = '<svg viewBox="0 0 200 118"><use href="#hf-selo"/></svg>';
    card.appendChild(selo);

    if (item.img) {
      var lupa = el('span', 'plate-zoom');
      lupa.setAttribute('aria-hidden', 'true');
      lupa.innerHTML = '<svg viewBox="0 0 24 24"><use href="#hf-lupa"/></svg>';
      card.appendChild(lupa);
    }

    var body = el('div', 'plate-body');
    body.appendChild(el('h3', 'plate-name', item.nome));

    var filete = el('span', 'rule');
    filete.setAttribute('aria-hidden', 'true');
    filete.innerHTML = '<svg viewBox="0 0 24 24"><use href="#hf-folha"/></svg>';
    body.appendChild(filete);

    var ing = item.descricao ? formatarIngredientes(item.descricao) : null;
    if (ing) body.appendChild(el('p', 'plate-ing' + (ing.lista ? '' : ' is-sentence'), ing.texto));

    body.appendChild(el('span', 'plate-price', brl.format(item.preco)));
    card.appendChild(body);

    return card;
  }

  function renderCategory(cat, i, total) {
    var section = el('section', 'menu-cat');
    section.id = 'cat-' + cat.id;

    var head = el('div', 'menu-cat-head');
    head.appendChild(el('span', 'menu-cat-num', doisDigitos(i + 1)));
    head.appendChild(el('h2', null, cat.nome));

    var meta = el('div', 'menu-cat-meta');
    meta.appendChild(el('span', 'menu-cat-count',
      cat.itens.length + (cat.itens.length === 1 ? ' item' : ' itens') + ' · ' + doisDigitos(i + 1) + '/' + doisDigitos(total)));
    head.appendChild(meta);
    section.appendChild(head);

    var grid = el('div', 'menu-grid');
    cat.itens.forEach(function (item) { grid.appendChild(renderItem(item)); });
    section.appendChild(grid);

    return section;
  }

  /* Uma entrada do índice — mesmo dado servindo à barra lateral e à gaveta. */
  function linkCategoria(cat, i) {
    var a = el('a', null);
    a.href = '#cat-' + cat.id;
    a.dataset.target = 'cat-' + cat.id;
    a.appendChild(el('span', null, cat.nome));
    a.appendChild(el('span', 'n', String(cat.itens.length)));
    return a;
  }

  /* ------------------------------------------------------------- Gaveta */

  function abrirGaveta() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function fecharGaveta() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function ligarGaveta() {
    var abrir = document.getElementById('menu-open');
    var fechar = document.getElementById('menu-close');
    var veu = document.getElementById('menu-veil');

    if (abrir) abrir.addEventListener('click', abrirGaveta);
    if (fechar) fechar.addEventListener('click', fecharGaveta);
    if (veu) veu.addEventListener('click', fecharGaveta);
    if (drawerList) drawerList.addEventListener('click', function (e) {
      if (e.target.closest('a')) fecharGaveta();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharGaveta();
    });
  }

  /* ------------------------------------------- Onde a pessoa está agora */

  function acompanharPosicao(categorias) {
    var secoes = Array.prototype.slice.call(root.querySelectorAll('.menu-cat'));
    var links = Array.prototype.slice.call(document.querySelectorAll('.menu-index a, .menu-drawer-list a'));
    var total = categorias.length;
    var atual = -1;
    var agendado = false;

    function marcar(pos) {
      if (pos === atual) return;
      atual = pos;

      var id = secoes[pos].id;
      links.forEach(function (a) { a.classList.toggle('is-active', a.dataset.target === id); });

      if (barNow) {
        barNow.innerHTML = '';
        barNow.appendChild(document.createTextNode(categorias[pos].nome));
        barNow.appendChild(el('small', null, doisDigitos(pos + 1) + ' de ' + doisDigitos(total)));
      }

      var ativo = document.querySelector('.menu-index a.is-active');
      if (ativo && ativo.scrollIntoView) ativo.scrollIntoView({ block: 'nearest' });
    }

    /* A categoria "atual" é a última cujo topo já passou da linha de leitura.
       Cálculo direto em vez de IntersectionObserver: com uma faixa estreita, o
       observer não dispara quando a pessoa volta ao topo de uma vez. */
    function conferir() {
      agendado = false;
      var linha = window.scrollY + window.innerHeight * 0.3;
      var pos = 0;
      for (var i = 0; i < secoes.length; i++) {
        if (secoes[i].offsetTop <= linha) pos = i; else break;
      }
      marcar(pos);
    }

    function agendar() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(conferir);
    }

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    conferir();
  }

  /* Quanto do cardápio já foi percorrido. */
  function acompanharProgresso() {
    if (!progressBar) return;

    function atualizar() {
      var alcance = document.documentElement.scrollHeight - window.innerHeight;
      var pct = alcance > 0 ? (window.scrollY / alcance) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, pct)).toFixed(1) + '%';
    }

    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
  }

  /* --------------------------------------------------------------- Boot */

  fetch('assets/data/menu.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var cats = data.categorias;
      root.innerHTML = '';

      cats.forEach(function (cat, i) {
        root.appendChild(renderCategory(cat, i, cats.length));
        if (indexBox) indexBox.appendChild(linkCategoria(cat, i));
        if (drawerList) drawerList.appendChild(linkCategoria(cat, i));
      });

      ligarGaveta();
      acompanharPosicao(cats);
      acompanharProgresso();
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
