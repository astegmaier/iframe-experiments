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
    case "log-object-in-iframe":
      iframe.contentWindow.intentionallyLogObjectToConsole();
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
