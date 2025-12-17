// polyfills.ts
import { Buffer } from "buffer";
import "react-native-get-random-values";
global.Buffer = Buffer;

// define crypto.getRandomValues if not already available
if (typeof global.crypto === "undefined") {
  global.crypto = {
    getRandomValues: (array: Uint8Array) => {
      const { getRandomValues } = require("react-native-get-random-values");
      return getRandomValues(array);
    },
  } as Crypto;
}
