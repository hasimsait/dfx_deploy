import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import LoadingScreen from "./Components/LoadingScreen";
import * as UnityContextUtils from "./Utils/UnityContextUtils";

const unityContext = new UnityContext({
  loaderUrl: "Build/wallet.loader.js",
  dataUrl: "Build/wallet.data",
  frameworkUrl: "Build/wallet.framework.js",
  codeUrl: "Build/wallet.wasm",
  //  streamingAssetsUrl: "StreamingAssets",
  //  productName: "IC Unity Template",
  //  productVersion: "0.1.0",
  //  companyName: "IC Unity Template",
});

function App() {
  
  console.log("My App init!!!");

  UnityContextUtils.AddUnityListeners(unityContext);
  document.querySelector("#close-microphone-button").classList.add("display-none");
  return (
    <div>
      <Unity
        unityContext={unityContext}
        devicePixelRatio={1}
        style={{
          height: "90%",
          width: "100%"
        }}
      />
      
    </div>
  );
}

export default App;
