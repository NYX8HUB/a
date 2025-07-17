// meu-turnstile.js
(function(){
  const containerClass = 'meu-turnstile-container';
  const widgetClass = 'meu-turnstile-widget';

  let movimentoMouse = 0;
  let cliques = 0;
  let teclado = 0;
  let tempoInicio = Date.now();

  // Monitoramento invisível
  function monitorarComportamento() {
    document.addEventListener('mousemove', () => movimentoMouse++);
    document.addEventListener('click', () => cliques++);
    document.addEventListener('keydown', () => teclado++);
  }

  // Heurística simples para suspeita
  function avaliarRisco() {
    const tempoAtivo = (Date.now() - tempoInicio) / 1000;
    // Se pouco movimento e muito rápido, suspeito
    if(tempoAtivo < 2 && movimentoMouse < 5 && cliques < 1) return 'alto';
    if(tempoAtivo < 5 && movimentoMouse < 10) return 'medio';
    return 'baixo';
  }

  // Gerar token baseado nos dados coletados
  function gerarToken() {
    const dados = {
      movimentoMouse,
      cliques,
      teclado,
      tempoAtivo: (Date.now() - tempoInicio) / 1000,
      risco: avaliarRisco()
    };
    return btoa(JSON.stringify(dados));
  }

  // Montar o widget (invisível, só mostra se risco médio/alto)
  function montarWidget(container) {
    monitorarComportamento();

    const challengeContainer = document.createElement('div');
    challengeContainer.style.marginTop = '10px';

    const inputResposta = document.createElement('input');
    inputResposta.type = 'number';
    inputResposta.style.display = 'none';

    const desafioLabel = document.createElement('label');
    desafioLabel.style.display = 'none';

    let desafioValor;

    function montarDesafio() {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      desafioValor = a + b;
      desafioLabel.textContent = `Para continuar, resolva: ${a} + ${b} = `;
      desafioLabel.appendChild(inputResposta);
      desafioLabel.style.display = 'inline-block';
      inputResposta.style.display = 'inline-block';
      inputResposta.value = '';
      inputResposta.focus();
    }

    container.appendChild(challengeContainer);
    container.appendChild(desafioLabel);

    return {
      validar: () => {
        const risco = avaliarRisco();
        if(risco === 'baixo') {
          // comportamento bom, sem desafio
          return true;
        }
        // risco médio ou alto, desafio obrigatório
        const resposta = parseInt(inputResposta.value);
        if(resposta !== desafioValor) {
          alert('Por favor, resolva o desafio para provar que você é humano.');
          montarDesafio();
          return false;
        }
        return true;
      },
      getToken: () => gerarToken()
    };
  }

  // Exporta global
  window.meuTurnstile = {
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
