const myGiantArray = new Array(1000000).fill(1234567890);

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

window.intentionallyLogStringifiedFunctionToConsole = function () {
  const myFunc = () => "foo";
  console.error(myFunc.toString());
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
};

window.getObject = function () {
  Object.setPrototypeOf(obj, null);
};

window.getObjectWithNullProto = function () {
  const obj = { message: "this object was created inside the iframe" };
  Object.setPrototypeOf(obj, null);
  return obj;
};

window.getError = function () {
  return new Error("This error was created inside the iframe");
};

window.triggerConsoleAssert = function () {
  console.assert(1, 2);
};

window.triggerConsoleCount = function () {
  console.count();
  console.count("abc");
  console.count({ a: 1 });
};

window.triggerConsoleDir = function () {
  console.dir({ a: { b: 1 } });
};

window.triggerDirXml = function () {
  console.dirxml(document.createElement("div"));
};

window.triggerConsoleGroup = function () {
  console.group("myGroup");
  console.log("something");
  console.groupEnd();
};

window.triggerConsoleGroupWithObject = function () {
  const myObj = { a: 1 };
  console.group(myObj);
  console.log("something");
  console.groupEnd();
};

window.triggerConsoleGroupCollapsed = function () {
  const myObj = { a: 1 };
  console.groupCollapsed(myObj);
  console.log("something");
  console.groupEnd();
};

window.triggerConsoleTable = function () {
  console.table(["apples", "oranges", "bananas"]);
};

window.triggerConsoleTimeWithoutTimeEnd = function () {
  console.time("myLabel");
};

window.triggerConsoleTimeWithObject = function () {
  const myObj = { a: 1 };
  console.time(myObj);
  console.timeLog(myObj);
  console.timeEnd(myObj);
};

window.triggerConsoleProfile = function () {
  const myObj = { a: 1 };
  console.profile(myObj);
};

window.triggerConsoleTimeStamp = function () {
  console.timeStamp({ a: 1 });
};

window.triggerConsoleTrace = function () {
  console.trace("My Message");
};

window.triggerConsoleTraceWithObject = function () {
  console.trace({ a: 1 });
};

window.triggerConsoleLogObjectWithSubstitution = function () {
  console.log("a string: %s; an integer: %i; an object: %o", "foo", 1.23, { a: 1 }); // The leak goes away if you stringify a param.
};

window.triggerAsyncThrowError = async function () {
  throw new Error("MyAsyncError");
};
