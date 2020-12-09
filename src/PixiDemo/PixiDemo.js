import * as PIXI from 'pixi.js';
import { Renderer } from 'pixi.js';
import React, { useEffect } from 'react';

const PixiDemo = () => {
  useEffect(() => {
    const app = new PIXI.Application();
    document.body.append(app.view);
    app.stage.interactive = true;

    const container = new PIXI.Container();
    app.stage.addChild(container);

    const padding = 100;
    const bounds = new PIXI.Rectangle(
      -padding,
      -padding,
      app.screen.width + padding * 2,
      app.screen.height + padding * 2
    );

    var displacementSprite = PIXI.Sprite.from('/maps/112520/Mouth.png');

    // var displacementFilter = new PIXI.filters.DisplacementFilter(
    //   displacementSprite,
    //   20
    // );
    displacementSprite.anchor.set(0.5);
    displacementSprite.width = 120;
    displacementSprite.height = 100;
    displacementSprite.position.set(415, 480);

    app.stage.addChild(displacementSprite);

    var displacementSpriteEyeL = PIXI.Sprite.from(
      // '/maps/554706_HAESimulation_Eye.png'
      '/maps/112520/Eyelid_Bottom.png'
    );
    var displacementFilterEyeL = new PIXI.filters.DisplacementFilter(
      displacementSpriteEyeL,
      15
    );
    displacementSpriteEyeL.anchor.set(0.5);
    displacementSpriteEyeL.width = 100;
    displacementSpriteEyeL.height = 50;
    displacementSpriteEyeL.angle = 20;

    app.stage.addChild(displacementSpriteEyeL);

    var displacementSpriteJaw = PIXI.Sprite.from(
      // '/maps/554706_HAESimulation_Eye.png'
      '/maps/112520/Jaw_Left.png'
    );
    var displacementFilterJaw = new PIXI.filters.DisplacementFilter(
      displacementSpriteJaw,
      30
    );
    displacementSpriteJaw.anchor.set(0.5);
    displacementSpriteJaw.width = 75;
    displacementSpriteJaw.height = 250;
    displacementSpriteJaw.angle = -10;

    app.stage.addChild(displacementSpriteJaw);

    var displacementSpriteJawRight = PIXI.Sprite.from(
      // '/maps/554706_HAESimulation_Eye.png'
      '/maps/112520/Jaw_Right.png'
    );
    var displacementFilterJawRight = new PIXI.filters.DisplacementFilter(
      displacementSpriteJawRight,
      -30
    );
    displacementSpriteJawRight.anchor.set(0.5);
    displacementSpriteJawRight.width = 75;
    displacementSpriteJawRight.height = 250;
    displacementSpriteJawRight.angle = 0;

    app.stage.addChild(displacementSpriteJawRight);

    // app.stage.addChild(displacementSpriteUpper);

    // displacementFilter.scale.x = 10;
    // displacementFilter.scale.y = 10;

    // const line = new PIXI.Graphics();
    // line.lineStyle(20, 0xff0000, 20);
    // line.moveTo(285, 350);
    // line.lineTo(290, 400);
    // line.lineTo(305, 450);
    // line.lineTo(325, 500);
    // line.lineTo(350, 525);

    // const lineTexture = app.renderer.generateTexture(line);
    // const lineSprite = new PIXI.Sprite(lineTexture);

    // lineSprite.position.set(300, 350);

    // container.addChild(lineSprite);

    // var displacementFilterJaw2 = new PIXI.filters.DisplacementFilter(
    //   lineSprite,
    //   15
    // );

    // var displacementSpriteCustom = PIXI.Sprite.from('/maps/Custom.png');

    // var displacementFilterCustom = new PIXI.filters.DisplacementFilter(
    //   displacementSpriteCustom,
    //   60
    // );
    // displacementSpriteCustom.anchor.set(0.5);
    // displacementSpriteCustom.width = 760;
    // // displacementSpriteCustom.height = 80;
    // displacementSpriteCustom.position.set(430, 465);
    // app.stage.addChild(displacementSpriteCustom);

    container.filters = [
      // displacementFilterCustom,
      // displacementFilter,
      displacementFilterEyeL,
      // displacementFilterUpper,
      displacementFilterJaw,
      displacementFilterJawRight,
      // displacementFilterJaw2,
    ];

    var bg = PIXI.Sprite.from('/face1.jpg');
    bg.width = app.screen.width;
    bg.height = app.screen.height;

    // var map = PIXI.Sprite.from('/maps/554706_HAESimulation_Mouth_YAxis.png');
    // map.width = 150;
    // map.height = 50;

    // map.anchor.set(0.5);

    container.addChild(bg);
    // container.addChild(map);

    app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove);

    function onPointerMove(eventData) {
      console.log(eventData.data.global);
      displacementSpriteJaw.position.set(
        eventData.data.global.x,
        eventData.data.global.y
      );
      // map.position.set(eventData.data.global.x, eventData.data.global.y);
    }
  }, []);

  return null;
};

export default PixiDemo;
