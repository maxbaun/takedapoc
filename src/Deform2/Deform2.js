import { useEffect } from 'react';
import Webcam from 'webcam-easy';

function Deform2() {
  useEffect(() => {
    const vid = document.getElementById('camVideo');
    const canv = document.getElementById('camCanvas');
    const picCanv = document.getElementById('picCanvas');
    const picCanvCC = picCanv.getContext('2d');
    const picCanvOverlay = document.getElementById('picCanvOverlay');
    const picCanvOverlayCC = picCanvOverlay.getContext('2d');

    const canvCC = canv.getContext('2d');
    const webcam = new Webcam(vid, 'user', canv);
    const takePicBtn = document.getElementById('takePicBtn');
    var webgl_overlay = document.getElementById('webgl');

    var afterCanv = document.getElementById('imageAfter');
    var afterCanvCC = afterCanv.getContext('2d');

    var positions;
    var vid_width = vid.offsetWidth;
    var vid_height = vid.offsetHeight;
    var fd = new window.faceDeformer();
    var raf;
    var img;

    var ctrack = new window.clm.tracker({ stopOnConvergence: false });
    ctrack.init(window.pModel);

    webcam.start().then(() => {
      webcam.flip();
      ctrack.start(vid);

      vid.parentElement.style.width = `${vid_width}px`;
      vid.parentElement.style.height = `${vid_height}px`;

      canv.width = vid_width;
      canv.height = vid_height;

      picCanv.width = vid_width;
      picCanv.height = vid_height;

      picCanvOverlay.width = vid_width;
      picCanvOverlay.height = vid_height;

      afterCanv.width = vid_width;
      afterCanv.height = vid_height;

      webgl_overlay.width = vid_width;
      webgl_overlay.height = vid_height;

      takePicBtn.addEventListener('click', () => {
        cancelAnimationFrame(raf);
        ctrack.stop();
        const snap = webcam.snap();

        img = new Image();

        img.onload = () => {
          // vid.style.display = 'none';
          // canv.style.display = 'none';

          picCanvCC.drawImage(img, 0, 0, vid_width, vid_height);

          var ctrack2 = new window.clm.tracker({ stopOnConvergence: false });
          ctrack2.init(window.pModel);

          var drawRequest;
          setTimeout(() => {
            ctrack2.start(picCanv);
            function drawLoop2() {
              drawRequest = requestAnimationFrame(drawLoop2);
              picCanvOverlayCC.clearRect(0, 0, vid_width, vid_height);

              positions = ctrack2.getCurrentPosition();
              if (positions) {
                // draw current grid
                ctrack2.draw(picCanvOverlay);
              }
            }

            drawLoop2();

            document.addEventListener(
              'clmtrackrConverged',
              function (event) {
                console.log('converged', event);
                // stop drawloop

                cancelAnimationFrame(drawRequest);
                ctrack2.stop();

                afterCanvCC.drawImage(img, 0, 0, vid_width, vid_height);

                drawMaskLoop();
              },
              false
            );
          }, 1000);
        };

        img.src = snap;
      });

      function drawLoop() {
        canvCC.clearRect(0, 0, vid_width, vid_height);
        raf = requestAnimationFrame(drawLoop);

        var pn = ctrack.getConvergence();

        if (pn <= 0.4) {
          takePicBtn.removeAttribute('disabled');
        }

        if (ctrack.getCurrentPosition()) {
          ctrack.draw(canv);
        }
      }

      function drawMaskLoop() {
        var pos = ctrack.getCurrentPosition();

        var addPos = [];
        // for (var i = 0; i < 23; i++) {
        //   tempPos = [];
        //   tempPos[0] = (pos[i][0] - pos[62][0]) * 1.3 + pos[62][0];
        //   tempPos[1] = (pos[i][1] - pos[62][1]) * 1.3 + pos[62][1];
        //   addPos.push(tempPos);
        // }
        // merge with pos
        var newPos = pos.concat(addPos);

        // var newVertices = window.pModel.path.vertices.concat(mouth_vertices);
        var newVertices = window.pModel.path.vertices;
        // merge with newVertices
        // newVertices = newVertices.concat(extendVertices);

        fd.load(picCanv, newPos, window.pModel, newVertices);

        var parameters = ctrack.getCurrentParameters();
        for (var i = 6; i < parameters.length; i++) {
          // parameters[i] += ph['component ' + (i - 3)];
        }
        positions = ctrack.calculatePositions(parameters);

        // upper lip

        const dist = Math.sqrt(
          Math.pow(positions[61][0] - positions[45][0], 2) +
            Math.pow(positions[61][1] - positions[45][1], 2)
        );

        positions[44] = [positions[44][0] - dist, positions[44][1]];
        positions[45] = [
          positions[45][0] - dist * 2,
          positions[45][1] - dist / 2,
        ];
        positions[46] = [positions[46][0] - dist, positions[46][1] - dist];
        positions[47] = [positions[47][0], positions[47][1] - dist];
        positions[48] = [positions[48][0] + dist, positions[48][1] - dist];
        positions[49] = [
          positions[49][0] + dist * 2,
          positions[49][1] - dist / 2,
        ];

        positions[61] = [positions[61][0] + dist, positions[61][1] + dist];
        positions[60] = [positions[60][0], positions[60][1] + dist];
        positions[59] = [positions[59][0] + dist, positions[59][1] + dist];

        positions[55] = [positions[55][0] - dist, positions[55][1] + dist];
        positions[54] = [positions[54][0] - dist, positions[54][1] + dist];
        positions[53] = [positions[53][0], positions[53][1] + dist];
        positions[52] = [positions[52][0] + dist, positions[52][1] + dist];
        positions[51] = [positions[51][0] + dist, positions[51][1] + dist];
        positions[50] = [positions[50][0] + dist, positions[50][1]];

        positions[56] = [positions[56][0] + 3, positions[56][1] - 3];
        positions[57] = [positions[57][0], positions[57][1] - 3];
        positions[58] = [positions[58][0] - 3, positions[58][1] - 3];

        // eyes

        // positions[26] = [positions[26][0], positions[26][1] - 3];
        // positions[66] = [positions[66][0] + 3, positions[66][1] - 3];
        // positions[65] = [positions[65][0] - 1, positions[65][1] - 3];
        // positions[25] = [positions[25][0], positions[25][1]];
        // positions[64] = [positions[64][0] - 3, positions[64][1] + 3];
        // positions[24] = [positions[24][0], positions[24][1] + 3];
        // positions[63] = [positions[63][0] + 4, positions[63][1] + 3];

        // positions[30] = [positions[30][0] - 3, positions[30][1]];
        // positions[68] = [positions[68][0] - 3, positions[68][1] - 3];
        // positions[29] = [positions[29][0], positions[29][1] - 3];
        // positions[67] = [positions[67][0] + 3, positions[67][1] - 3];
        // positions[28] = [positions[28][0] + 0, positions[28][1]];
        // positions[70] = [positions[70][0] - 3, positions[70][1] - 3];
        // positions[31] = [positions[31][0], positions[31][1] - 3];
        // positions[69] = [positions[69][0] + 3, positions[69][1] - 3];

        // chin
        positions[2] = [positions[2][0] - 5, positions[2][1] + 1];
        positions[12] = [positions[12][0] + 5, positions[12][1] + 1];

        positions[3] = [positions[3][0] - 5, positions[3][1] - 1];
        positions[11] = [positions[11][0] + 5, positions[11][1] - 1];

        positions[4] = [positions[4][0] - 4, positions[4][1] - 2];
        positions[10] = [positions[10][0] + 4, positions[10][1] - 2];

        positions[5] = [positions[5][0] - 3, positions[5][1] - 3];
        positions[9] = [positions[9][0] + 3, positions[9][1] - 3];

        positions[6] = [positions[6][0] - 2, positions[6][1] - 4];
        positions[8] = [positions[8][0] + 2, positions[8][1] - 4];
        positions[7] = [positions[7][0] + 0, positions[7][1] - 7];

        picCanvCC.clearRect(0, 0, vid_width, vid_height);
        if (positions) {
          // add positions from extended boundary, unmodified
          newPos = positions.concat(addPos);
          // draw mask on top of face

          fd.draw(newPos);
        }
      }

      drawLoop();

      fd.init(webgl_overlay);
    });

    return () => {};
  }, []);

  return (
    <div className="App">
      <div style={{ position: 'relative', height: 500, width: 625 }}>
        <video id="camVideo" />
        <canvas
          id="camCanvas"
          width="625"
          height="500"
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            filter: 'fliph',
            // transform: 'scaleX(-1)',
            zIndex: 1,
          }}
        />
        <canvas
          id="picCanvas"
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            zIndex: 1,
          }}
        />
        <canvas
          id="picCanvOverlay"
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            zIndex: 1,
          }}
        />
      </div>

      <button id="takePicBtn">Take Picture</button>

      <h1>After</h1>
      <div style={{ position: 'relative' }}>
        <canvas id="imageAfter"></canvas>
        {/* <canvas id="overlayAfter"></canvas> */}
        <canvas id="webgl"></canvas>
      </div>
    </div>
  );
}

export default Deform2;
