/* Recanto HF — lupa de pressionar e segurar.

   Segurou o clique (ou o dedo) sobre a foto de um prato, ela abre em tela
   cheia; soltou, volta ao cardápio. Sem cliques extras e sem botão de fechar.

   Cuidados que o gesto exige:
   - abre só depois de um instante parado, senão dispara ao rolar a página;
   - se o dedo arrastar antes disso, era rolagem: cancela;
   - enquanto a lupa está aberta, a página não rola por baixo;
   - no celular, segurar abriria o menu "salvar imagem" — ele é bloqueado;
   - nos cartões da home, que são links, um toque rápido continua navegando;
     só o que virou lupa tem o clique cancelado. */

(function () {
  'use strict';

  var ATRASO = 130;   // ms parado antes de abrir — filtra o toque de rolagem
  var TOLERANCIA = 12; // px de arrasto que ainda contam como "parado"

  var lupa, lupaImg, lupaNome, lupaPreco;
  var timer = null;
  var aberta = false;
  var alvo = null;
  var origem = { x: 0, y: 0 };
  var virouLupa = false;

  function montar() {
    lupa = document.createElement('div');
    lupa.className = 'lupa';
    lupa.setAttribute('aria-hidden', 'true');
    lupa.innerHTML =
      '<figure class="lupa-quadro">' +
        '<img alt="" />' +
        '<figcaption class="lupa-legenda">' +
          '<span class="lupa-nome"></span>' +
          '<span class="lupa-preco"></span>' +
        '</figcaption>' +
      '</figure>';
    document.body.appendChild(lupa);

    lupaImg = lupa.querySelector('img');
    lupaNome = lupa.querySelector('.lupa-nome');
    lupaPreco = lupa.querySelector('.lupa-preco');
  }

  function abrir(card) {
    var img = card.querySelector('img');
    if (!img || !img.src) return;

    var nome = card.querySelector('.plate-name');
    var preco = card.querySelector('.plate-price');

    lupaImg.src = img.src;
    lupaImg.alt = img.alt || '';
    lupaNome.textContent = nome ? nome.textContent : '';
    lupaPreco.textContent = preco ? preco.textContent : '';

    lupa.classList.add('is-on');
    lupa.setAttribute('aria-hidden', 'false');
    aberta = true;
    virouLupa = true;
  }

  function fechar() {
    if (!aberta) return;
    lupa.classList.remove('is-on');
    lupa.setAttribute('aria-hidden', 'true');
    aberta = false;
  }

  function cancelarTimer() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  function aoPressionar(e) {
    if (e.button !== undefined && e.button !== 0) return;

    var card = e.target.closest('.plate');
    if (!card || card.classList.contains('is-empty')) return;

    alvo = card;
    virouLupa = false;
    origem.x = e.clientX;
    origem.y = e.clientY;

    cancelarTimer();
    timer = setTimeout(function () {
      timer = null;
      if (alvo) abrir(alvo);
    }, ATRASO);
  }

  function aoMover(e) {
    if (!alvo) return;

    // Já aberta: o arrasto não fecha — a pessoa pode escorregar o dedo.
    if (aberta) return;

    var dx = Math.abs(e.clientX - origem.x);
    var dy = Math.abs(e.clientY - origem.y);
    if (dx > TOLERANCIA || dy > TOLERANCIA) {
      cancelarTimer();
      alvo = null;
    }
  }

  function aoSoltar() {
    cancelarTimer();
    fechar();
    alvo = null;
  }

  function ligar() {
    montar();

    document.addEventListener('pointerdown', aoPressionar);
    document.addEventListener('pointermove', aoMover, { passive: true });
    document.addEventListener('pointerup', aoSoltar);
    document.addEventListener('pointercancel', aoSoltar);
    window.addEventListener('blur', aoSoltar);

    // Segurar sobre uma imagem abriria o menu do navegador no celular.
    document.addEventListener('contextmenu', function (e) {
      if (e.target.closest('.plate')) e.preventDefault();
    });

    // Com a lupa aberta, a página não deve rolar por baixo.
    document.addEventListener('touchmove', function (e) {
      if (aberta) e.preventDefault();
    }, { passive: false });

    // Na home o cartão é link: o que virou lupa não deve navegar ao soltar.
    document.addEventListener('click', function (e) {
      if (!virouLupa) return;
      var card = e.target.closest('.plate');
      if (card) { e.preventDefault(); e.stopPropagation(); }
      virouLupa = false;
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ligar);
  } else {
    ligar();
  }
})();
