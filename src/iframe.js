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

window.intentionallyLogFunctionToConsole = function () {
  const myFunc = () => "foo";
  console.error(myFunc);
};

window.intentionallyLogStructuredCloneErrorToConsole = function () {
  const originalError = new Error("This is an error object, which will be structured cloned, intentionally logged to console");
  console.error(structuredClone(originalError));
};

window.intentionallyLogStringifiedErrorToConsole = function () {
  const originalError = new Error("This is an error object, which will be stringified, intentionally logged to console");
  console.error(JSON.stringify(originalError, null, 3));
};

window.intentionallyLogObjectToConsole = function () {
  const originalError = new Error("This a message string from an error object, which will be put into a new object before logging.");
  console.error({ message: originalError.message });
};

window.intentionallyLogWeakRefObjectToConsole = function () {
  console.error(new WeakRef({ message: "this is a message from an object wrapped in WeakRef" }));
};

window.intentionallyLogPrettyStringToConsole = function () {
  const originalError = new Error("This is an error object that will be pretty printed");
  console.error(JSON.stringify({ ...originalError }, null, 3));
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

window.triggerLoggingOutsideIframe = function () {
  if (!window.logOutsideIframe) {
    alert("before the iframe can trigger logging outside of it, we need to pass in a logOustideIframe function");
  }
  logOutsideIframe();
}
