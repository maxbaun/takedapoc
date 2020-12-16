import * as PIXI from 'pixi.js';
import { getEyeCenter, getMouthCenter } from './helpers';

/*
0                                16
 1                             15
  2                          14         
   3                       13  
    4                    12
      5                11    
        6           10
          7       9
              8       
                  

              
*/

const createChinDisplacement2 = (
  resources,
  jawline,
  rightEye,
  leftEye,
  mouth
) => {
  const bottomChin = jawline[8];

  const sprite = PIXI.Sprite.from(resources['jaw'].texture);
  // const blur = new PIXI.filters.BlurFilter(8);
  // blur.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

  const filter = new PIXI.filters.DisplacementFilter(sprite, 80);

  // sprite.filters = [blur];
  // filter.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

  sprite.anchor.set(1, 1);
  sprite.position.set(jawline[12].x, bottomChin.y + 50);

  sprite.width = (jawline[8].x - jawline[1].x) * 2;
  sprite.height = (jawline[8].x - jawline[1].x) * 2;
  // sprite.height = (mouthCenter.y - leftEyeCenter.y) * 3.5;

  const spriteR = PIXI.Sprite.from(resources['jawr'].texture);
  const filterR = new PIXI.filters.DisplacementFilter(spriteR, 80);

  const blurRight = new PIXI.filters.BlurFilter(8);
  blurRight.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

  spriteR.filters = [blurRight];

  spriteR.anchor.set(0, 1);
  spriteR.position.set(jawline[5].x, jawline[8].y + 50);
  spriteR.width = (jawline[15].x - jawline[8].x) * 2;
  spriteR.height = (jawline[15].x - jawline[8].x) * 2;

  // const spriteFull = PIXI.Sprite.from(resources['chinfull'].texture);
  const spriteFull = PIXI.Sprite.from(resources['chinfull4'].texture);
  const filterFull = new PIXI.filters.DisplacementFilter(spriteFull, 80);

  const blurFull = new PIXI.filters.BlurFilter(8);
  blurFull.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

  spriteFull.filters = [blurFull];

  spriteFull.anchor.set(0.5, 1);
  spriteFull.position.set(jawline[8].x, jawline[8].y + 75);
  spriteFull.width = (jawline[15].x - jawline[1].x) * 1.5;
  spriteFull.height = (jawline[15].x - jawline[1].x) * 1.5;

  return { filter, filterR, filterFull, sprite, spriteR, spriteFull };
};

export default createChinDisplacement2;
