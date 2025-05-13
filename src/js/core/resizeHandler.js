import {
  app,
  backgroundLayer,
  ctaButton,
  getScalingVars,
  hintArrowSprite,
  logoSprite,
  nextStageButton,
  setScalingVars,
  worldContainer,
} from "./app";
import {DESIGN_HEIGHT, DESIGN_WIDTH, STAGES} from "../utils/constants";
import {updateHintArrowPosition} from "../ui/hint";
import {getCurrentStage} from "../game/stages";

export function handleResize() {
  if (!app || !app.renderer) return;

  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  app.renderer.resize(screenW, screenH);

  const sXDesign = screenW / DESIGN_WIDTH;
  const sYDesign = screenH / DESIGN_HEIGHT;
  const sBase = Math.min(sXDesign, sYDesign);

  setScalingVars({
    screenWidth: screenW,
    screenHeight: screenH,
    scaleXDesign: sXDesign,
    scaleYDesign: sYDesign,
    baseScale: sBase,
  });

  const {baseScale} = getScalingVars();

  if (backgroundLayer) {
    backgroundLayer.pivot.set(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2);
    backgroundLayer.x = screenW / 2;
    backgroundLayer.y = screenH / 2;
    const effectiveBackgroundLayerScale =
      Math.max(sXDesign, sYDesign) *
      (backgroundLayer.currentZoomFactor || 1.0);
    backgroundLayer.scale.set((effectiveBackgroundLayerScale / 2) * 1.2);
  }
  
  if (worldContainer) {
    worldContainer.pivot.set(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2);
    worldContainer.x = screenW / 2;
    worldContainer.y = screenH / 2;
    let worldContainerTargetScale = sBase;
    const currentStageIdx = getCurrentStage();

    if (currentStageIdx === STAGES.CHIP_FIELD) {
      const availableHeightForGrid = screenH * 0.60;
      const desiredGridPixelHeight = DESIGN_HEIGHT * 0.75;
      worldContainerTargetScale = Math.min(
        sXDesign,
        availableHeightForGrid / desiredGridPixelHeight
      );
      worldContainerTargetScale = Math.max(worldContainerTargetScale, 0.4);

    } else if (
      worldContainer.currentZoomFactor &&
      worldContainer.currentZoomFactor !== 1
    ) {
      worldContainerTargetScale = sBase * worldContainer.currentZoomFactor;
    } else {
      worldContainerTargetScale = sBase;
    }
    worldContainer.scale.set(worldContainerTargetScale);
  }

  const fixedLogoSize = 50;
  const fixedMargin = 20;

  if (logoSprite) {
    logoSprite.width = fixedLogoSize;
    logoSprite.height = fixedLogoSize;
    logoSprite.x = fixedMargin;
    logoSprite.y = fixedMargin;
  }

  const verticalMargin = screenH * 0.05;
  const heightThreshold = 500;
  const buttonEffectiveScale = Math.min(baseScale, 1.0);

  if (ctaButton) {
    const ctaBaseFactor = 0.65;
    ctaButton.scale.set(buttonEffectiveScale * ctaBaseFactor);

    if (screenH < heightThreshold) {
      ctaButton.width = 80
      ctaButton.height = 80
      ctaButton.x = fixedMargin + ctaButton.width / 3;
      ctaButton.y = logoSprite.y + (ctaButton.height / 2) + fixedMargin;
    } else {
      ctaButton.x = screenW - verticalMargin - ctaButton.width / 2;
      ctaButton.y = verticalMargin + 40;
    }
  }

  if (nextStageButton) {
    const nextButtonBaseFactor = 0.9;
    let currentNextButtonScale = buttonEffectiveScale * nextButtonBaseFactor;
    nextStageButton.scale.set(currentNextButtonScale);
    nextStageButton.x = screenW - nextStageButton.width / 1.8;
    nextStageButton.y = screenH - verticalMargin * 2.6;
  }

  if (hintArrowSprite && hintArrowSprite.visible) {
    updateHintArrowPosition();
  }
}
