
  import './index.scss';
  import {printHello} from './tools';
  import {printCommon}  from  '../../assets/js/common.js';
  
  function component() {
    var element = document.createElement('div');

    element.innerHTML = "hello22 index";
    element.classList.add('hello');
    return element;
  }

  printHello();
  printCommon();

  document.body.appendChild(component());