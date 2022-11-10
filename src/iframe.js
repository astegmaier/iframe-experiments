window.logHelloWorld = function () {
  console.log("Hello world, from inside the iframe!");
};

window.changeBackground = function () {
  document.getElementsByTagName("body")[0].style.background =
    "rgb(" + [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(", ") + ")";
};

window.intentionallyLogErrorToConsole = function () {
  console.error(new Error("This is an error object, intentionally logged to console"));
};

window.throwUnhandledError = function () {
  setTimeout(() => {
    throw new Error("This is an unhandled error that's thrown");
  }, 0);
};

window.throwHandledError = function () {
  setTimeout(() => {
    try {
      throw new Error("This is an error we'll handle");
    } catch (e) {
      document.getElementsByTagName("h1")[0].textContent = "... and I handled the error";
    }
  }, 0);
};
