import * as PIXI from "pixi.js";
import {Spine, SpineTexture, TextureAtlas} from "@esotericsoftware/spine-pixi-v8";
import spinePngAsBase64FromFile from '../../assets/anim/spineboy/spineboy.png';
import spineJsonStringFromFile from '../../assets/anim/spineboy/spineboy.json';
import spineAtlasStringFromFile from '../../assets/anim/spineboy/spineboy.atlas.txt';

import bgData from '../../assets/bg.jpg';
import logoData from '../../assets/icon.png';
import btnData from '../../assets/button.png';
import chipData from '../../assets/chip.png';
import chip2Data from '../../assets/chip2.png';
import chip3Data from '../../assets/chip3.png';
import gameBoardData from '../../assets/spriteSheet.png';

import fw_00000 from '../../assets/anim/fireworks_1/fireworks_00000.png';
import fw_00001 from '../../assets/anim/fireworks_1/fireworks_00001.png';
import fw_00002 from '../../assets/anim/fireworks_1/fireworks_00002.png';
import fw_00003 from '../../assets/anim/fireworks_1/fireworks_00003.png';
import fw_00004 from '../../assets/anim/fireworks_1/fireworks_00004.png';
import fw_00005 from '../../assets/anim/fireworks_1/fireworks_00005.png';
import fw_00006 from '../../assets/anim/fireworks_1/fireworks_00006.png';
import fw_00007 from '../../assets/anim/fireworks_1/fireworks_00007.png';
import fw_00008 from '../../assets/anim/fireworks_1/fireworks_00008.png';
import fw_00009 from '../../assets/anim/fireworks_1/fireworks_00009.png';
import fw_00010 from '../../assets/anim/fireworks_1/fireworks_00010.png';
import fw_00011 from '../../assets/anim/fireworks_1/fireworks_00011.png';
import fw_00012 from '../../assets/anim/fireworks_1/fireworks_00012.png';
import fw_00013 from '../../assets/anim/fireworks_1/fireworks_00013.png';
import fw_00014 from '../../assets/anim/fireworks_1/fireworks_00014.png';
import fw_00015 from '../../assets/anim/fireworks_1/fireworks_00015.png';
import fw_00016 from '../../assets/anim/fireworks_1/fireworks_00016.png';
import fw_00017 from '../../assets/anim/fireworks_1/fireworks_00017.png';
import fw_00018 from '../../assets/anim/fireworks_1/fireworks_00018.png';
import fw_00019 from '../../assets/anim/fireworks_1/fireworks_00019.png';
import fw_00020 from '../../assets/anim/fireworks_1/fireworks_00020.png';
import fw_00021 from '../../assets/anim/fireworks_1/fireworks_00021.png';
import fw_00022 from '../../assets/anim/fireworks_1/fireworks_00022.png';
import fw_00023 from '../../assets/anim/fireworks_1/fireworks_00023.png';
import fw_00024 from '../../assets/anim/fireworks_1/fireworks_00024.png';
import fw_00025 from '../../assets/anim/fireworks_1/fireworks_00025.png';
import fw_00026 from '../../assets/anim/fireworks_1/fireworks_00026.png';
import fw_00027 from '../../assets/anim/fireworks_1/fireworks_00027.png';
import fw_00028 from '../../assets/anim/fireworks_1/fireworks_00028.png';
import fw_00029 from '../../assets/anim/fireworks_1/fireworks_00029.png';

import hand_00000 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00000.png';
import hand_00001 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00001.png';
import hand_00002 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00002.png';
import hand_00003 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00003.png';
import hand_00004 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00004.png';
import hand_00005 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00005.png';
import hand_00006 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00006.png';
import hand_00007 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00007.png';
import hand_00008 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00008.png';
import hand_00009 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00009.png';
import hand_00010 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00010.png';
import hand_00011 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00011.png';
import hand_00012 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00012.png';
import hand_00013 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00013.png';
import hand_00014 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00014.png';
import hand_00015 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00015.png';
import hand_00016 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00016.png';
import hand_00017 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00017.png';
import hand_00018 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00018.png';
import hand_00019 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00019.png';
import hand_00020 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00020.png';
import hand_00021 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00021.png';
import hand_00022 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00022.png';
import hand_00023 from '../../assets/anim/White_Hand_Sequence/WhiteHand_00023.png';

const fireworkFramesData = [fw_00000, fw_00001, fw_00002, fw_00003, fw_00004, fw_00005, fw_00006, fw_00007, fw_00008, fw_00009, fw_00010, fw_00011, fw_00012, fw_00013, fw_00014, fw_00015, fw_00016, fw_00017, fw_00018, fw_00019, fw_00020, fw_00021, fw_00022, fw_00023, fw_00024, fw_00025, fw_00026, fw_00027, fw_00028, fw_00029];
const pointingHandFramesData = [hand_00000, hand_00001, hand_00002, hand_00003, hand_00004, hand_00005, hand_00006, hand_00007, hand_00008, hand_00009, hand_00010, hand_00011, hand_00012, hand_00013, hand_00014, hand_00015, hand_00016, hand_00017, hand_00018, hand_00019, hand_00020, hand_00021, hand_00022, hand_00023];

export let loadedTextures = {};

export async function loadAllAssets() {

  const spineAtlasAlias = "spineboyAtlas";
  const spineSkeletonAlias = "spineboySkeletonJson";
  const spineTextureAlias = "spineboyTexture";

  if (!PIXI.Assets.cache.has(spineAtlasAlias)) {
    try {

      PIXI.Assets.add({
        alias: spineTextureAlias,
        src: `data:image/png;base64,${spinePngAsBase64FromFile}`,
      });

      PIXI.Assets.cache.set(spineSkeletonAlias, spineJsonStringFromFile)

      const textureAtlas = new TextureAtlas(spineAtlasStringFromFile);
      const texturePng = await PIXI.Assets.load(spinePngAsBase64FromFile);
      
      textureAtlas.pages[0].setTexture(SpineTexture.from(texturePng.source));
      PIXI.Assets.cache.set(spineAtlasAlias, textureAtlas);

      Spine.from({skeleton: spineSkeletonAlias, atlas: spineAtlasAlias});

    } catch (error) {
      console.error("Ошибка при обработке Spine atlas/texture из импортированных файлов:", error);
      throw error;
    }
  }

  const assetsToLoad = [
    {alias: "bg", src: bgData},
    {alias: "logoTexture", src: logoData},
    {alias: "btnTexture", src: btnData},
    {alias: "chipTexture", src: chipData},
    {alias: "chip2Texture", src: chip2Data},
    {alias: "chip3Texture", src: chip3Data},
    {alias: "gameBoardTexture", src: gameBoardData},
  ];

  const fireworkAliases = [];

  fireworkFramesData.forEach((frameData, index) => {
    const alias = `fireworkFrame_${index.toString().padStart(5, '0')}`;
    if (frameData === undefined) throw new Error(`Undefined firework frame data at index ${index}`);
    assetsToLoad.push({alias: alias, src: frameData});
    fireworkAliases.push(alias);
  });

  const pointingHandAliases = [];

  pointingHandFramesData.forEach((frameData, index) => {
    const alias = `pointingHandFrame_${index.toString().padStart(5, '0')}`;
    if (frameData === undefined) throw new Error(`Undefined pointing hand frame data at index ${index}`);
    assetsToLoad.push({alias: alias, src: frameData});
    pointingHandAliases.push(alias);
  });

  PIXI.Assets.add(assetsToLoad);

  const nonSpineAliases = assetsToLoad.map(a => a.alias);

  try {
    const loaded = await PIXI.Assets.load(nonSpineAliases);
    loadedTextures = {...loaded};
    loadedTextures.fireworkFrames = fireworkAliases.map(alias => loadedTextures[alias]).filter(Boolean);
    loadedTextures.pointingHandFrames = pointingHandAliases.map(alias => loadedTextures[alias]).filter(Boolean);

  } catch (error) {
    console.error("Ошибка во время PIXI.Assets.load (встраиваемые ассеты):", error);
    throw error;
  }
}
