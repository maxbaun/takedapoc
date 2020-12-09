import * as PIXI from 'pixi.js';

/*
          2   3   4
      1               5
          13  14  15
  0   12             16   6
          19  18  17
      11              7
          10  9   8
              
*/

const createMouthDisplacement = (resources, mouthPoints) => {
  const sprite = new PIXI.Sprite(resources['mouthl'].texture);

  const filter = new PIXI.filters.DisplacementFilter(sprite, 60);

  filter.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

  sprite.anchor.set(0.5);
  sprite.position.set(mouthPoints[0].x, mouthPoints[10].y + 10);

  sprite.width = mouthPoints[6].x - mouthPoints[0].x; //(rightMouth.x - leftMouth.x) * 2;
  sprite.height = mouthPoints[6].x - mouthPoints[0].x;

  const spriteRight = new PIXI.Sprite(resources['mouthr'].texture);

  const filterRight = new PIXI.filters.DisplacementFilter(spriteRight, 60);

  filterRight.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

  filterRight.scale.set(60, 60);

  spriteRight.anchor.set(0.5);
  spriteRight.position.set(mouthPoints[8].x, mouthPoints[8].y + 10);

  spriteRight.width = mouthPoints[6].x - mouthPoints[0].x; //(rightMouth.x - leftMouth.x) * 2;
  spriteRight.height = mouthPoints[6].x - mouthPoints[0].x;

  const spriteFull = new PIXI.Sprite(resources['mouth5'].texture);
  const filterFull = new PIXI.filters.DisplacementFilter(spriteFull, 60);

  // filterFull.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

  spriteFull.anchor.set(0.5, 0.5);
  spriteFull.position.set(mouthPoints[9].x, mouthPoints[9].y + 5);

  spriteFull.width = (mouthPoints[6].x - mouthPoints[0].x) * 2;
  spriteFull.height = mouthPoints[6].x - mouthPoints[0].x;

  return { filter, filterRight, filterFull, sprite, spriteRight, spriteFull };
};

export default createMouthDisplacement;
