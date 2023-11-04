//Задание 3

// 1. Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
// Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».

// При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.

// Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:

// 2. Добавить в чат механизм отправки геолокации
// При клике на кнопку «Геолокация» необходимо отправить данные серверу и
// вывести в чат ссылку на https://www.openstreetmap.org/ с вашей геолокацией.
// Сообщение, которое отправит обратно эхо-сервер, выводить не нужно.

// Ссылка на эхо-сервер
const wsUri = "wss://echo-ws-service.herokuapp.com";

const btnOpen = document.querySelector(".j-btn-open");
const btnClose = document.querySelector(".j-btn-close");

const btnSendMessage = document.querySelector(".j-btn-send-message");
const btnSendGeoPos = document.querySelector(".j-btn-send-geo-pos");

const messageField = document.querySelector(".j-message-field");

let websocket;

// Функция, выводящая на экран сообщения
function writeToScreen(message, color) {
  let pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.setAttribute("class", color);
  pre.innerHTML = message;
  messageField.appendChild(pre);
}

// Обработчик события нажатия на кнопку начала переписки
btnOpen.addEventListener("click", () => {
  while (messageField.firstChild) {
    messageField.removeChild(messageField.firstChild);
  }

  websocket = new WebSocket(wsUri);
  websocket.onopen = function (evt) {
    writeToScreen(
      "Привет! Введи сообщение в поле выше, чтобы начать общение:)",
      "text-info"
    );
    writeToScreen(
      "Или нажми кнопку - геолокации, чтобы получить ссылку на свое местоположение.",
      "text-info"
    );
  };
  websocket.onclose = function (evt) {
    writeToScreen("Пока пока. Приятно было пообщаться:)", "text-info");
  };
  websocket.onmessage = function (evt) {
    if (evt.data != "[object GeolocationPosition]") {
      writeToScreen("Ответ сервера: " + evt.data, "text-primary");
    }
  };
  websocket.onerror = function (evt) {
    writeToScreen("ERROR: " + evt.data, "text-danger");
  };
});

// Обработчик события нажатя на кнопку окончания переписки
btnClose.addEventListener("click", () => {
  websocket.close();
  websocket = null;
});

// Обработчик соытия нажатия на кнопку отправки сообщения
btnSendMessage.addEventListener("click", () => {
  const message = document.querySelector(".j-input").value;
  if (websocket) {
    writeToScreen("Твое сообщение: " + message, "text-success");
    websocket.send(message);
  } else {
    writeToScreen("Переписка еще не начата:(", "text-danger");
  }
});

// Функция, выводящая на экран ссылку на геолокацию
function writeToScreenLink(mapLink) {
  let div = document.createElement("div");
  div.setAttribute("class", "mb-2");

  let link = document.createElement("a");
  link.setAttribute("href", mapLink);
  link.innerHTML = "Твоя геопозиция: " + mapLink;

  div.appendChild(link);
  messageField.appendChild(div);
}

// Функция, выводящая текст об ошибке, получения геолокацию
const error = () => {
  writeToScreen("Невозможно получить ваше местоположение", "text-danger");
};

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
  websocket.send(position);

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  writeToScreenLink(
    `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
  );
};

// Обработчик события нажатия на кнопку получения геолокации
btnSendGeoPos.addEventListener("click", () => {
  if (websocket) {
    if (!navigator.geolocation) {
      writeToScreen(
        "Geolocation не поддерживается вашим браузером",
        "text-danger"
      );
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  } else {
    writeToScreen("Переписка еще не начата:(", "text-danger");
  }
});
