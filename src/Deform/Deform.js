import { useEffect } from 'react';

function Deform() {
  useEffect(() => {
    const img = new Image();
    // img.src = '/face2.jpg';
    // img.src = '/face1.jpg';
    img.src = '/faceme.png';
    // img.src = '/face0.jpg';
    // img.src = '/face3.jpg';
    img.onload = () => {
      var imageCC = document.getElementById('image');
      var cc = document.getElementById('image').getContext('2d');
      var ccAfter = document.getElementById('imageAfter').getContext('2d');
      var overlay = document.getElementById('overlay');
      var overlayCC = overlay.getContext('2d');
      var webgl_overlay = document.getElementById('webgl');

      var vid_width = imageCC.offsetWidth;
      var vid_height = imageCC.offsetHeight;

      var drawRequest;
      var positions;

      cc.drawImage(img, 0, 0, 625, 500);
      ccAfter.drawImage(img, 0, 0, 625, 500);

      var ctrack = new window.clm.tracker({ stopOnConvergence: true });
      ctrack.init(window.pModel);

      setTimeout(() => {
        ctrack.start(document.getElementById('image'));
        drawLoop();

        function drawLoop() {
          // eslint-disable-next-line
          drawRequest = requestAnimationFrame(drawLoop);
          overlayCC.clearRect(0, 0, 720, 576);
          if (ctrack.getCurrentPosition()) {
            ctrack.draw(overlay);
          }
        }

        var fd = new window.faceDeformer();

        // eslint-disable-next-line
        var mouth_vertices = [
          [44, 45, 61, 44],
          [45, 46, 61, 45],
          [46, 60, 61, 46],
          [46, 47, 60, 46],
          [47, 48, 60, 47],
          [48, 59, 60, 48],
          [48, 49, 59, 48],
          [49, 50, 59, 49],
          [50, 51, 58, 50],
          [51, 52, 58, 51],
          [52, 57, 58, 52],
          [52, 53, 57, 52],
          [53, 54, 57, 53],
          [54, 56, 57, 54],
          [54, 55, 56, 54],
          [55, 44, 56, 55],
          [44, 61, 56, 44],
          [61, 60, 56, 61],
          [56, 57, 60, 56],
          [57, 59, 60, 57],
          [57, 58, 59, 57],
          [50, 58, 59, 50],
        ];

        // eslint-disable-next-line
        var extendVertices = [
          [0, 71, 72, 0],
          [0, 72, 1, 0],
          [1, 72, 73, 1],
          [1, 73, 2, 1],
          [2, 73, 74, 2],
          [2, 74, 3, 2],
          [3, 74, 75, 3],
          [3, 75, 4, 3],
          [4, 75, 76, 4],
          [4, 76, 5, 4],
          [5, 76, 77, 5],
          [5, 77, 6, 5],
          [6, 77, 78, 6],
          [6, 78, 7, 6],
          [7, 78, 79, 7],
          [7, 79, 8, 7],
          [8, 79, 80, 8],
          [8, 80, 9, 8],
          [9, 80, 81, 9],
          [9, 81, 10, 9],
          [10, 81, 82, 10],
          [10, 82, 11, 10],
          [11, 82, 83, 11],
          [11, 83, 12, 11],
          [12, 83, 84, 12],
          [12, 84, 13, 12],
          [13, 84, 85, 13],
          [13, 85, 14, 13],
          [14, 85, 86, 14],
          [14, 86, 15, 14],
          [15, 86, 87, 15],
          [15, 87, 16, 15],
          [16, 87, 88, 16],
          [16, 88, 17, 16],
          [17, 88, 89, 17],
          [17, 89, 18, 17],
          [18, 89, 93, 18],
          [18, 93, 22, 18],
          [22, 93, 21, 22],
          [93, 92, 21, 93],
          [21, 92, 20, 21],
          [92, 91, 20, 92],
          [20, 91, 19, 20],
          [91, 90, 19, 91],
          [19, 90, 71, 19],
          [19, 71, 0, 19],
        ];

        function drawMaskLoop() {
          var pos = ctrack.getCurrentPosition();

          // eslint-disable-next-line
          var tempPos;
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

          fd.load(imageCC, newPos, window.pModel, newVertices);

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

          positions[26] = [positions[26][0], positions[26][1] - 3];
          positions[66] = [positions[66][0] + 3, positions[66][1] - 3];
          positions[65] = [positions[65][0] - 3, positions[65][1] - 3];
          positions[25] = [positions[25][0] + 3, positions[25][1]];
          // positions[64] = [positions[64][0] - 3, positions[64][1] + 3];
          // positions[24] = [positions[24][0], positions[24][1] + 3];
          // positions[63] = [positions[63][0] + 3, positions[63][1] + 3];

          // positions[30] = [positions[30][0] - 3, positions[30][1]];
          // positions[68] = [positions[68][0] - 3, positions[68][1] - 3];
          // positions[29] = [positions[29][0], positions[29][1] - 3];
          // positions[67] = [positions[67][0] + 3, positions[67][1] - 3];
          positions[28] = [positions[28][0] + 0, positions[28][1]];
          positions[70] = [positions[70][0] - 3, positions[70][1] - 3];
          positions[31] = [positions[31][0], positions[31][1] - 3];
          positions[69] = [positions[69][0] + 3, positions[69][1] - 3];

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
          // positions[3] = [positions[3][0] - 20, positions[3][1] + 5];
          // positions[4] = [positions[4][0] - 20, positions[4][1] + 20];
          // positions[5] = [positions[5][0] - 20, positions[5][1] + 20];
          // positions[6] = [positions[6][0] - 20, positions[6][1] + 20];
          // positions[7] = [positions[7][0] - 20, positions[7][1] + 20];
          // positions[8] = [positions[8][0] + 20, positions[8][1] + 20];
          // positions[9] = [positions[9][0] + 20, positions[9][1] + 20];
          // positions[10] = [positions[10][0] + 20, positions[10][1] + 20];
          // positions[11] = [positions[11][0] + 20, positions[11][1] + 5];
          // positions[12] = [positions[12][0] + 10, positions[12][1] + 3];

          overlayCC.clearRect(0, 0, vid_width, vid_height);
          if (positions) {
            // add positions from extended boundary, unmodified
            newPos = positions.concat(addPos);
            // draw mask on top of face

            fd.draw(newPos);
          }
        }

        function drawGridLoop() {
          positions = ctrack.getCurrentPosition();

          overlayCC.clearRect(0, 0, vid_width, vid_height);
          if (positions) {
            // draw current grid
            ctrack.draw(overlay);
          }
          // check whether mask has converged
          var pn = ctrack.getConvergence();
          if (pn < 0.4) {
            drawMaskLoop();
          } else {
            requestAnimationFrame(drawGridLoop);
          }
        }

        var pnums = window.pModel.shapeModel.eigenValues.length - 2;
        var parameterHolder = function () {
          for (var i = 0; i < pnums; i++) {
            this['component ' + (i + 3)] = 0;
          }
          this.presets = 0;
        };

        var ph = new parameterHolder();

        var presets = {
          unwell: [0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          inca: [0, 0, -9, 0, -11, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0],
          cheery: [0, 0, -9, 9, -11, 0, 0, 0, 0, 0, 0, 0, -9, 0, 0, 0, 0, 0],
          dopey: [0, 0, 0, 0, 0, 0, 0, -11, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0],
          longface: [0, 0, 0, 0, -15, 0, 0, -12, 0, 0, 0, 0, 0, 0, -7, 0, 0, 5],
          lucky: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, -6, 12, 0, 0],
          overcute: [0, 0, 0, 0, 16, 0, -14, 0, 0, 0, 0, 0, -7, 0, 0, 0, 0, 0],
          aloof: [0, 0, 0, 0, 0, 0, 0, -8, 0, 0, 0, 0, 0, 0, -2, 0, 0, 10],
          evil: [0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, -8],
          artificial: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, -16, 0, 0, 0, 0, 0],
          none: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };

        for (var i = 0; i < pnums; i++) {
          ph['component ' + (i + 3)] = presets['inca'][i];
        }

        fd.init(webgl_overlay);

        drawGridLoop();
      }, 1000);
    };
  }, []);

  return (
    <div className="App">
      <div id="container">
        <canvas id="image" width="625" height="500"></canvas>
        <canvas id="overlay" width="625" height="500"></canvas>
        {/* <canvas id="webgl" width="625" height="500"></canvas> */}
      </div>

      <h1>After</h1>
      <div style={{ position: 'relative' }}>
        <canvas id="imageAfter" width="625" height="500"></canvas>
        {/* <canvas id="overlayAfter" width="625" height="500"></canvas> */}
        <canvas id="webgl" width="625" height="500"></canvas>
      </div>
    </div>
  );
}

export default Deform;
