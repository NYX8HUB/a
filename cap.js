// meu-captcha.js
(function(){
  const containerClass = 'meu-captcha-container';
  const widgetClass = 'meu-captcha-widget';

  // Gera um desafio simples (soma)
  function gerarDesafio() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, resultado: a + b };
  }

  // Codifica token (resultado + timestamp)
  function gerarToken(resultado) {
    const data = JSON.stringify({ resultado, ts: Date.now() });
    return btoa(data);
  }

  // Decodifica token
  function decodificarToken(token) {
    try {
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  }

  // Monta o widget
  function montarWidget(container) {
    const desafio = gerarDesafio();
    container.innerHTML = `
      <label>Resolva: <strong>${desafio.a} + ${desafio.b}</strong> = 
        <input type="number" class="meu-captcha-input" required>
      </label>
      <input type="hidden" class="meu-captcha-token" value="${gerarToken(desafio.resultado)}">
      <span class="meu-captcha-msg" style="color:red; display:none; margin-left:10px;"></span>
    `;

    const input = container.querySelector('.meu-captcha-input');
    const tokenInput = container.querySelector('.meu-captcha-token');
    const msg = container.querySelector('.meu-captcha-msg');

    function validar() {
      const valor = parseInt(input.value);
      const tokenData = decodificarToken(tokenInput.value);

      if(!tokenData) {
        msg.textContent = 'Token inválido.';
        msg.style.display = 'inline';
        return false;
      }

      if(valor !== tokenData.resultado) {
        msg.textContent = 'Resposta incorreta.';
        msg.style.display = 'inline';
        return false;
      }

      msg.style.display = 'none';
      return true;
    }

    input.addEventListener('input', validar);

    return {
      validar
    };
  }

  // Exporta função global para inicializar o captcha
  window.meuCaptcha = {
    init: function(selector) {
      const container = document.querySelector(selector);
      if(!container) {
        console.error('Container não encontrado: ' + selector);
        return null;
      }
      return montarWidget(container);
    }
  };
})();
