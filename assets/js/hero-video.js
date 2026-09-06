/* Recanto HF — o vídeo do hero anda com a rolagem, e só com ela.

   O hero é um trilho mais alto que a tela; enquanto ele passa, a cena fica
   presa e a posição da rolagem vira o tempo do vídeo. Descer serve o drink,
   subir desfaz. O vídeo nunca toca sozinho.

   No celular vale o mesmo. O iOS precisa de um empurrão para deixar o seek
   fluido — um play() mudo seguido de pause() liga o decoder sem que nada
   apareça em movimento — e é isso que `destravar()` faz.

   A única exceção é quem pediu menos movimento no sistema: aí o hero vira uma
   imagem parada, no primeiro quadro. */

(function () {
  'use strict';

  var video = document.getElementById('hero-video');
  var hero = document.querySelector('.hero');
  var barra = document.getElementById('hero-scrub-bar');
  if (!video || !hero) return;

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  var alvo = 0;      // segundo que a rolagem pede
  var atual = 0;     // segundo aplicado, perseguindo o alvo
  var rodando = false;
  var destravado = false;

  /* O decoder do iOS só responde bem a seek depois de ter tocado uma vez.
     Toca mudo por um instante e pausa: nada aparece, mas o seek fica fluido. */
  function destravar() {
    if (destravado) return;
    destravado = true;

    video.muted = true;
    var p = video.play();
    if (p && p.then) {
      p.then(function () { video.pause(); video.currentTime = atual; })
       .catch(function () { /* barrado: o seek ainda funciona na maioria dos casos */ });
    } else {
      video.pause();
    }
  }

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
    destravar();
    if (rodando) return;
    rodando = true;
    requestAnimationFrame(quadro);
  }

  function ligar() {
    video.loop = false;
    video.pause();

    if (semMovimento.matches) {
      // Hero vira quadro parado: sem trilho, sem seek, sem movimento.
      video.currentTime = 0;
      return;
    }

    window.addEventListener('scroll', acordar, { passive: true });
    window.addEventListener('resize', acordar);
    window.addEventListener('orientationchange', acordar);

    // Um toque na tela também destrava, para o caso de o play() automático
    // ter sido barrado antes de qualquer rolagem.
    window.addEventListener('touchstart', destravar, { passive: true, once: true });

    acordar();
  }

  if (video.readyState >= 1) {
    ligar();
  } else {
    video.addEventListener('loadedmetadata', ligar, { once: true });
  }
})();
