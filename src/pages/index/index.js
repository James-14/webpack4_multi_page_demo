
  //引入公共css样式,里面包含header.scss
  import '../../assets/csss/common.scss';
  import './index.scss';
  import {printHello} from './tools';
  import {printCommon}  from  '../../assets/js/common.js';
  import $ from "jquery";
  // 下面的方式引用jquery也可以
  // const $ = require("jquery");
  //引入header的js
  import '../../assets/js/header.js';


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