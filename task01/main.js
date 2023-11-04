// Задание 1

// Сверстайте кнопку, которая будет содержать в себе icon_01
// (как в примере в последнем видео).
// При клике на кнопку иконка должна меняться на icon_02. Повторный клик меняет иконку обратно.

document.querySelector(".btn").addEventListener("click", function (e) {
  e.target.closest(".btn").classList.toggle("btn--toggle");
  console.log("change");
});
