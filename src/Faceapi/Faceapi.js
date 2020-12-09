// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as faceapi from 'face-api.js';
import React, { useEffect } from 'react';
import WebcamEasy from 'webcam-easy';
import * as PIXI from 'pixi.js';
import createMouthDisplacement from './createMouthDisplacement';
import createChinDisplacement from './createChinDisplacement';
import createLeftEyeDisplacement from './createLeftEyeDisplacement';
import createRightEyeDisplacement from './createRightEyeDisplacement';
import qs from 'query-string';

const Faceapi = () => {
  useEffect(() => {
    const camVideo = document.getElementById('webcamVideo');
    const snapCanvas = document.getElementById('snapCanvas');
    const webcam = new WebcamEasy(camVideo, 'user', snapCanvas);

    const imageCanvas = document.getElementById('imageCanvas');
    const imageCanvasContext = imageCanvas.getContext('2d');

    const pixiCanvas = document.getElementById('pixiCanvas');

    imageCanvas.width = camVideo.offsetWidth;
    imageCanvas.height = camVideo.offsetHeight;

    pixiCanvas.width = camVideo.offsetWidth;
    pixiCanvas.height = camVideo.offsetHeight;

    webcam
      .start()
      .then(async (res) => {
        const { image: imagePath } = qs.parse(window.location.search);

        console.log(imagePath);

        // const detection = await faceapi.detectSingleFace(camVideo);
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');

        const takeBtn = document.getElementById('take');
        takeBtn.disabled = false;
        takeBtn.addEventListener('click', () => {
          const snap = webcam.snap();

          const image = new window.Image();

          image.onload = async () => {
            if (imagePath) {
              imageCanvas.width = image.width;
              imageCanvas.height = image.height;

              pixiCanvas.width = image.width;
              pixiCanvas.height = image.height;
              imageCanvasContext.drawImage(
                image,
                0,
                0,
                image.width,
                image.height
              );
            } else {
              imageCanvasContext.drawImage(image, 0, 0, 640, 480);
            }

            const detection = await faceapi
              .detectSingleFace(imageCanvas)
              .withFaceLandmarks();

            const displaySize = {
              height: imageCanvas.height,
              width: imageCanvas.width,
            };
            const resizedDetections = faceapi.resizeResults(
              detection,
              displaySize
            );

            faceapi.draw.drawFaceLandmarks(imageCanvas, resizedDetections);

            const pixiApp = new PIXI.Application({
              height: imageCanvas.offsetHeight,
              width: imageCanvas.offsetWidth,
              view: pixiCanvas,
            });

            const container = new PIXI.Container();

            pixiApp.stage.interactive = true;

            var bg = PIXI.Sprite.from(image);
            bg.width = pixiApp.view.width;
            bg.height = pixiApp.view.height;
            bg.position.set(0, 0);
            pixiApp.stage.addChild(bg);

            const resizedDetections2 = faceapi.resizeResults(
              detection,
              displaySize
            );

            // START MOUTH
            const mouthOutline = resizedDetections2.landmarks.getMouth();
            const leftEyeOutliine = resizedDetections2.landmarks.getLeftEye();
            const jawOutline = resizedDetections2.landmarks.getJawOutline();
            const rightEyeOutliine = resizedDetections2.landmarks.getRightEye();

            const loader = new PIXI.Loader();
            loader
              .add('eyer', '/maps/old/EyeR_extracted2.png')
              .add('eyel', '/maps/old/EyeL_extracted2.png')
              .add('jaw', '/maps/new/jawl3.png')
              .add('jawr', '/maps/new/jawr2.png')
              .add('eyel2', '/maps/new/eyel2.png')
              .add('eyer2', '/maps/new/eyer2.png')
              .add('mouth', '/maps/new/mouth.png')
              .add('mouthl', '/maps/new/mouthl.png')
              .add('mouthr', '/maps/new/mouthr.png')
              .add('mouth3', '/maps/new/mouth3.png')
              .add('mouth4', '/maps/new/mouth4.png')
              .add('mouth5', '/maps/new/mouth5.png')
              .add('chinfull', '/maps/new/chinfull.png')
              .add('chinfull2', '/maps/new/chinfull2.png')
              .add('chinfull3', '/maps/new/chinfull3.png');

            const { resources } = await new Promise((resolve) => {
              loader.load((l, r) => {
                resolve({ resources: r });
              });
            });

            const {
              filter: mouthFilter,
              sprite: mouthSprite,
              filterRight: mouthFilterR,
              spriteRight: mouthSpriteR,
              filterFull: mouthFilterFull,
              spriteFull: mouthSpriteFull,
            } = createMouthDisplacement(resources, mouthOutline);

            const {
              filter: chinFilter,
              filterR: chinFilterR,
              sprite: chinSprite,
              spriteR: chinSpriteR,
              filterFull: chinFilterFull,
              spriteFull: chinSpriteFull,
            } = createChinDisplacement(
              resources,
              jawOutline,
              rightEyeOutliine,
              leftEyeOutliine,
              mouthOutline
            );

            const {
              filter: leftEyeFilter,
              sprite: leftEyeSprite,
            } = createLeftEyeDisplacement(
              resources,
              leftEyeOutliine,
              jawOutline
            );

            const {
              filter: rightEyeFilter,
              sprite: rightEyeSprite,
            } = createRightEyeDisplacement(
              resources,
              rightEyeOutliine,
              jawOutline
            );

            // renderer.stage.addChild(mouthSprite);
            // renderer.stage.addChild(chinSprite);

            const brt = new PIXI.BaseRenderTexture({
              width: pixiApp.view.width,
              height: pixiApp.view.height,
              resolution: 1,
              scaleMode: PIXI.SCALE_MODES.LINEAR,
            });

            const rt = new PIXI.RenderTexture(brt);

            const sprite = new PIXI.Sprite(rt);

            const blur = new PIXI.filters.BlurFilter(8, 2);
            blur.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
            sprite.filters = [blur];

            pixiApp.stage.addChild(sprite);

            // container.addChild(
            //   // leftEyeSprite,
            //   // rightEyeSprite,
            //   // chinSprite,
            //   // chinSpriteR,
            //   leftEyeSprite,
            //   rightEyeSprite
            //   // mouthSprite,
            //   // chinSprite
            // );

            pixiApp.stage.addChild(
              leftEyeSprite,
              rightEyeSprite,
              // chinSprite,
              // chinSpriteR,
              chinSpriteFull,
              mouthSpriteFull
              // mouthSprite,
              // mouthSpriteR,
            );

            // const displaceFilter = new PIXI.filters.DisplacementFilter(
            //   sprite,
            //   30
            // );
            // displaceFilter.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

            // pixiApp.stage.filters = [displaceFilter];
            pixiApp.stage.filters = [
              leftEyeFilter,
              rightEyeFilter,
              // chinFilter,
              // chinFilterR,
              chinFilterFull,
              mouthFilterFull,
              // mouthFilter,
              // mouthFilterR,
            ];

            // pixiApp.stage.filterArea = pixiApp.screen;

            // pixiApp.renderer.render(container, rt);

            // const overlayContainer = new PIXI.Container();
            // overlayContainer
            //   .addChild
            //   // leftEyeSprite,
            //   // rightEyeSprite,
            //   // mouthSprite,
            //   // leftEyeSprite,
            //   // rightEyeSprite,
            //   // chinSprite,
            //   // chinSpriteR
            //   ();

            // var alphaFilter = new PIXI.filters.AlphaFilter(0.5);
            // overlayContainer.filters = [alphaFilter];

            // pixiApp.stage.addChild(overlayContainer);

            // pixiApp.stage.addChild(combinedSprite);

            // renderer.stage.addChild(leftEyeSprite);
            // renderer.stage.addChild(rightEyeSprite);

            // const chinLine = new PIXI.Graphics();
            // chinLine.lineStyle(2, 0xff0000);
            // chinLine.arc(0, 0, 100, 0, Math.PI);
            // chinLine.position.set(100, 100);

            // pixiApp.stage.addChild(chinLine);

            pixiApp.stage
              .on('mousemove', onPointerMove)
              .on('touchmove', onPointerMove);

            function onPointerMove(eventData) {
              console.log(eventData.data.global.x, eventData.data.global.y);
              // chinSpriteFull.position.set(
              //   eventData.data.global.x,
              //   eventData.data.global.y
              // );
              //   eventData.data.global.x,
              //   eventData.data.global.y
              // );
              // sprite.position.set(
              //   eventData.data.global.x,
              //   eventData.data.global.y
              // );
              // overlayContainer.position.set(
              //   eventData.data.global.x,
              //   eventData.data.global.y
              // );
              // map.position.set(eventData.data.global.x, eventData.data.global.y);
            }
          };

          image.src = imagePath && imagePath !== '' ? imagePath : snap;
        });
      })
      .catch((err) => alert('error loading camera' + err));
  }, []);

  return (
    <div>
      <video id="webcamVideo"></video>

      <button disabled id="take">
        Take
      </button>
      <canvas id="snapCanvas"></canvas>
      <canvas id="imageCanvas"></canvas>
      <canvas id="pixiCanvas"></canvas>
    </div>
  );
};

export default Faceapi;
