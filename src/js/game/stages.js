import * as PIXI from "pixi.js";
import {gsap} from "gsap";
import {DESIGN_HEIGHT, DESIGN_WIDTH, STAGES} from "../utils/constants";
import {loadedTextures} from "../core/assetLoader";
import {loadAndCreateSpine} from "./spine";
import {
  backgroundLayer,
  ctaButton,
  getChipFieldContainer,
  logoSprite,
  nextStageButton,
  setAnimatedObjectSprite,
  setChipFieldContainer,
  setFireworkAnimatedSprite,
  setGameGrid,
  setIsProcessingMove,
  worldContainer
} from "../core/app";
import * as PlayableAPI from "../lib/test";
import {setupChipFieldStage} from "./chipField";
import {handleResize} from "../core/resizeHandler";

let currentStageIdx = 0;

export function getCurrentStage() {
  return currentStageIdx;
}

function clearWorldContainer() {
  if (worldContainer) {
    worldContainer.removeChildren();
  } else {
    console.error("worldContainer не найден при очистке.");
  }
  setAnimatedObjectSprite(null);
  setFireworkAnimatedSprite(null);
  if (getChipFieldContainer()) {
    setChipFieldContainer(null);
  }
  setGameGrid([]);
  setIsProcessingMove(false);
}

function setupFireworkStage() {
  if (
    !loadedTextures.fireworkFrames ||
    loadedTextures.fireworkFrames.length === 0
  ) {
    console.error("Кадры фейерверка не загружены!");
    setFireworkAnimatedSprite(null);
    return null;
  }
  if (!worldContainer) {
    console.error("setupFireworkStage: worldContainer недоступен!");
    setFireworkAnimatedSprite(null);
    return null;
  }

  const newFireworkSprites = [];
  const fireworkCount = Math.floor(Math.random() * 3) + 3;

  for (let i = 0; i < fireworkCount; i++) {
    const fwSprite = new PIXI.AnimatedSprite(loadedTextures.fireworkFrames);
    fwSprite.anchor.set(0.5);
    fwSprite.x = Math.random() * DESIGN_WIDTH;
    fwSprite.y = Math.random() * DESIGN_HEIGHT;
    fwSprite.animationSpeed = 0.2 + Math.random() * 0.1;
    fwSprite.loop = false;
    const scale = Math.random() * 0.5 + 0.5;
    fwSprite.scale.set(scale);
    fwSprite.onComplete = () => {
      gsap.to(fwSprite, {
        alpha: 0, duration: 0.3,
        onComplete: () => {
          if (fwSprite.parent) fwSprite.parent.removeChild(fwSprite);
        }
      });
    };
    worldContainer.addChild(fwSprite);
    newFireworkSprites.push(fwSprite);
    gsap.delayedCall(Math.random() * 0.5, () => {
      if (fwSprite.parent) fwSprite.play();
    });
  }

  setFireworkAnimatedSprite(newFireworkSprites);
  return newFireworkSprites;
}

export async function transitionToStage(newStage) {
  if (!backgroundLayer || !worldContainer) {
    console.error("Невозможно сменить этап: backgroundLayer или worldContainer отсутствует!");
    return;
  }
  gsap.killTweensOf(backgroundLayer.scale);
  gsap.killTweensOf(worldContainer.scale);

  currentStageIdx = newStage;

  let targetBackgroundZoomFactor = 1.0;
  if ([STAGES.CHIP_FIELD, STAGES.ANIMATED_OBJECT].includes(currentStageIdx)) targetBackgroundZoomFactor = 1.2;
  const oldBackgroundZoomFactor = backgroundLayer.currentZoomFactor;
  const currentVisualBgScaleX = backgroundLayer.scale.x;
  const currentVisualBgScaleY = backgroundLayer.scale.y;
  backgroundLayer.currentZoomFactor = targetBackgroundZoomFactor;
  handleResize();
  const finalCalculatedBgScaleX = backgroundLayer.scale.x;
  const finalCalculatedBgScaleY = backgroundLayer.scale.y;
  if (oldBackgroundZoomFactor !== targetBackgroundZoomFactor || Math.abs(currentVisualBgScaleX - finalCalculatedBgScaleX) > 0.001 || Math.abs(currentVisualBgScaleY - finalCalculatedBgScaleY) > 0.001) {
    backgroundLayer.scale.set(currentVisualBgScaleX, currentVisualBgScaleY);
    gsap.to(backgroundLayer.scale, {
      x: finalCalculatedBgScaleX,
      y: finalCalculatedBgScaleY,
      duration: 0.5,
      ease: "power2.out",
    });
  } else {
    backgroundLayer.scale.set(finalCalculatedBgScaleX, finalCalculatedBgScaleY);
  }

  clearWorldContainer();

  if (ctaButton) ctaButton.visible = true;
  if (logoSprite) logoSprite.visible = true;
  if (nextStageButton) nextStageButton.visible = true;

  try {
    switch (currentStageIdx) {
      case STAGES.INTRO:
        PlayableAPI.playableStarted?.();
        break;
      case STAGES.CHIP_FIELD:
        await setupChipFieldStage();
        const cfc = getChipFieldContainer();
        if (cfc) {
          cfc.alpha = 0;
          gsap.to(cfc, {alpha: 1, duration: 0.5, delay: 0.2});
        }
        break;
      case STAGES.ANIMATED_OBJECT:
        const spineObject = await loadAndCreateSpine();
        if (spineObject) {
          spineObject.alpha = 0;
          gsap.to(spineObject, {alpha: 1, duration: 0.5, delay: 0.2});
        } else {
          console.error("Не удалось загрузить или создать Spine-объект для этапа.");
        }
        break;
      case STAGES.FIREWORK_OUTRO:
        const fireworks = setupFireworkStage();
        if (fireworks) fireworks.forEach(fs => {
          if (fs) {
            fs.alpha = 0;
            gsap.to(fs, {alpha: 1, duration: 0.5, delay: Math.random() * 0.5 + 0.3});
          }
        });
        if (nextStageButton) nextStageButton.visible = false;
        PlayableAPI.playableFinished?.();
        break;
      case STAGES.END_SCREEN:
        if (nextStageButton) nextStageButton.visible = false;
        if (ctaButton) ctaButton.visible = true;
        const endText = new PIXI.Text("Test", {
          fontFamily: "Arial",
          fontSize: 50,
          fill: 0xffffff,
          align: "center",
          stroke: "#000000",
          strokeThickness: 6
        });
        endText.anchor.set(0.5);
        endText.x = DESIGN_WIDTH / 2;
        endText.y = DESIGN_HEIGHT / 2;
        if (worldContainer) worldContainer.addChild(endText);
        break;
      default:
        if (nextStageButton) nextStageButton.visible = false;
    }
  } catch (error) {
    console.error(`Ошибка при настройке этапа ${currentStageIdx}:`, error);
  }
}
