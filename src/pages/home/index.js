
  import './index.scss'
  
  function component() {
    var element = document.createElement('div');

    element.innerHTML = "hello home";
    element.classList.add('hello');

    return element;
  }

  document.body.appendChild(component());