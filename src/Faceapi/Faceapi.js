// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as faceapi from 'face-api.js';
import React, { useEffect, useState } from 'react';
import WebcamEasy from 'webcam-easy';
import * as PIXI from 'pixi.js';
import createMouthDisplacement from './createMouthDisplacement';
import createChinDisplacement from './createChinDisplacement';
import createLeftEyeDisplacement from './createLeftEyeDisplacement';
import createRightEyeDisplacement from './createRightEyeDisplacement';
import qs from 'query-string';
import createRightEyeDisplacement2 from './createRightEyeDisplacement2';
import createChinDisplacement2 from './createChinDisplacement2';

const Faceapi = () => {
  useEffect(() => {
    let snapCount = 0;
    const camVideo = document.getElementById('webcamVideo');
    const snapCanvas = document.getElementById('snapCanvas');
    const webcam = new WebcamEasy(camVideo, 'user', snapCanvas);

    const snapCountInput = document.getElementById('snapCount');

    snapCountInput.setAttribute('value', snapCount);

    const btnReset = document.getElementById('reset');

    const imageCanvas = document.getElementById('imageCanvas');
    const imageCanvasContext = imageCanvas.getContext('2d');

    const videoWrap = document.getElementById('videoWrap');

    const pixiCanvas = document.getElementById('pixiCanvas');

    imageCanvas.width = camVideo.offsetWidth;
    imageCanvas.height = camVideo.offsetHeight;

    pixiCanvas.width = camVideo.offsetWidth;
    pixiCanvas.height = camVideo.offsetHeight;

    const pixiApp = new PIXI.Application({
      height: imageCanvas.offsetHeight,
      width: imageCanvas.offsetWidth,
      view: pixiCanvas,
      transparent: true,
    });

    const container = new PIXI.Container();

    let detectInterval = null;

    pixiApp.stage.interactive = true;

    const destroyPixiApp = () => {
      while (pixiApp.stage.children[0]) {
        pixiApp.stage.removeChild(pixiApp.stage.children[0]);
      }

      pixiApp.stage.filters = [];

      // pixiApp.stage.destroy(true);
      // pixiApp.stage = null;

      // pixiApp.renderer.destroy(true);
      // pixiApp.renderer = null;
    };

    const reset = () => {
      // clearInterval(detectInterval);
      destroyPixiApp();

      imageCanvasContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
      snapCanvas
        .getContext('2d')
        .clearRect(0, 0, snapCanvas.width, snapCanvas.height);

      if (snapCount + 1 <= 3) {
        snapCount += 1;
        snapCountInput.setAttribute('value', snapCount);
      } else {
        snapCount = 0;
        snapCountInput.setAttribute('value', 0);
      }
    };

    btnReset.addEventListener('click', () => {
      reset();
    });

    webcam
      .start()
      .catch(() => {
        alert('Failed to load webcam, please refresh the page.');
      })
      .then(async (res) => {
        const { image: imagePath } = qs.parse(window.location.search);

        // const detection = await faceapi.detectSingleFace(camVideo);
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');

        // Live facial feature detecting
        const videoCanvas = faceapi.createCanvasFromMedia(camVideo);
        videoCanvas.style.position = 'absolute';
        videoCanvas.style.left = 0;
        videoCanvas.style.top = 0;
        videoCanvas.style.width = '100%';
        videoCanvas.style.height = '100%';
        videoCanvas.style.zIndex = 1;
        videoCanvas.style.transform = 'scale(-1, 1)';

        const displaySizeVideo = {
          height: camVideo.offsetWidth,
          width: camVideo.offsetHeight,
        };

        faceapi.matchDimensions(videoCanvas, displaySizeVideo);

        videoWrap.appendChild(videoCanvas);

        const helperCanvas = document.getElementById('helperCanvas');
        const rectGraphics = new PIXI.Graphics();

        rectGraphics.lineStyle(5, 0xff0000);

        const rect = {
          x: camVideo.offsetWidth / 4,
          y: camVideo.offsetHeight / 18,
          width: (camVideo.offsetWidth / 4) * 2,
          height: (camVideo.offsetWidth / 8) * 5,
        };

        rectGraphics.drawRect(rect.x, rect.y, rect.width, rect.height);

        const pixiRect = new PIXI.Application({
          height: camVideo.offsetHeight,
          width: camVideo.offsetWidth,
          view: helperCanvas,
          transparent: true,
        });

        pixiRect.stage.addChild(rectGraphics);

        detectInterval = setInterval(async () => {
          const detectionVideo = await faceapi
            .detectSingleFace(camVideo)
            .withFaceLandmarks();

          if (!detectionVideo) {
            return;
          }

          videoCanvas
            .getContext('2d')
            .clearRect(0, 0, videoCanvas.width, videoCanvas.height);

          const resizedDetectionsVideo = faceapi.resizeResults(
            detectionVideo,
            displaySizeVideo
          );

          faceapi.draw.drawFaceLandmarks(videoCanvas, resizedDetectionsVideo);
        }, 100);

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
              .add('eyer3', '/maps/new/eyer3.png')
              .add('eyer4', '/maps/new/eyer4.png')
              .add('eyer5', '/maps/new/eyer5.png')
              .add('eyer6', '/maps/new/eyer6.png')
              .add('mouth', '/maps/new/mouth.png')
              .add('mouthl', '/maps/new/mouthl.png')
              .add('mouthr', '/maps/new/mouthr.png')
              .add('mouth3', '/maps/new/mouth3.png')
              .add('mouth4', '/maps/new/mouth4.png')
              .add('mouth5', '/maps/new/mouth5.png')
              .add('chinfull', '/maps/new/chinfull.png')
              .add('chinfull2', '/maps/new/chinfull2.png')
              .add('chinfull3', '/maps/new/chinfull3.png')
              .add('chinfull4', '/maps/new/chinfull4.png');

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
              filterFull: chinFilterFull2,
              spriteFull: chinSpriteFull2,
            } = createChinDisplacement2(
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

            const {
              filter: rightEyeFilter2,
              sprite: rightEyeSprite2,
            } = createRightEyeDisplacement2(
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

            const sc = parseInt(
              document.getElementById('snapCount').getAttribute('value'),
              10
            );

            const shouldShowEyes = sc === 0 || sc === 1;
            const shouldShowMouth = sc === 0 || sc === 2;
            const shouldShowChin = sc === 0 || sc === 3;

            if (shouldShowEyes) {
              pixiApp.stage.addChild(leftEyeSprite, rightEyeSprite2);
            }

            if (shouldShowMouth) {
              pixiApp.stage.addChild(mouthSpriteFull);
            }

            if (shouldShowChin) {
              pixiApp.stage.addChild(chinSpriteFull2);
            }

            // pixiApp.stage.addChild(
            //   leftEyeSprite,
            //   rightEyeSprite2,
            //   chinSpriteFull2,
            //   mouthSpriteFull
            // );

            // const displaceFilter = new PIXI.filters.DisplacementFilter(
            //   sprite,
            //   30
            // );
            // displaceFilter.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

            // pixiApp.stage.filters = [displaceFilter];
            pixiApp.stage.filters = [
              shouldShowEyes ? leftEyeFilter : null,
              shouldShowEyes ? rightEyeFilter2 : null,
              shouldShowChin ? chinFilterFull2 : null,
              shouldShowMouth ? mouthFilterFull : null,
            ].filter((f) => f);

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

            // pixiApp.stage
            //   .on('mousemove', onPointerMove)
            //   .on('touchmove', onPointerMove);

            function onPointerMove(eventData) {
              console.log(eventData.data.global.x, eventData.data.global.y);
              // chinSpriteFull2.position.set(
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
    <>
      <div>
        <div
          id="videoWrap"
          style={{ display: 'inline-block', position: 'relative' }}
        >
          <video id="webcamVideo"></video>
          <canvas
            id="helperCanvas"
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              zIndex: 1,
              left: 0,
              top: 0,
            }}
          ></canvas>
        </div>

        <button disabled id="take">
          Take
        </button>
        <button id="reset">Reset</button>
        <canvas id="snapCanvas"></canvas>
        <canvas id="imageCanvas"></canvas>
        <canvas id="pixiCanvas"></canvas>
      </div>
      <input id="snapCount" type="hidden" />
    </>
  );
};

export default Faceapi;
