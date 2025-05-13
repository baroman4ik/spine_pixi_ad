import {STAGES} from "./utils/constants";
import * as PlayableAPI from "./lib/test";
import {app as pixiApp, initPixiApp} from "./core/app";
import {loadAllAssets} from "./core/assetLoader";
import {setupStaticUI} from "./ui/staticUI";
import {handleResize} from "./core/resizeHandler";
import {transitionToStage} from "./game/stages";
import {resetInactivityDetection} from "./ui/hint";

window.onload = async () => {
  try {
    await initPixiApp();
    await loadAllAssets();
    setupStaticUI();
    handleResize();
    PlayableAPI.playableLoaded();
    await transitionToStage(STAGES.INTRO);
    window.addEventListener("resize", handleResize);
    if (pixiApp && pixiApp.stage) {
      pixiApp.stage.on("pointerdown", resetInactivityDetection);
    }
  } catch (error) {
    console.log("Ошибка инициализации PixiJS:", error);
    document.body.innerHTML =
      "Ошибка загрузки playable. Проверьте ассеты и консоль. " + error.message;
    console.error("Stack trace:", error.stack);
  }
};
