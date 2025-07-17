// cap.jsa
(function(){
  function criarCaptcha(container) {
    // Estilo do quadrado
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
    container.textContent = 'Clique na caixa para verificar';

    let verificado = false;
    let timestamp = null;

    // Variáveis para testes básicos
    let movimentoMouse = 0;
    let teclasPressionadas = 0;
    let abaFocada = true;
    const tempoInicio = Date.now();

    // Monitora movimento do mouse
    window.addEventListener('mousemove', () => movimentoMouse++);
    // Monitora teclas pressionadas
    window.addEventListener('keydown', () => teclasPressionadas++);
    // Monitora foco da aba
    window.addEventListener('focus', () => abaFocada = true);
    window.addEventListener('blur', () => abaFocada = false);

    // Função para validar comportamento antes do clique
    function comportamentoValido() {
      const tempoAtivo = (Date.now() - tempoInicio) / 1000;
      if (!abaFocada) return false;
      if (tempoAtivo < 1) return false;
      if (movimentoMouse < 3) return false;
      // teclasPressionadas não obrigatório, só reforça
      return true;
    }

    container.addEventListener('click', () => {
      if(verificado) return; // já clicado e validado

      if(!comportamentoValido()) {
        alert('Por favor, interaja um pouco mais com a página antes de clicar na caixa.');
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
