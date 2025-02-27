import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.scss";
import { App } from "./App";
import { Components } from "./components/Components";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App Components={Components} />
  </React.StrictMode>
);

export function restartAnimation(element) {
  element.style.display = "block";

  setTimeout(() => playAnimation(element), 100);
}

function playAnimation(element) {
  const spans = element.querySelectorAll("span");

  spans.forEach((span) => {
    span.style.opacity = "0";
  });

  spans.forEach((span, index) => {
    setTimeout(() => {
      span.style.opacity = "1";
    }, index * 25); //* Speed of typing (25 ms for a letter)
  });
}

//* Splitting all "timeLineElInfo"'s texts into spans
setTimeout(() => {
  document.querySelectorAll(".timeLineElInfo").forEach((element) => {
    const textContent = element.textContent.trim();
    element.innerHTML = "";

    textContent.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      element.appendChild(span);
    });
  });
}, 500);

export const clearActiveList = () => {
  document.querySelectorAll(".vertical-timeline-element").forEach((element) => {
    element.classList.remove("active");
    const elText = element.querySelector(".timeLineElInfo");
    elText.style.display = "none";

    elText.querySelectorAll("span").forEach((span) => {
      span.style.opacity = "0";
    });
  });
};
