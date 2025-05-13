import {GRID_SIZE, INACTIVITY_TIMEOUT, STAGES} from "../utils/constants";
import {
  getChipFieldContainer,
  getGameGrid,
  getIsProcessingMove,
  getScalingVars,
  hintArrowSprite,
  nextStageButton,
} from "../core/app";
import {getCurrentStage} from "../game/stages";
import * as PIXI from "pixi.js";

let inactivityTimerId = null;

export function updateHintArrowPosition() {
  if (
    !hintArrowSprite ||
    !hintArrowSprite.textures ||
    hintArrowSprite.textures.length === 0
  ) {
    if (hintArrowSprite) hintArrowSprite.visible = false;
    return;
  }

  const {screenWidth, screenHeight} = getScalingVars();
  if (!screenWidth || !screenHeight) {
    if (hintArrowSprite) hintArrowSprite.visible = false;
    return;
  }

  const hintSize = Math.min(screenWidth, screenHeight) * 0.12;
  hintArrowSprite.width = hintArrowSprite.height = hintSize;

  let targetFound = false;
  let targetGlobalX = 0;
  let targetGlobalY = 0;

  const currentStageIdx = getCurrentStage();

  if (currentStageIdx === STAGES.CHIP_FIELD) {
    const chipFieldCont = getChipFieldContainer();
    if (
      chipFieldCont && chipFieldCont.parent &&
      getGameGrid() && getGameGrid().length > 0 && GRID_SIZE >= 1
    ) {
      const localCenterOfChipField = new PIXI.Point(0, 0);
      const globalCenterOfChipField = chipFieldCont.toGlobal(localCenterOfChipField);
      targetGlobalX = globalCenterOfChipField.x;
      targetGlobalY = globalCenterOfChipField.y;
      hintArrowSprite.x = targetGlobalX + hintArrowSprite.width * (hintArrowSprite.anchor.x - 0.3);
      hintArrowSprite.y = targetGlobalY + hintArrowSprite.height * (hintArrowSprite.anchor.y - 0.3);
      targetFound = true;
    }
  } else if (
    nextStageButton &&
    nextStageButton.visible &&
    nextStageButton.parent
  ) {
    const buttonBounds = nextStageButton.getBounds(true);
    targetGlobalX = buttonBounds.x + buttonBounds.width / 2;
    targetGlobalY = buttonBounds.y + buttonBounds.height / 2;
    const tipOffsetX = hintArrowSprite.width * 0.15;
    const tipOffsetY = hintArrowSprite.height * 0.1;
    const desiredTipX = targetGlobalX - tipOffsetX;
    const desiredTipY = targetGlobalY - tipOffsetY;
    hintArrowSprite.x = desiredTipX + hintArrowSprite.width * hintArrowSprite.anchor.x;
    hintArrowSprite.y = desiredTipY + hintArrowSprite.height * hintArrowSprite.anchor.y;
    targetFound = true;
  }

  hintArrowSprite.visible = targetFound;
}

export function showInactivityHint() {
  if (getIsProcessingMove()) {
    if (hintArrowSprite) hintArrowSprite.visible = false;
    return;
  }
  const currentStageIdx = getCurrentStage();
  const isNextButtonValidForHint = nextStageButton && nextStageButton.visible && nextStageButton.parent;
  const isGameBusy = getIsProcessingMove();
  const canShowHint =
    !isGameBusy &&
    (currentStageIdx === STAGES.CHIP_FIELD ||
      (isNextButtonValidForHint &&
        currentStageIdx < STAGES.FIREWORK_OUTRO &&
        currentStageIdx !== STAGES.END_SCREEN));
  if (!hintArrowSprite || !canShowHint) {
    if (hintArrowSprite) hintArrowSprite.visible = false;
    return;
  }
  if (!hintArrowSprite.textures || hintArrowSprite.textures.length === 0) {
    if (hintArrowSprite) hintArrowSprite.visible = false;
    return;
  }
  updateHintArrowPosition();
  if (hintArrowSprite.visible) {
    hintArrowSprite.loop = false;
    hintArrowSprite.animationSpeed = 0.5;
    hintArrowSprite.onComplete = () => {
      if (hintArrowSprite) {
        hintArrowSprite.visible = false;
        hintArrowSprite.onComplete = null;
        hintArrowSprite.animationSpeed = 0.25;
      }
      resetInactivityDetection();
    };
    if (hintArrowSprite.textures && hintArrowSprite.textures.length > 0) {
      hintArrowSprite.gotoAndPlay(0);
    } else {
      hintArrowSprite.visible = false;
    }
  }
}

export function resetInactivityDetection() {
  if (inactivityTimerId) {
    clearTimeout(inactivityTimerId);
    inactivityTimerId = null;
  }
  if (hintArrowSprite) {
    hintArrowSprite.visible = false;
    if (hintArrowSprite.playing) {
      hintArrowSprite.stop();
    }
    hintArrowSprite.onComplete = null;
    hintArrowSprite.animationSpeed = 0.25;
  }
  const currentStageIdx = getCurrentStage();
  const isNextButtonAvailableAndVisible = nextStageButton && nextStageButton.visible && nextStageButton.parent;
  const isGameBusy = getIsProcessingMove();
  const canRestartTimer =
    !isGameBusy &&
    ((currentStageIdx === STAGES.CHIP_FIELD) ||
      (isNextButtonAvailableAndVisible &&
        currentStageIdx < STAGES.FIREWORK_OUTRO &&
        currentStageIdx !== STAGES.END_SCREEN));
  if (canRestartTimer) {
    inactivityTimerId = setTimeout(showInactivityHint, INACTIVITY_TIMEOUT);
  }
}
