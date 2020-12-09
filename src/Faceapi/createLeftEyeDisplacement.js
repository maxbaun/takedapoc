import * as PIXI from 'pixi.js';
import { getEyeCenter } from './helpers';

const createLeftEyeDisplacement = (resources, leftEye, jawOutline) => {
  // const sprite = PIXI.Sprite.from('/maps/old/EyeL_extracted2.png');
  const sprite = new PIXI.Sprite(resources['eyel2'].texture);

  // const blur = new PIXI.filters.BlurFilter(8);

  const filter = new PIXI.filters.DisplacementFilter(sprite, 40);

  // filter.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
  // blur.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

  const jawLeftTop = jawOutline[0];
  const leftEyeRight = leftEye[4];
  const eyeToJawWidth = leftEyeRight.x - jawLeftTop.x;

  const eyeToJawCenter = leftEyeRight.x - eyeToJawWidth / 2;

  const position = { x: leftEye[4].x, y: leftEye[5].y + 10 };

  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(position.x, position.y);

  sprite.width = (leftEye[3].x - leftEye[0].x) * 2; //(rightMouth.x - leftMouth.x) * 2;
  sprite.height = (leftEye[3].x - leftEye[0].x) * 2;

  // sprite.filters = [blur];

  return { filter, sprite };
};

export default createLeftEyeDisplacement;
