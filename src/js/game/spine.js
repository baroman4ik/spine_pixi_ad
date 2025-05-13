import {Assets} from "pixi.js";
import {Spine} from "@esotericsoftware/spine-pixi-v8";
import {worldContainer} from "../core/app";
import {DESIGN_HEIGHT, DESIGN_WIDTH} from "../utils/constants";

export async function loadAndCreateSpine() {
  const atlasAlias = "spineboyAtlas";
  const skeletonAlias = "spineboySkeletonJson";

  const atlasData = Assets.cache.get(atlasAlias);
  const skeletonData = Assets.cache.get(skeletonAlias); 

  let spineboy = null;

  if (!Assets.cache.has(atlasAlias) || !Assets.cache.has(skeletonAlias)) {
    console.error(`ОШИБКА SPINE: Spine-ассеты '${atlasAlias}' или '${skeletonAlias}' не найдены в кэше. Убедитесь, что они загружены через assetLoader.js.`);
    return null;
  }

  if (!worldContainer) {
    console.error("ОШИБКА SPINE: worldContainer недоступен для добавления Spine!");
    return null;
  }

  if (!atlasData || !skeletonData) {
    console.error(`ОШИБКА SPINE: Spine-ассеты не найдены в кэше ПОСЛЕ загрузки! Атлас: ${atlasAlias}, Скелет: ${skeletonAlias}`);
    return null;
  } 

  try {
    spineboy = Spine.from({
      atlas: atlasAlias,
      skeleton: skeletonAlias, 
      scale: 0.5,
    });
    if (!spineboy || !spineboy.skeleton) { // Проверка результата
      console.error("Spine.from не вернул валидный объект со скелетом. Результат:", spineboy);
      throw new Error("Spine.from result invalid.");
    }
  } catch (error) {
    console.error("ОШИБКА SPINE: Не удалось создать экземпляр Spine:", error);
    return null;
  }

  spineboy.state.data.defaultMix = 0.2;
  spineboy.x = DESIGN_WIDTH / 2;
  spineboy.y = DESIGN_HEIGHT * 0.7;
  spineboy.state.setAnimation(0, "run", true);

  worldContainer.addChild(spineboy);

  return spineboy; 
}