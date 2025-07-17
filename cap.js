// click-captcha.js
(function(){
  function montarCaptcha(container) {
    container.style.userSelect = 'none';
    container.style.border = '2px solid #ccc';
    container.style.width = '200px';
    container.style.height = '50px';
    container.style.lineHeight = '50px';
    container.style.textAlign = 'center';
    container.style.cursor = 'pointer';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '16px';
    container.style.color = '#555';
    container.textContent = 'Clique aqui para verificar';

    let verificado = false;

    function onClick() {
      verificado = true;
      container.style.border = '2px solid #4CAF50';
      container.style.backgroundColor = '#DFF2BF';
      container.style.color = '#4CAF50';
      container.textContent = 'Verificado ✓';
      container.removeEventListener('click', onClick);
    }

    container.addEventListener('click', onClick);

    return {
      validar: () => verificado,
      reset: () => {
        verificado = false;
        container.style.border = '2px solid #ccc';
        container.style.backgroundColor = 'transparent';
        container.style.color = '#555';
        container.textContent = 'Clique aqui para verificar';
        container.addEventListener('click', onClick);
      }
    };
  }

  window.clickCaptcha = {
    init: (selector) => {
      const container = document.querySelector(selector);
      if(!container) {
        console.error('Container não encontrado: ' + selector);
        return null;
      }
      return montarCaptcha(container);
    }
  };
})();
