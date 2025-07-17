(function(){
  // Variáveis internas
  let movimentoMouse = 0;
  let cliques = 0;
  let teclado = 0;
  let tempoInicio = Date.now();
  let abaFocada = true;

  // Monitoramento
  window.addEventListener('mousemove', () => movimentoMouse++);
  window.addEventListener('click', () => cliques++);
  window.addEventListener('keydown', () => teclado++);
  window.addEventListener('focus', () => abaFocada = true);
  window.addEventListener('blur', () => abaFocada = false);

  // Função que avalia risco
  function avaliarRisco() {
    const tempoAtivo = (Date.now() - tempoInicio) / 1000;
    if (!abaFocada) return 'alto';
    if (tempoAtivo < 2 && movimentoMouse < 5 && cliques < 1) return 'alto';
    if (tempoAtivo < 5 && movimentoMouse < 10) return 'medio';
    return 'baixo';
  }

  // Gera token base64 com dados
  function gerarToken() {
    return btoa(JSON.stringify({
      movimentoMouse,
      cliques,
      teclado,
      tempoAtivo: (Date.now() - tempoInicio) / 1000,
      abaFocada,
      risco: avaliarRisco()
    }));
  }

  // Interface pública
  window.meuCaptcha = {
    init: function(selector) {
      const container = document.querySelector(selector);
      if(!container) {
        console.error('Container não encontrado');
        return null;
      }

      // Criar desafio se necessário
      let desafioResolvido = false;

      function mostrarDesafio() {
        const a = Math.floor(Math.random()*10)+1;
        const b = Math.floor(Math.random()*10)+1;
        const soma = a+b;

        container.innerHTML = `
          <label>Resolva para continuar: ${a} + ${b} = 
            <input type="number" id="captcha-input" />
          </label>
          <div id="msg-erro" style="color:red; display:none;">Resposta incorreta.</div>
        `;

        const input = container.querySelector('#captcha-input');
        const msgErro = container.querySelector('#msg-erro');

        input.addEventListener('input', () => {
          if(parseInt(input.value) === soma) {
            desafioResolvido = true;
            msgErro.style.display = 'none';
          } else {
            desafioResolvido = false;
            msgErro.style.display = 'inline';
          }
        });
      }

      // Decide se mostra desafio ou não
      if(avaliarRisco() === 'baixo') {
        container.textContent = 'Captcha validado invisível.';
        desafioResolvido = true;
      } else {
        mostrarDesafio();
      }

      return {
        validar: () => desafioResolvido,
        getToken: () => gerarToken()
      };
    }
  };
})();
