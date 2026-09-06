/* Recanto HF — o vídeo do hero anda com a rolagem.

   O hero é um trilho mais alto que a tela; enquanto ele passa, a cena fica
   presa e a posição da rolagem vira o tempo do vídeo. Descer serve o drink,
   subir desfaz.

   No celular isso não vale a pena: o seek de vídeo no iOS é irregular e o
   dedo não tem a precisão da roda do mouse. Lá o vídeo roda sozinho, em laço.
   Mesma coisa para quem pediu menos movimento no sistema. */

(function () {
  'use strict';

  var video = document.getElementById('hero-video');
  var hero = document.querySelector('.hero');
  var barra = document.getElementById('hero-scrub-bar');
  if (!video || !hero) return;

  var semScrub = window.matchMedia('(max-width: 860px), (prefers-reduced-motion: reduce)');

  /* ------------------------------------------------ Modo laço (celular) */

  function tocarEmLaco() {
    video.loop = true;
    video.muted = true;
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay barrado: fica no poster */ });
  }

  function pararLaco() {
    video.loop = false;
    video.pause();
  }

  /* ------------------------------------------ Modo rolagem (computador) */

  var alvo = 0;      // segundo que a rolagem pede
  var atual = 0;     // segundo aplicado, perseguindo o alvo
  var rodando = false;

  function progresso() {
    var caixa = hero.getBoundingClientRect();
    var curso = hero.offsetHeight - window.innerHeight;
    if (curso <= 0) return 0;
    return Math.min(1, Math.max(0, -caixa.top / curso));
  }

  function quadro() {
    var dur = video.duration;
    if (!dur || isNaN(dur)) { rodando = false; return; }

    var pct = progresso();
    alvo = pct * (dur - 0.05);

    // Persegue o alvo em vez de saltar: o seek fica macio e o navegador não
    // recebe um pedido novo a cada pixel rolado.
    atual += (alvo - atual) * 0.18;

    if (Math.abs(atual - video.currentTime) > 0.012) {
      try { video.currentTime = atual; } catch (e) { /* seek ainda não pronto */ }
    }
    if (barra) barra.style.width = (pct * 100).toFixed(1) + '%';

    // Continua enquanto não alcançou o alvo; depois dorme até a próxima rolagem.
    if (Math.abs(alvo - atual) > 0.004) {
      requestAnimationFrame(quadro);
    } else {
      rodando = false;
    }
  }

  function acordar() {
    if (rodando) return;
    rodando = true;
    requestAnimationFrame(quadro);
  }

  function ligarScrub() {
    video.pause();
    video.loop = false;
    window.addEventListener('scroll', acordar, { passive: true });
    window.addEventListener('resize', acordar);
    acordar();
  }

  function desligarScrub() {
    window.removeEventListener('scroll', acordar);
    window.removeEventListener('resize', acordar);
    rodando = false;
  }

  /* --------------------------------------------------------------- Modo */

  function aplicarModo() {
    if (semScrub.matches) {
      desligarScrub();
      tocarEmLaco();
    } else {
      pararLaco();
      ligarScrub();
    }
  }

  function pronto() {
    aplicarModo();
    if (semScrub.addEventListener) {
      semScrub.addEventListener('change', aplicarModo);
    } else if (semScrub.addListener) {
      semScrub.addListener(aplicarModo);
    }
  }

  if (video.readyState >= 1) {
    pronto();
  } else {
    video.addEventListener('loadedmetadata', pronto, { once: true });
  }
})();
