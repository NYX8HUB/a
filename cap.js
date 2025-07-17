(function(){
  function criarCaptcha(container) {
    container.style.userSelect = 'none';
    container.style.border = '2px solid #aaa';
    container.style.width = '200px';
    container.style.height = '50px';
    container.style.lineHeight = '50px';
    container.style.textAlign = 'center';
    container.style.cursor = 'pointer';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '16px';
    container.style.color = '#444';
    container.textContent = 'Clique aqui para verificar';

    let verificado = false;
    let timestamp = null;

    // Variáveis para os testes
    let movimentoMouse = 0;
    let teclasPressionadas = 0;
    let abaFocada = true;
    const tempoInicio = Date.now();

    // Monitorar comportamento
    window.addEventListener('mousemove', () => movimentoMouse++);
    window.addEventListener('keydown', () => teclasPressionadas++);
    window.addEventListener('focus', () => abaFocada = true);
    window.addEventListener('blur', () => abaFocada = false);

    // Função que valida se comportamento é ok
    function comportamentoValido() {
      const tempoAtivo = (Date.now() - tempoInicio) / 1000;
      if(!abaFocada) return false;                // aba precisa estar focada
      if(tempoAtivo < 1) return false;            // tempo mínimo na página
      if(movimentoMouse < 2) return false;        // mouse precisa ter se movido pelo menos 2x
      // teclas não obrigatórias, mas somam para confiança
      return true;
    }

    container.addEventListener('click', () => {
      if(verificado) return;
      if(!comportamentoValido()) {
        alert('Por favor, interaja com a página antes de clicar no captcha.');
        return;
      }
      verificado = true;
      timestamp = Date.now();
      container.style.border = '2px solid #4CAF50';
      container.style.backgroundColor = '#DFF2BF';
      container.style.color = '#4CAF50';
      container.textContent = 'Verificado ✓';
    });

    return {
      validar: () => verificado,
      getToken: () => {
        if(!verificado) return null;
        return btoa(JSON.stringify({
          verificado: true,
          ts: timestamp,
          movimentoMouse,
          teclasPressionadas,
          tempoAtivo: (Date.now() - tempoInicio) / 1000,
          abaFocada
        }));
      }
    };
  }

  window.meuCaptcha = {
    init: function(selector) {
      const container = document.querySelector(selector);
      if(!container) {
        console.error('Container não encontrado: ' + selector);
        return null;
      }
      return criarCaptcha(container);
    }
  };
})();
