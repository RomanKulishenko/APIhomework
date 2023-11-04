// Задание 2

// Сверстайте кнопку, клик на которую
// будет выводить данные о размерах экрана с помощью alert.

document.querySelector(".btn").addEventListener("click", function (e) {
  e.target.closest(".btn").classList.toggle("btn--toggle");
  window.alert("Ширина экрана " + document.documentElement.clientWidth);
  window.alert("А высота " + document.documentElement.clientHeight);
  console.log("change");
});
