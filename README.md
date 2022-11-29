# iframe-experiments

This repository demonstrates a memory leak in chromium browsers when that can occur when objects are logged to the console from an `<iframe>` context, and the iframe is destroyed (but the memory associated with the `<iframe>` is retained).

To view the demo page, visit [src/index.html](src/index.html).
