import * as PIXI from 'pixi.js';
import {gsap} from 'gsap';
import {
  CHIP_ASSET_KEYS,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  GAME_BOARD_TEXTURE_HEIGHT,
  GAME_BOARD_TEXTURE_WIDTH,
  GRID_SIZE,
  MAX_GRID_SIZE_FOR_BOARD,
  STAGES,
} from '../utils/constants';
import {loadedTextures} from '../core/assetLoader';
import {
  app,
  getChipDragData,
  getChipFieldContainer,
  getChipLayoutRefs,
  getCurrentlyDraggedChip,
  getGameGrid,
  getIsProcessingMove,
  setChipDragData,
  setChipFieldContainer,
  setChipLayoutRefs,
  setCurrentlyDraggedChip,
  setGameGrid,
  setIsProcessingMove,
  worldContainer,
} from '../core/app';
import {resetInactivityDetection} from '../ui/hint';
import {getCurrentStage} from './stages';

function getChipScreenPosition(row, col) {
  const {startXRef, startYRef, chipSizeWithSpacingRef} = getChipLayoutRefs();
  return {
    x: startXRef + col * chipSizeWithSpacingRef,
    y: startYRef + row * chipSizeWithSpacingRef,
  };
}

function getGridCellFromLocalPosition(localX, localY) {
  const {startXRef, startYRef, chipVisualSizeRef, chipSizeWithSpacingRef} =
    getChipLayoutRefs();
  const relativeX = localX - (startXRef - chipVisualSizeRef / 2);
  const relativeY = localY - (startYRef - chipVisualSizeRef / 2);
  const col = Math.floor(relativeX / chipSizeWithSpacingRef);
  const row = Math.floor(relativeY / chipSizeWithSpacingRef);
  if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
    return {row, col};
  }
  return null;
}

async function onChipDragStart(event) {
  if (getIsProcessingMove() || getCurrentStage() !== STAGES.CHIP_FIELD) return;
  resetInactivityDetection();
  const chip = event.currentTarget;
  setCurrentlyDraggedChip(chip);
  chip.alpha = 0.7;
  chip.cursor = "grabbing";

  const chipFieldCont = getChipFieldContainer();
  if (!chipFieldCont) {
    console.error("ChipFieldContainer не найден в onChipDragStart");
    setCurrentlyDraggedChip(null);
    return;
  }

  const newStartPosition = new PIXI.Point();
  chipFieldCont.toLocal(event.global, null, newStartPosition);

  setChipDragData({
    startPosition: newStartPosition,
    offset: new PIXI.Point(
      newStartPosition.x - chip.x,
      newStartPosition.y - chip.y
    ),
    initialGridPos: {row: chip.gridRow, col: chip.gridCol},
  });
  chipFieldCont.setChildIndex(chip, chipFieldCont.children.length - 1);
}

function onChipDragMove(event) {
  const currentlyDraggedChip = getCurrentlyDraggedChip();
  const chipDragData = getChipDragData();
  if (
    currentlyDraggedChip &&
    !getIsProcessingMove() &&
    getCurrentStage() === STAGES.CHIP_FIELD
  ) {
    const chipFieldCont = getChipFieldContainer();
    if (!chipFieldCont) {
      console.error("ChipFieldContainer не найден в onChipDragMove");
      return;
    }
    const newPos = chipFieldCont.toLocal(event.global);
    currentlyDraggedChip.x = newPos.x - chipDragData.offset.x;
    currentlyDraggedChip.y = newPos.y - chipDragData.offset.y;
  }
}

async function onChipDragEnd(event) {
  let draggedChip = getCurrentlyDraggedChip();

  if (
    !draggedChip ||
    getIsProcessingMove() ||
    getCurrentStage() !== STAGES.CHIP_FIELD
  ) {
    if (draggedChip) {
      draggedChip.alpha = 1.0;
      draggedChip.cursor = "grab";
    }
    setCurrentlyDraggedChip(null);
    return;
  }

  setIsProcessingMove(true);
  draggedChip.alpha = 1.0;
  draggedChip.cursor = "grab";

  const chipFieldCont = getChipFieldContainer();
  if (!chipFieldCont) {
    console.error("ChipFieldContainer не найден в onChipDragEnd");
    setIsProcessingMove(false);
    setCurrentlyDraggedChip(null);
    return;
  }

  const chipDragData = getChipDragData();
  const initialPos = chipDragData.initialGridPos;

  setCurrentlyDraggedChip(null);

  const dropLocalPos = chipFieldCont.toLocal(event.global);
  const targetCell = getGridCellFromLocalPosition(
    dropLocalPos.x,
    dropLocalPos.y
  );

  if (
    !targetCell ||
    (targetCell.row === initialPos.row && targetCell.col === initialPos.col)
  ) {
    const originalScreenPos = getChipScreenPosition(
      initialPos.row,
      initialPos.col
    );
    await gsap.to(draggedChip, {
      x: originalScreenPos.x,
      y: originalScreenPos.y,
      duration: 0.2,
    });
    setIsProcessingMove(false);
    resetInactivityDetection();
    return;
  }

  const dx = Math.abs(targetCell.col - initialPos.col);
  const dy = Math.abs(targetCell.row - initialPos.row);

  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    const gameGrid = getGameGrid();
    const targetChip = gameGrid[targetCell.row][targetCell.col];
    if (!targetChip) {
      const originalScreenPos = getChipScreenPosition(
        initialPos.row,
        initialPos.col
      );
      await gsap.to(draggedChip, {
        x: originalScreenPos.x,
        y: originalScreenPos.y,
        duration: 0.2,
      });
      setIsProcessingMove(false);
      return;
    }
    await performSwapAndMatch(draggedChip, targetChip);
  } else {
    const originalScreenPos = getChipScreenPosition(
      initialPos.row,
      initialPos.col
    );
    await gsap.to(draggedChip, {
      x: originalScreenPos.x,
      y: originalScreenPos.y,
      duration: 0.2,
    });
    setIsProcessingMove(false);
    resetInactivityDetection();
  }
}

async function animateSwap(chip1, chip2) {
  const chip1TargetPos = getChipScreenPosition(chip2.gridRow, chip2.gridCol);
  const chip2TargetPos = getChipScreenPosition(chip1.gridRow, chip1.gridCol);
  const tl = gsap.timeline();
  tl.to(chip1, {x: chip1TargetPos.x, y: chip1TargetPos.y, duration: 0.25}, 0);
  tl.to(chip2, {x: chip2TargetPos.x, y: chip2TargetPos.y, duration: 0.25}, 0);
  await tl;
}

async function performSwapAndMatch(chip1, chip2) {
  await animateSwap(chip1, chip2);

  let gameGrid = getGameGrid();
  const r1 = chip1.gridRow,
    c1 = chip1.gridCol;
  const r2 = chip2.gridRow,
    c2 = chip2.gridCol;

  gameGrid[r1][c1] = chip2;
  gameGrid[r2][c2] = chip1;
  chip1.gridRow = r2;
  chip1.gridCol = c2;
  chip2.gridRow = r1;
  chip2.gridCol = c1;
  setGameGrid([...gameGrid]);

  const matches = findAllMatches();
  if (matches.length > 0) {
    await processMatchesAndRefill(matches);
  } else {
    await animateSwap(chip1, chip2);
    gameGrid = getGameGrid();
    gameGrid[r1][c1] = chip1;
    gameGrid[r2][c2] = chip2;
    chip1.gridRow = r1;
    chip1.gridCol = c1;
    chip2.gridRow = r2;
    chip2.gridCol = c2;
    setGameGrid([...gameGrid]);
    setIsProcessingMove(false);
    resetInactivityDetection();
  }
}

function findAllMatches() {
  const matchedChips = new Set();
  const gameGrid = getGameGrid();
  if (!gameGrid || gameGrid.length === 0) return [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 2; c++) {
      if (!gameGrid[r]) continue;

      const chip1 = gameGrid[r][c];

      if (!chip1) continue;

      const chip2 = gameGrid[r][c + 1];
      const chip3 = gameGrid[r][c + 2];

      if (
        chip2 &&
        chip3 &&
        chip1.textureKey === chip2.textureKey &&
        chip1.textureKey === chip3.textureKey
      ) {
        let currentMatch = [chip1, chip2, chip3];
        for (let k = c + 3; k < GRID_SIZE; k++) {
          const nextChip = gameGrid[r][k];
          if (nextChip && nextChip.textureKey === chip1.textureKey) {
            currentMatch.push(nextChip);
          } else break;
        }
        currentMatch.forEach((chip) => matchedChips.add(chip));
        c += currentMatch.length - 1;
      }
    }
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    for (let r = 0; r < GRID_SIZE - 2; r++) {
      if (!gameGrid[r] || !gameGrid[r + 1] || !gameGrid[r + 2]) continue;
      const chip1 = gameGrid[r][c];

      if (!chip1) continue;

      const chip2 = gameGrid[r + 1][c];
      const chip3 = gameGrid[r + 2][c];
      if (
        chip2 &&
        chip3 &&
        chip1.textureKey === chip2.textureKey &&
        chip1.textureKey === chip3.textureKey
      ) {
        let currentMatch = [chip1, chip2, chip3];
        for (let k = r + 3; k < GRID_SIZE; k++) {
          if (!gameGrid[k]) break;
          const nextChip = gameGrid[k][c];
          if (nextChip && nextChip.textureKey === chip1.textureKey) {
            currentMatch.push(nextChip);
          } else break;
        }
        currentMatch.forEach((chip) => matchedChips.add(chip));
        r += currentMatch.length - 1;
      }
    }
  }
  return Array.from(matchedChips);
}

async function animateChipRemoval(chip) {
  const {chipVisualSizeRef} = getChipLayoutRefs();

  return gsap.to(chip, {
    alpha: 0,
    scaleX: 1.3,
    scaleY: 1.3,
    y: chip.y - chipVisualSizeRef * 0.3,
    duration: 0.3,
    onComplete: () => {
      if (chip.parent) chip.parent.removeChild(chip);
      chip.destroy({children: true, texture: false, baseTexture: false});
    },
  });
}

async function processMatchesAndRefill(initialMatches) {
  let currentMatches = initialMatches;
  let gameGrid = getGameGrid();
  while (currentMatches.length > 0) {
    const removalPromises = currentMatches.map((chip) => {
      if (
        gameGrid[chip.gridRow] &&
        gameGrid[chip.gridRow][chip.gridCol] === chip
      ) {
        gameGrid[chip.gridRow][chip.gridCol] = null;
      }
      return animateChipRemoval(chip);
    });

    setGameGrid([...gameGrid]);
    await Promise.all(removalPromises);
    await animateChipsFall();
    await refillWithNewChips();
    gameGrid = getGameGrid();
    currentMatches = findAllMatches();
  }
  setIsProcessingMove(false);
  resetInactivityDetection();
}

async function animateChipsFall() {
  const fallPromises = [];
  let gameGrid = getGameGrid();
  for (let c = 0; c < GRID_SIZE; c++) {
    let emptySpaces = 0;
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      if (!gameGrid[r]) continue;
      if (gameGrid[r][c] === null) {
        emptySpaces++;
      } else if (emptySpaces > 0) {
        const chipToFall = gameGrid[r][c];
        if (!gameGrid[r + emptySpaces]) gameGrid[r + emptySpaces] = [];
        gameGrid[r + emptySpaces][c] = chipToFall;
        gameGrid[r][c] = null;
        chipToFall.gridRow = r + emptySpaces;
        const targetPos = getChipScreenPosition(
          chipToFall.gridRow,
          chipToFall.gridCol
        );
        fallPromises.push(
          gsap.to(chipToFall, {
            y: targetPos.y,
            duration: 0.1 * emptySpaces,
            ease: "bounce.out",
          })
        );
      }
    }
  }
  setGameGrid([...gameGrid]);
  if (fallPromises.length > 0) await Promise.all(fallPromises);
}

async function refillWithNewChips() {
  const newChipPromises = [];
  let gameGrid = getGameGrid();
  const localChipFieldContainer = getChipFieldContainer();

  if (!localChipFieldContainer) {
    console.error("ChipFieldContainer не найден в refillWithNewChips!");
    setIsProcessingMove(false);
    return;
  }

  const {chipVisualSizeRef, chipSizeWithSpacingRef} =
    getChipLayoutRefs();

  for (let c = 0; c < GRID_SIZE; c++) {
    let newChipsDroppedInColumn = 0;
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      if (!gameGrid[r]) gameGrid[r] = [];

      if (gameGrid[r][c] === null) {
        const chipTextureKey =
          CHIP_ASSET_KEYS[Math.floor(Math.random() * CHIP_ASSET_KEYS.length)];
        const newChip = new PIXI.Sprite(loadedTextures[chipTextureKey]);
        newChip.anchor.set(0.5);
        newChip.width = newChip.height = chipVisualSizeRef;

        const finalPos = getChipScreenPosition(r, c);
        newChip.x = finalPos.x;
        newChip.y =
          getChipScreenPosition(0, c).y -
          (newChipsDroppedInColumn + 1) * chipSizeWithSpacingRef;

        newChip.gridRow = r;
        newChip.gridCol = c;
        newChip.textureKey = chipTextureKey;
        newChip.eventMode = "static";
        newChip.cursor = "grab";
        newChip.on("pointerdown", onChipDragStart);

        localChipFieldContainer.addChild(newChip);
        gameGrid[r][c] = newChip;

        newChipPromises.push(
          gsap.to(newChip, {
            y: finalPos.y,
            duration: 0.15 * (r + 1 + newChipsDroppedInColumn * 0.5),
            ease: "bounce.out",
            delay: 0.03 * newChipsDroppedInColumn,
          })
        );
        newChipsDroppedInColumn++;
      }
    }
  }
  setGameGrid([...gameGrid]);
  if (newChipPromises.length > 0) await Promise.all(newChipPromises);
}


export async function setupChipFieldStage() {
  const localChipFieldContainer = new PIXI.Container();
  localChipFieldContainer.x = DESIGN_WIDTH / 2;
  localChipFieldContainer.y = DESIGN_HEIGHT / 2;
  worldContainer.addChild(localChipFieldContainer);
  setChipFieldContainer(localChipFieldContainer);

  const boardFullDisplayWidth = DESIGN_WIDTH * 0.5;
  const boardFullDisplayHeight = (boardFullDisplayWidth / GAME_BOARD_TEXTURE_WIDTH) * GAME_BOARD_TEXTURE_HEIGHT;

  if (loadedTextures.gameBoardTexture) {
    const gameBoardSprite = new PIXI.Sprite(loadedTextures.gameBoardTexture);
    gameBoardSprite.anchor.set(0.5);
    gameBoardSprite.width = boardFullDisplayWidth;
    gameBoardSprite.height = boardFullDisplayHeight;

    gameBoardSprite.x = 0;
    gameBoardSprite.y = 0;
    localChipFieldContainer.addChildAt(gameBoardSprite, 0);
  } else {
    console.error("Текстура игровой доски не загружена");
  }

  const cellSizeForMaxGrid = boardFullDisplayWidth / MAX_GRID_SIZE_FOR_BOARD;
  const chipVisualSize = cellSizeForMaxGrid * 0.85;
  const spacing = cellSizeForMaxGrid * 0.15;
  const chipSizeWithSpacing = chipVisualSize + spacing;

  const currentGridDisplayWidth = GRID_SIZE * chipVisualSize + Math.max(0, GRID_SIZE - 1) * spacing;
  const currentGridDisplayHeight = GRID_SIZE * chipVisualSize + Math.max(0, GRID_SIZE - 1) * spacing;

  const startXOffset = -currentGridDisplayWidth / 2 + chipVisualSize / 2;
  const startYOffset = -currentGridDisplayHeight / 2 + chipVisualSize / 2;

  setChipLayoutRefs({
    chipVisualSizeRef: chipVisualSize,
    spacingRef: spacing,
    chipSizeWithSpacingRef: chipSizeWithSpacing,
    startXRef: startXOffset,
    startYRef: startYOffset,
  });

  let newGameGrid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    newGameGrid[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      let chipTextureKey;
      let attempts = 0;
      do {
        chipTextureKey =
          CHIP_ASSET_KEYS[Math.floor(Math.random() * CHIP_ASSET_KEYS.length)];
        attempts++;
        if (attempts > 50) {
          break;
        }
      } while (
        (c >= 2 &&
          newGameGrid[r][c - 1]?.textureKey === chipTextureKey &&
          newGameGrid[r][c - 2]?.textureKey === chipTextureKey) ||
        (r >= 2 &&
          newGameGrid[r - 1]?.[c]?.textureKey === chipTextureKey &&
          newGameGrid[r - 2]?.[c]?.textureKey === chipTextureKey)
        );

      const chip = new PIXI.Sprite(loadedTextures[chipTextureKey]);
      chip.anchor.set(0.5);
      chip.width = chip.height = chipVisualSize;
      const pos = getChipScreenPosition(r, c);
      chip.x = pos.x;
      chip.y = pos.y;

      chip.eventMode = "static";
      chip.cursor = "grab";
      chip.gridRow = r;
      chip.gridCol = c;
      chip.textureKey = chipTextureKey;

      chip.on("pointerdown", onChipDragStart);
      localChipFieldContainer.addChild(chip);
      newGameGrid[r][c] = chip;
    }
  }
  setGameGrid(newGameGrid);

  let initialMatches = findAllMatches();
  if (initialMatches.length > 0) {
    setIsProcessingMove(true);
    await processMatchesAndRefill(initialMatches);
  }

  app.stage.off("pointermove", onChipDragMove);
  app.stage.on("pointermove", onChipDragMove);
  app.stage.off("pointerup", onChipDragEnd);
  app.stage.off("pointerupoutside", onChipDragEnd);
  app.stage.on("pointerup", onChipDragEnd);
  app.stage.on("pointerupoutside", onChipDragEnd);
}
