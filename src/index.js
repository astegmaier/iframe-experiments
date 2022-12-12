//////////////////////////////////////////////////////////////////////////////////
// The three main functions for the repro are at the top of this file
// The rest are auxillary functions for the rudimentary UI and heap-size tracking.
// There are also basic functions run from within the iframe, defined in
// http://iframe-experiments.azurewebsites.net/iframe-error-object/iframe.js
//////////////////////////////////////////////////////////////////////////////////

async function addIframe() {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.id = "iframe";
    iframe.style.height = "400px";
    iframe.srcdoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <script src="./iframe.js"></script>
        </head>
        <body>
          <h1>Hi, I am the iframe.</h1>
        </body>
        </html>
      `;

    iframe.onload = async () => {
      doPostAddingScenario(iframe);

      await updateIterationAndHeapSizeDisplay();
      if (iteration < iterationMemoryStats.length) {
        iterationMemoryStats[iteration][0] = getUsedJsHeapSize();
      }

      resolve();
    };

    document.getElementById("main").appendChild(iframe);
  });
}

async function removeIframe() {
  document.getElementById("main").textContent = "";

  await updateIterationAndHeapSizeDisplay();
  if (iteration < iterationMemoryStats.length) {
    iterationMemoryStats[iteration][1] = getUsedJsHeapSize();
  }

  iteration++;
}

function doPostAddingScenario(iframe) {
  switch (document.getElementById("after-adding-iframe").value) {
    case "nothing":
      return;
    case "change-iframe-background":
      iframe.contentWindow.changeBackground();
      return;
    case "log-hello-world-inside-iframe":
      iframe.contentWindow.logHelloWorld();
      return;
    case "log-error-in-iframe":
      iframe.contentWindow.intentionallyLogErrorToConsole();
      return;
    case "log-function-in-iframe":
      iframe.contentWindow.intentionallyLogFunctionToConsole();
      return;
    case "log-stringified-in-iframe":
      iframe.contentWindow.intentionallyLogStringifiedFunctionToConsole();
      return;
    case "log-object-in-iframe":
      iframe.contentWindow.intentionallyLogObjectToConsole();
      return;
    case "throw-unhandled-error-in-iframe":
      iframe.contentWindow.throwUnhandledError();
      return;
    case "throw-handled-error-in-iframe":
      iframe.contentWindow.throwHandledError();
      return;
    case "log-error-outside":
      console.log(new Error("Intentionally logging error on outside of iframe"));
      return;
    case "log-structured-clone-error-in-iframe":
      iframe.contentWindow.intentionallyLogStructuredCloneErrorToConsole();
      return;
    case "log-stringified-error-in-iframe":
      iframe.contentWindow.intentionallyLogStringifiedErrorToConsole();
      return;
    case "log-weakref-object-in-iframe":
      iframe.contentWindow.intentionallyLogWeakRefObjectToConsole();
      return;
    case "log-pretty-print-string-in-iframe":
      iframe.contentWindow.intentionallyLogPrettyStringToConsole();
      return;
    case "override-console-error-in-iframe-broken":
      overrideConsoleForIframeBroken(iframe.contentWindow);
      iframe.contentWindow.intentionallyLogErrorToConsole();
      return;
    case "override-console-error-in-iframe-fixed":
      overrideConsoleForIframeFixed(iframe.contentWindow);
      iframe.contentWindow.intentionallyLogErrorToConsole();
      return;
    case "trigger-logging-outside-iframe":
      iframe.contentWindow.logOutsideIframe = logOutsideIframeError;
      iframe.contentWindow.triggerLoggingOutsideIframe();
      return;
    case "trigger-logging-outside-iframe-object":
      iframe.contentWindow.logOutsideIframe = logOutsideIframeObject;
      iframe.contentWindow.triggerLoggingOutsideIframe();
      return;
    case "trigger-logging-outside-iframe-error-created-outside-iframe":
      iframe.contentWindow.logOutsideIframe = logOutsideIframeErrorCreatedOutsideIframe;
      iframe.contentWindow.triggerLoggingOutsideIframe();
      return;
    case "trigger-throw-unhandled-error-outside-iframe":
      iframe.contentWindow.triggerThrowUnhandledError = throwUnhandledError;
      iframe.contentWindow.triggerThrowUnhandledError();
      return;
    case "trigger-console-assert-in-iframe":
      iframe.contentWindow.triggerConsoleAssert();
      return;
    case "trigger-console-count-in-iframe":
      iframe.contentWindow.triggerConsoleCount();
      return;
    case "trigger-console-dir-in-iframe":
      iframe.contentWindow.triggerConsoleDir();
      return;
    case "trigger-console-dirxml-in-iframe":
      iframe.contentWindow.triggerConsoleDirXml();
      return;
    case "trigger-console-group-in-iframe":
      iframe.contentWindow.triggerConsoleGroup();
      return;
    case "trigger-console-group-with-object-in-iframe":
      iframe.contentWindow.triggerConsoleGroupWithObject();
      return;
    case "trigger-console-group-collapsed-in-iframe":
      iframe.contentWindow.triggerConsoleGroupCollapsed();
      return;
    case "trigger-console-table-in-iframe":
      iframe.contentWindow.triggerConsoleTable();
      return;
    case "trigger-console-time-without-end-in-iframe":
      iframe.contentWindow.triggerConsoleTimeWithoutTimeEnd();
      return;
    case "trigger-console-time-with-object-in-iframe":
      iframe.contentWindow.triggerConsoleTimeWithObject();
      return;
    case "trigger-console-profile-in-iframe":
      iframe.contentWindow.triggerConsoleProfile();
      return;
    case "trigger-console-timestamp-in-iframe":
      iframe.contentWindow.triggerConsoleTimeStamp();
      return;
    case "trigger-console-trace-in-iframe":
      iframe.contentWindow.triggerConsoleTrace();
      return;
    case "trigger-console-trace-with-object-in-iframe":
      iframe.contentWindow.triggerConsoleTraceWithObject();
      return;
    case "trigger-console-log-object-with-substitution-in-iframe":
      iframe.contentWindow.triggerConsoleLogObjectWithSubstitution();
      return;
    case "catch-async-thrown-error-from-iframe":
      throwAsyncErrorInIframeAndCatchItOutside(iframe);
      return;
    default:
      alert("Invalid value for after-adding-iframe dropdown");
      return;
  }
}

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

let iteration = 0;

// pre-fill the memory stats with reasonable initial values,
// so that the array filling up doesn't drive up memory
const iterationMemoryStats = JSON.parse(JSON.stringify(new Array(10000).fill(["X.XXXX", "X.XXXX"])));

document.getElementById("add-iframe").onclick = () => addIframe();

document.getElementById("remove-iframe").onclick = () => removeIframe();

document.getElementById("copy-stats").onclick = () => {
  const logEntries = [
    ["Iteration", "Heap Size after adding (MB)", "Heap Size after removal (MB)"],
    ...iterationMemoryStats.slice(0, iteration).map((pair, index) => [index, ...pair]),
  ];

  const textToWrite = logEntries.map((entry) => entry.join("\t")).join("\n");

  navigator.clipboard
    .writeText(textToWrite)
    .then(() => {
      console.log("Wrote stats to the clipboard, and also logging them to the console for good measure");
      console.log(textToWrite);
    })
    .catch((e) => {
      console.log(textToWrite);
      alert("Could not write to clipboard, but outputting them to the console.");
    });
};

document.getElementById("update-heap-stats").onclick = () => updateIterationAndHeapSizeDisplay();

let isLoopOn = false;
const goOrStopButton = document.getElementById("loop-go-or-stop");
goOrStopButton.onclick = async () => {
  if (isLoopOn) {
    isLoopOn = false;
    goOrStopButton.textContent = "Go!";
    return;
  }
  runLoop();
};

async function runLoop() {
  goOrStopButton.textContent = "Stop";
  isLoopOn = true;
  while (isLoopOn) {
    await addIframe();
    await removeIframe();

    if (iteration > document.getElementById("stop-at-iteration-number").value) {
      isLoopOn = false;
      goOrStopButton.textContent = "Go!";
    }
  }
}

// For cases where we throw an unhandled error in the parent window, we need to re-start the iteration
window.onunhandledrejection = async () => {
  await removeIframe(); // Cleanup previous iframe that triggered the unhandled exception.
  const shouldRestart = iteration <= document.getElementById("stop-at-iteration-number").value;

  if (!shouldRestart) {
    isLoopOn = false;
    goOrStopButton.textContent = "Go!";
    return;
  }

  runLoop();
};

updateIterationAndHeapSizeDisplay();

// Heap size in MB.
function getUsedJsHeapSize() {
  try {
    return (performance.memory.usedJSHeapSize / Math.pow(1000, 2)).toFixed(4);
  } catch (e) {
    return -1;
  }
}

async function updateIterationAndHeapSizeDisplay() {
  const gc = window.gc;
  if (gc) {
    gc();
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  document.getElementById("iteration-number").textContent = iteration;
  document.getElementById("memory").textContent = getUsedJsHeapSize();
}

/**
 * One technique for filtering out error objects from the console that does NOT work
 * (because the global "Error" object is not equal to an Error object created (and logged) in the iframe window)
 */
function overrideConsoleForIframeBroken(iframeWindow) {
  const originalConsoleError = iframeWindow.window.console.error;
  iframeWindow.window.console.error = function (...args) {
    const newArgs = args.filter((arg) => {
      if (arg instanceof Error) {
        console.log("DID filter out iframe Error from logs.");
        return false;
      }
      console.log("DID NOT filter out iframe Error from logs.");
      return true;
    });
    if (newArgs.length > 0) {
      originalConsoleError(...newArgs);
    }
  };
}

/** Demonstration of how to fix the above override function. */
function overrideConsoleForIframeFixed(iframeWindow) {
  const originalConsoleError = iframeWindow.window.console.error;
  iframeWindow.window.console.error = function (...args) {
    const newArgs = args.filter((arg) => {
      if (arg instanceof iframeWindow.window.Error) {
        console.log("DID filter out iframe Error from logs.");
        return false;
      }
      console.log("DID NOT filter out iframe Error from logs.");
      return true;
    });
    if (newArgs.length > 0) {
      originalConsoleError(...newArgs);
    }
  };
}

function logOutsideIframeError() {
  console.error(new Error("This error was logged outside the <iframe>"));
}

const errorCreatedOutsideIframe = new Error("This error object was CREATED outside the iframe context");

function logOutsideIframeErrorCreatedOutsideIframe() {
  console.error(errorCreatedOutsideIframe);
}

function logOutsideIframeObject() {
  console.error({ objectCreated: "outside iframe, but passing through iframe control flow." });
}

function throwUnhandledError() {
  throw new Error("This error was thrown outside the iframe, but triggered from within it.");
}

/**
 * Potential implementation of a workaround that could be applied to the iframe window to prevent console.error memory leaks in a generic way.
 */
function overrideConsoleErrorToStringifyNonPrimitives(iframeWindow) {
  const windowContext = iframeWindow.window;
  windowContext.console.error = function (...args) {
    let didError = false;
    const newArgs = args.map((arg) => {
      // Non-primitive values cause the memory leak.
      try {
        if (typeof arg === "object" && arg !== null) {
          return JSON.stringify(arg); // TODO: This doesn't work with errors. Do we need something better?
        } else if (arg === "function") {
          return `function: ${arg.name}`; // TODO: does name always have a value (anonymous functions)?
        }
      } catch (e) {
        didError = true;
        return `<Error stringifying ${typeof arg} argument>`;
      }

      // TODO:
      return arg;
    });
    if (newArgs.length > 0) {
      if (didError) {
        originalConsoleError(`Logging non-primitive values from an iframe can cause memory leaks. We attempted to stringify something, but failed.`);
      }
      originalConsoleError(...newArgs);
    }
  };
}

async function throwAsyncErrorInIframeAndCatchItOutside(iframe) {
  try {
    await iframe.contentWindow.triggerAsyncThrowError();
  } catch (e) {
    console.log("Could not load", e);
  }
}
