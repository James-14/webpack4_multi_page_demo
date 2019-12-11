
  import './index.scss';
  import {printHello} from './tools';
  import {printCommon}  from  '../../assets/js/common.js';
  import $ from "jquery";
  // 下面的方式引用jquery也可以
  // const $ = require("jquery");

  function component() {
    var element = document.createElement('div');

    element.innerHTML = "hello22 index";
    element.classList.add('hello');
    return element;
  }

  $(".js-test").text("hello jquery");

  printHello();
  printCommon();

  document.body.appendChild(component());