import "./index.scss";
import testImg from "../../assets/img/test.jpeg";

const component=()=>{
  var element = document.createElement("div");

  element.innerHTML = "hello home";
  element.classList.add("hello");

  var test = new Image();
  test.src = testImg;
  element.appendChild(test);

  return element;
}

document.body.appendChild(component());