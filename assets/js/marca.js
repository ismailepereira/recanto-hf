/* Recanto HF — marca aplicada nas peças.
   Injeta uma vez os símbolos SVG (selo oval + ornamento do filete) que os
   cartões de prato reaproveitam via <use>. */

(function () {
  'use strict';

  var SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false">' +
      /* Selo oval, no espírito do logo aplicado no canto das peças. */
      '<symbol id="hf-selo" viewBox="0 0 200 118">' +
        '<ellipse cx="100" cy="59" rx="97" ry="56" fill="none" stroke="currentColor" stroke-width="2.4"/>' +
        '<path d="M100 20v13M93.5 26.5h13M100 33l-5 5h10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<text x="100" y="76" text-anchor="middle" fill="currentColor"' +
        ' font-family="Oswald, Jost, Arial, sans-serif" font-weight="500" font-size="34" letter-spacing="1.5">RECANTO</text>' +
        '<text x="100" y="94" text-anchor="middle" fill="currentColor"' +
        ' font-family="Jost, Arial, sans-serif" font-size="11" letter-spacing="3.4">GASTROBAR · CAFETERIA</text>' +
      '</symbol>' +
      /* Folha central do filete divisor. */
      '<symbol id="hf-folha" viewBox="0 0 24 24">' +
        '<path d="M12 3c4.5 2.4 7 5.6 7 9 0 4-3.1 7-7 9-3.9-2-7-5-7-9 0-3.4 2.5-6.6 7-9z" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M12 5.5v13" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '</symbol>' +
    '</svg>';

  function inject() {
    if (document.getElementById('hf-selo')) return;
    var holder = document.createElement('div');
    holder.innerHTML = SPRITE;
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  /* Helpers usados pelo cardápio e pela vitrine. */
  window.HF = {
    selo: function () {
      return '<span class="plate-logo" aria-hidden="true"><svg viewBox="0 0 200 118"><use href="#hf-selo"/></svg></span>';
    },
    filete: function () {
      return '<span class="rule" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#hf-folha"/></svg></span>';
    }
  };
})();
