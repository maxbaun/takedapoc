// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import { Image } from 'canvas';
import * as faceapi from 'face-api.js';
import React, { useEffect } from 'react';
import WebcamEasy from 'webcam-easy';
import * as PIXI from 'pixi.js';

const Faceapi2 = () => {
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
        // const detection = await faceapi.detectSingleFace(camVideo);
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');
        setTimeout(() => {
          // console.log(detection);
          const snap = webcam.snap();

          const image = new window.Image();

          image.onload = async () => {
            imageCanvasContext.drawImage(image, 0, 0, 640, 480);

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

            const renderer = new PIXI.Application({
              height: imageCanvas.offsetHeight,
              width: imageCanvas.offsetWidth,
              view: pixiCanvas,
            });
            renderer.stage.interactive = true;

            const container = new PIXI.Container();
            renderer.stage.addChild(container);

            var bg = PIXI.Sprite.from(image);
            bg.width = renderer.view.width;
            bg.height = renderer.view.height;
            bg.position.set(0, 0);

            container.addChild(bg);

            const detection2 = await faceapi
              .detectSingleFace(pixiCanvas)
              .withFaceLandmarks();

            const displaySize2 = {
              height: pixiCanvas.height,
              width: pixiCanvas.width,
            };
            const resizedDetections2 = faceapi.resizeResults(
              detection,
              displaySize
            );

            // START MOUTH
            const mouthOutline = resizedDetections2.landmarks.getMouth();

            const leftMouth = mouthOutline[0];
            const rightMouth = mouthOutline[6];
            const topMouth = mouthOutline[3];
            const bottomMouth = mouthOutline[9];
            const centerMouth = mouthOutline[12];

            const centerMouthY = bottomMouth.y - topMouth.y;

            const displacementSprite = PIXI.Sprite.from(
              '/displacement_map_repeat.jpg'
            );

            // displacementSprite.texture.baseTexture.wrapMode =
            //   PIXI.WRAP_MODES.REPEAT;
            const displacementFilter = new PIXI.filters.DisplacementFilter(
              displacementSprite
            );
            displacementFilter.padding = 10;

            displacementSprite.position.set(0);

            renderer.stage.addChild(displacementSprite);

            container.filters = [displacementFilter];

            displacementFilter.scale.x = 30;
            displacementFilter.scale.y = 300;

            // renderer.stage
            //   .on('mousemove', onPointerMove)
            //   .on('touchmove', onPointerMove);

            function onPointerMove(eventData) {
              console.log(eventData.data.global.x, eventData.data.global.y);
              displacementSprite.position.set(
                eventData.data.global.x,
                eventData.data.global.y
              );
              // map.position.set(eventData.data.global.x, eventData.data.global.y);
            }
          };

          image.src = snap;
        }, 2000);
      })
      .catch((err) => alert('error loading camera' + err));
  }, []);

  return (
    <div>
      <video id="webcamVideo"></video>
      <canvas id="snapCanvas"></canvas>
      <canvas id="imageCanvas"></canvas>
      <canvas id="pixiCanvas"></canvas>
    </div>
  );
};

export default Faceapi2;
