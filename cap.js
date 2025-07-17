// cap.js
(function(){
  const style = document.createElement('style');
  style.textContent = `
    #captcha-box {
      display: inline-flex;
      align-items: center;
      border: 2px solid #ccc;
      padding: 8px 12px;
      width: 220px;
      cursor: pointer;
      user-select: none;
      font-family: Arial, sans-serif;
      font-size: 14px;
      color: #444;
      border-radius: 4px;
      transition: border-color 0.3s;
    }
    #captcha-box.checked {
      border-color: #4CAF50;
      background-color: #DFF2BF;
      color: #4CAF50;
    }
    #checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #ccc;
      margin-right: 10px;
      border-radius: 3px;
      background: white;
      box-sizing: border-box;
      position: relative;
    }
    #checkbox.checked::after {
      content: "✓";
      position: absolute;
      top: 0;
      left: 3px;
      font-weight: bold;
      color: #4CAF50;
      font-size: 18px;
    }
  `;
  document.head.appendChild(style);

  window.meuCaptcha = {
    init: function(selector) {
      const container = document.querySelector(selector);
      if(!container) {
        console.error('Container não encontrado: ' + selector);
        return null;
      }

      container.innerHTML = `
        <div id="captcha-box" role="checkbox" aria-checked="false" tabindex="0" aria-label="Não sou um robô">
          <div id="checkbox"></div>
          Não sou um robô
        </div>
      `;

      const box = container.querySelector('#captcha-box');
      const checkbox = container.querySelector('#checkbox');

      let verificado = false;
      let movimentoMouse = 0;
      const tempoInicio = Date.now();
      let abaFocada = true;

      window.addEventListener('mousemove', () => movimentoMouse++);
      window.addEventListener('focus', () => abaFocada = true);
      window.addEventListener('blur', () => abaFocada = false);

      function comportamentoValido() {
        const tempoAtivo = (Date.now() - tempoInicio) / 1000;
        return abaFocada && tempoAtivo > 1 && movimentoMouse > 5;
      }

      function atualizarVisual() {
        if(verificado) {
          box.classList.add('checked');
          box.setAttribute('aria-checked', 'true');
        } else {
          box.classList.remove('checked');
          box.setAttribute('aria-checked', 'false');
        }
      }

      box.addEventListener('click', () => {
        if(verificado) return;

        if(!comportamentoValido()) {
          alert('Por favor, interaja com a página por alguns segundos antes de clicar.');
          return;
        }

        verificado = true;
        atualizarVisual();

        const token = btoa(JSON.stringify({
          verificado: true,
          ts: Date.now(),
          movimentoMouse,
          abaFocada
        }));
        console.log('Token captcha:', token);
      });

      box.addEventListener('keydown', e => {
        if(e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          box.click();
        }
      });

      return {
        validar: () => verificado,
        getToken: () => verificado ? btoa(JSON.stringify({
          verificado: true,
          ts: Date.now(),
          movimentoMouse,
          abaFocada
        })) : null
      };
    }
  };
})();
