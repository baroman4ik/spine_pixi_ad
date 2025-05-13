import * as PIXI from "pixi.js";
import {loadedTextures} from "../core/assetLoader";
import {resetInactivityDetection} from "./hint";

export function createInteractiveButton(text, onClickCallback) {
  const buttonContainer = new PIXI.Container();
  if (!loadedTextures.btnTexture) {
    console.error("Button texture (btnTexture) not loaded!");

    const fallbackGfx = new PIXI.Graphics().rect(0, 0, 100, 50).fill(0xcccccc);
    buttonContainer.addChild(fallbackGfx);

    const fallbackText = new PIXI.Text("ERR", {fontSize: 20});

    fallbackText.anchor.set(0.5);
    fallbackText.x = 50;
    fallbackText.y = 25;
    buttonContainer.addChild(fallbackText);
    return buttonContainer;
  }

  const gfx = new PIXI.Sprite(loadedTextures.btnTexture);
  
  gfx.anchor.set(0.5);
  buttonContainer.addChild(gfx);

  const buttonLabel = new PIXI.Text(text, {
    fontFamily: "Arial, sans-serif",
    fontSize: 24,
    fill: 0xffffff,
    align: "center",
    stroke: "#000000",
    strokeThickness: 3,
    fontWeight: "bold",
  });

  buttonLabel.anchor.set(0.5);

  const maxTextWidth = gfx.width * 0.6,
    maxTextHeight = gfx.height * 0.3;

  buttonLabel.style.fontSize = Math.min(
    maxTextHeight,
    (gfx.width / buttonLabel.width) * buttonLabel.style.fontSize * 0.6
  );

  if (buttonLabel.width > maxTextWidth)
    buttonLabel.scale.x = maxTextWidth / buttonLabel.width;

  if (buttonLabel.height > maxTextHeight)
    buttonLabel.scale.y = maxTextHeight / buttonLabel.height;

  buttonContainer.addChild(buttonLabel);
  buttonContainer.eventMode = "static";
  buttonContainer.cursor = "pointer";
  buttonContainer.on("pointertap", () => {
    resetInactivityDetection();
    onClickCallback();
  });

  return buttonContainer;
}
