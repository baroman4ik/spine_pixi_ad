import * as PIXI from "pixi.js";
import {DESIGN_HEIGHT, DESIGN_WIDTH} from "../utils/constants";

export let app;
export let backgroundLayer, worldContainer, uiContainer;

export let logoSprite, ctaButton, nextStageButton;
export let chipFieldContainer;
export let animatedObjectSprite, fireworkAnimatedSprite;
export let hintArrowSprite;
export let currentlyDraggedChip = null;
export let chipDragData = {
  startPosition: new PIXI.Point(),
  offset: new PIXI.Point(),
  initialGridPos: null,
};
export let gameGrid = [];
export let isProcessingMove = false;
export let chipVisualSizeRef,
  spacingRef,
  chipSizeWithSpacingRef,
  startXRef,
  startYRef;

export let baseScale, screenWidth, screenHeight, scaleXDesign, scaleYDesign;

export async function initPixiApp() {
  app = new PIXI.Application();
  await app.init({
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x1099bb,
    antialias: true,
  });
  document.body.appendChild(app.canvas);
  app.renderer.resize(window.innerWidth, window.innerHeight);

  backgroundLayer = new PIXI.Container();
  backgroundLayer.currentZoomFactor = 1.0;

  worldContainer = new PIXI.Container();
  worldContainer.currentZoomFactor = 1.0;

  uiContainer = new PIXI.Container();
  app.stage.addChild(backgroundLayer, worldContainer, uiContainer);

  app.stage.eventMode = "static";

  return {app, backgroundLayer, worldContainer, uiContainer};
}

export function setLogoSprite(sprite) {
  logoSprite = sprite;
}

export function setCtaButton(button) {
  ctaButton = button;
}

export function setNextStageButton(button) {
  nextStageButton = button;
}

export function setChipFieldContainer(container) {
  chipFieldContainer = container;
}

export function getChipFieldContainer() {
  return chipFieldContainer;
}

export function setAnimatedObjectSprite(sprite) {
  animatedObjectSprite = sprite;
}

export function getAnimatedObjectSprite() {
  return animatedObjectSprite;
}

export function setFireworkAnimatedSprite(sprite) {
  fireworkAnimatedSprite = sprite;
}

export function getFireworkAnimatedSprite() {
  return fireworkAnimatedSprite;
}

export function setHintArrowSprite(sprite) {
  hintArrowSprite = sprite;
}

export function setCurrentlyDraggedChip(chip) {
  currentlyDraggedChip = chip;
}

export function getCurrentlyDraggedChip() {
  return currentlyDraggedChip;
}

export function setChipDragData(data) {
  chipDragData = {...chipDragData, ...data};
}

export function getChipDragData() {
  return chipDragData;
}

export function setGameGrid(grid) {
  gameGrid = grid;
}

export function getGameGrid() {
  return gameGrid;
}

export function setIsProcessingMove(value) {
  isProcessingMove = value;
}

export function getIsProcessingMove() {
  return isProcessingMove;
}

export function setChipLayoutRefs(refs) {
  chipVisualSizeRef = refs.chipVisualSizeRef;
  spacingRef = refs.spacingRef;
  chipSizeWithSpacingRef = refs.chipSizeWithSpacingRef;
  startXRef = refs.startXRef;
  startYRef = refs.startYRef;
}

export function getChipLayoutRefs() {
  return {
    chipVisualSizeRef,
    spacingRef,
    chipSizeWithSpacingRef,
    startXRef,
    startYRef,
  };
}

export function setScalingVars(vars) {
  baseScale = vars.baseScale;
  screenWidth = vars.screenWidth;
  screenHeight = vars.screenHeight;
  scaleXDesign = vars.scaleXDesign;
  scaleYDesign = vars.scaleYDesign;
}

export function getScalingVars() {
  return {baseScale, screenWidth, screenHeight, scaleXDesign, scaleYDesign};
}