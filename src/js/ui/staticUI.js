import * as PIXI from 'pixi.js';
import {loadedTextures} from '../core/assetLoader';
import {createInteractiveButton} from './buttons';
import * as PlayableAPI from '../lib/test';
import {getCurrentStage, transitionToStage} from '../game/stages';
import {
  backgroundLayer,
  setCtaButton,
  setHintArrowSprite,
  setLogoSprite,
  setNextStageButton,
  uiContainer,
} from '../core/app';
import {DESIGN_HEIGHT, DESIGN_WIDTH} from '../utils/constants';

export function setupStaticUI() {
  let localBackgroundSprite,
    localLogoSprite,
    localCtaButton,
    localNextStageButton,
    localHintArrowSprite;

  if (loadedTextures.bg) {
    localBackgroundSprite = new PIXI.Sprite(loadedTextures.bg);
    localBackgroundSprite.anchor.set(0.5);
    localBackgroundSprite.x = DESIGN_WIDTH / 2;
    localBackgroundSprite.y = DESIGN_HEIGHT / 2;
    backgroundLayer.addChildAt(localBackgroundSprite, 0);
  } else console.error("Текстура background не загружена");

  if (loadedTextures.logoTexture) {
    localLogoSprite = new PIXI.Sprite(loadedTextures.logoTexture);
    uiContainer.addChild(localLogoSprite);
    setLogoSprite(localLogoSprite);
  } else console.error("Текстура logo не загружена");

  if (loadedTextures.btnTexture) {
    localCtaButton = createInteractiveButton(
      "INSTALL NOW",
      PlayableAPI.playableGoToStore
    );
    uiContainer.addChild(localCtaButton);
    setCtaButton(localCtaButton);
  } else console.error("Текстура btn не загружена для ctaButton");

  if (loadedTextures.btnTexture) {
    localNextStageButton = createInteractiveButton("NEXT", () => {
      transitionToStage(getCurrentStage() + 1);
    });
    uiContainer.addChild(localNextStageButton);
    setNextStageButton(localNextStageButton);
  } else console.error("Текстура btn не загружена для nextStageButton");

  if (
    loadedTextures.pointingHandFrames &&
    loadedTextures.pointingHandFrames.length > 0
  ) {
    localHintArrowSprite = new PIXI.AnimatedSprite(
      loadedTextures.pointingHandFrames
    );
    localHintArrowSprite.animationSpeed = 0.25;
    localHintArrowSprite.anchor.set(0.1, 0.95);
    localHintArrowSprite.visible = false;
    localHintArrowSprite.loop = true;
    uiContainer.addChild(localHintArrowSprite);
    setHintArrowSprite(localHintArrowSprite);
  } else {
    setHintArrowSprite(null);
  }

  return {
    localBackgroundSprite,
    localLogoSprite,
    localCtaButton,
    localNextStageButton,
    localHintArrowSprite,
  };
}
