import { useEffect } from 'react';

import masks from './masks';

var images = [
  // { id: 'average', path: './media/average2_crop.jpg' },
  { id: 'average', path: './hae3.jpg' },
  { id: 'terminator', path: './media/terminator_crop.jpg' },
  { id: 'walter2', path: './media/walter2_crop.jpg' },
  { id: 'clooney2', path: './media/fragrance-George-Clooney-main_crop.jpg' },
  { id: 'bieber', path: './media/Justin-Bieber2_crop.jpg' },
  { id: 'kim', path: './media/kim1_crop.jpg' },
  { id: 'rihanna', path: './media/ri_1_crop.jpg' },
  { id: 'audrey', path: './media/audrey_crop.jpg' },
  { id: 'bill', path: './media/bill-murray-snl_crop.jpg' },
  { id: 'connery2', path: './media/sean_guru2_crop.jpg' },
  { id: 'cage3', path: './media/cage2_crop.jpg' },
  { id: 'queen', path: './media/queen20_crop.jpg' },
  { id: 'obama4', path: './media/obama4_crop.jpg' },
  { id: 'chuck', path: './media/chuck_crop.jpg' },
  { id: 'monalisa', path: './media/joconde_crop.jpg' },
  { id: 'picasso1', path: './media/picasso_drawing_crop.jpg' },
  { id: 'scream', path: './media/scream_crop.jpg' },
];

const testMask = [
  [-0.31403753884704955, 141.34709835981388],
  [-11.862319319488634, 188.03689219558936],
  [-13.02212099716899, 236.01970863262707],
  [-3.806148662479348, 285.971212429572],
  [16.438452773800975, 331.3515762972805],
  [44.775965551470684, 369.1390864182249],
  [80.96504771505055, 397.3497324775763],
  [122.46106826986218, 407.2770096851673],
  [159.07780483472183, 397.9850848557177],
  [185.97411572070874, 368.6543470546894],
  [208.5632888373487, 333.74446876381967],
  [226.5465446939598, 294.45010800552126],
  [239.92753963918344, 252.6998185181637],
  [246.43093522217995, 206.99470698248285],
  [242.770971513515, 159.1594015101822],
  [234.0957976060383, 118.38940175948431],
  [220.63429609489287, 107.36736107409841],
  [193.9188328428578, 106.68989674372877],
  [171.98899316221105, 110.76424528514903],
  [42.40997058061363, 110.6081805665148],
  [66.67191409074624, 100.42853070429244],
  [97.28333595013487, 102.87312579505502],
  [120.38751048771334, 109.20637648060547],
  [58.167915310229986, 142.39119763910278],
  [84.29777749625907, 130.06587646325121],
  [106.72497861488583, 145.13073634148816],
  [82.45914176453176, 148.82370605065944],
  [83.46095400365816, 140.65190105264014],
  [217.18069568472873, 150.0328390453438],
  [198.74082717313826, 135.27543281617164],
  [171.9882261687955, 147.22863859931772],
  [196.83063158883266, 154.0378477053455],
  [196.85261412058645, 145.6941388317238],
  [144.19733134684805, 136.12148112580638],
  [113.55484956933735, 189.2970513463653],
  [99.3525763942105, 209.1655303285304],
  [109.4606820656555, 223.72985516041373],
  [140.4054459161819, 229.17864350315648],
  [165.41865158520744, 225.8692442795916],
  [175.2616226723451, 213.53001420472077],
  [166.4292025898779, 192.5474679745803],
  [145.51041799134998, 170.41021444164895],
  [121.64669293778086, 214.91387689655994],
  [159.3807732050305, 217.9545582528176],
  [77.26141723857612, 279.6466136172062],
  [97.07429856681466, 261.77106093685865],
  [121.27273970444563, 255.32380088663777],
  [136.60857029957336, 258.4371077691206],
  [150.98108353936357, 256.9041908036317],
  [169.7300924206117, 265.1264475048157],
  [179.20560970442895, 283.8819229880483],
  [169.92097433492003, 306.0519022432781],
  [155.236523730846, 320.67876566038353],
  [131.14780629963693, 324.3043748809588],
  [105.70124648185926, 319.01323923174505],
  [87.45492121135302, 302.9613291196862],
  [103.54291216211939, 302.00004837578285],
  [131.74329484395363, 309.07826749252325],
  [157.42614705122963, 303.90490663548053],
  [160.16541181814347, 270.0250190448208],
  [134.96504975904463, 268.0923051057658],
  [106.60915100839551, 267.45369909549413],
  [146.01694374364308, 203.9125938847195],
  [69.58313976768153, 133.3366326324226],
  [98.0267465176955, 134.80693842814728],
  [95.28976140927838, 147.60096056476024],
  [69.47224400829566, 146.81243468561703],
  [210.74976455883146, 140.05817198860208],
  [183.85935845342405, 138.18391193055038],
  [184.1087413063625, 151.4890136890129],
  [208.53186836435435, 153.08110300568217],
];

function Swap() {
  useEffect(() => {
    const img = new Image();
    // img.src = '/face2.jpg';
    // img.src = '/face1.jpg';
    img.src = '/face0.jpg';
    // img.src = '/face3.jpg';
    img.onload = (e) => {
      var imageCC = document.getElementById('image');
      var cc = document.getElementById('image').getContext('2d');
      var overlay = document.getElementById('overlay');
      var overlayCC = overlay.getContext('2d');
      var webgl_overlay = document.getElementById('webgl');
      var webgl_overlay2 = document.getElementById('webgl2');

      cc.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

      var vid_width = img.naturalWidth;
      var vid_height = img.naturalHeight;

      overlay.width = vid_width;
      overlay.height = vid_height;

      webgl_overlay.width = vid_width;
      webgl_overlay.height = vid_height;

      webgl_overlay2.width = vid_width;
      webgl_overlay2.height = vid_height;

      // canvas for copying the warped face to
      var newcanvas = document.createElement('CANVAS');
      newcanvas.width = vid_width;
      newcanvas.height = vid_height;
      // canvas for copying videoframes to
      var videocanvas = document.createElement('CANVAS');
      videocanvas.width = vid_width;
      videocanvas.height = vid_height;
      // canvas for masking
      var maskcanvas = document.createElement('CANVAS');
      maskcanvas.width = vid_width;
      maskcanvas.height = vid_height;

      var animationRequest, detectionRequest;
      var positions;

      var ctrack = new window.clm.tracker();
      ctrack.init(window.pModel);
      // eslint-disable-next-line
      var trackingStarted = false;

      var fd = new window.faceDeformer();
      var fd2 = new window.faceDeformer();

      var currentMask = 0;

      var imagesReady;

      // create canvases for all the faces
      var imageCanvases = {};
      var imageCount = 0;
      const loadMask = function (index) {
        var mask = new Image();
        mask.onload = function (obj) {
          var elementId = images[index].id;

          // copy the images to canvases
          var imagecanvas = document.createElement('CANVAS');
          imagecanvas.width = obj.target.width;
          imagecanvas.height = obj.target.height;
          imagecanvas.getContext('2d').drawImage(obj.target, 0, 0);
          imageCanvases[elementId] = imagecanvas;

          imageCount += 1;
          if (imageCount === images.length) {
            // eslint-disable-next-line
            imagesReady = true;
          }
        };
        mask.src = images[index].path;
      };
      //load masks
      for (var i = 0; i < images.length; i++) {
        loadMask(i);
      }

      var extended_vertices = [
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
        [18, 89, 90, 18],
        [18, 90, 22, 18],
        [22, 90, 21, 22],
        [21, 90, 91, 21],
        [21, 20, 91, 21],
        [20, 91, 92, 20],
        [20, 92, 19, 20],
        [19, 92, 93, 19],
        [19, 93, 71, 19],
        [19, 0, 71, 19],
        [44, 61, 56, 44],
        [60, 61, 56, 60],
        [60, 56, 57, 60],
        [60, 59, 57, 60],
        [58, 59, 57, 58],
        [58, 59, 50, 58],
      ];

      function drawGridLoop() {
        // get position of face
        positions = ctrack.getCurrentPosition();

        overlayCC.clearRect(0, 0, vid_width, vid_height);
        if (positions) {
          // draw current grid
          ctrack.draw(overlay);
        }
        // check whether mask has converged
        var pn = ctrack.getConvergence();
        if (pn < 0.4) {
          console.log(JSON.stringify(positions));
          switchMasks(positions);
        } else {
          // eslint-disable-next-line
          detectionRequest = requestAnimationFrame(drawGridLoop);
        }
      }

      function switchMasks(pos) {
        videocanvas
          .getContext('2d')
          .drawImage(img, 0, 0, videocanvas.width, videocanvas.height);

        // we need to extend the positions with new estimated points in order to get pixels immediately outside mask
        var newMaskPos = testMask;

        var newFacePos = pos.slice(0);
        var extInd = [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          22,
          21,
          20,
          19,
        ];
        var newp;
        for (var i = 0; i < 23; i++) {
          newp = [];
          newp[0] = newMaskPos[extInd[i]][0] * 1.3 - newMaskPos[62][0] * 0.3; // short for ((newMaskPos[extInd[i]][0]-newMaskPos[62][0])*1.1)+newMaskPos[62][0]
          newp[1] = newMaskPos[extInd[i]][1] * 1.3 - newMaskPos[62][1] * 0.3;
          newMaskPos.push(newp);
          newp = [];
          newp[0] = newFacePos[extInd[i]][0] * 1.3 - newFacePos[62][0] * 0.3;
          newp[1] = newFacePos[extInd[i]][1] * 1.3 - newFacePos[62][1] * 0.3;
          newFacePos.push(newp);
        }
        // also need to make new vertices incorporating area outside mask
        var newVertices = window.pModel.path.vertices.concat(extended_vertices);

        // deform the mask we want to use to face form
        fd2.load(
          imageCanvases[images[currentMask].id],
          newMaskPos,
          window.pModel,
          newVertices
        );
        fd2.draw(newFacePos);
        // and copy onto new canvas
        newcanvas
          .getContext('2d')
          .drawImage(document.getElementById('webgl2'), 0, 0);

        // create masking
        var tempcoords = positions.slice(0, 18);
        tempcoords.push(positions[21]);
        tempcoords.push(positions[20]);
        tempcoords.push(positions[19]);
        createMasking(maskcanvas, tempcoords);
        // do poisson blending
        window.Poisson.load(newcanvas, videocanvas, maskcanvas, function () {
          var result = window.Poisson.blend(30, 0, 0);
          // render to canvas
          newcanvas.getContext('2d').putImageData(result, 0, 0);
          // get mask

          // eslint-disable-next-line
          var maskname = Object.keys(masks)[currentMask];
          fd.load(newcanvas, pos, window.pModel);
          animationRequest = requestAnimationFrame(drawMaskLoop);
        });

        function drawMaskLoop() {
          // eslint-disable-next-line
          animationRequest = requestAnimationFrame(drawMaskLoop);
          // get position of face
          positions = ctrack.getCurrentPosition();

          overlayCC.clearRect(0, 0, vid_width, vid_height);
          if (positions) {
            // draw mask on top of face
            fd.draw(positions);
          }
        }

        function createMasking(canvas, modelpoints) {
          // fill canvas with black
          var cc = canvas.getContext('2d');
          cc.fillStyle = '#000000';
          cc.fillRect(0, 0, canvas.width, canvas.height);
          cc.beginPath();
          cc.moveTo(modelpoints[0][0], modelpoints[0][1]);
          for (var i = 1; i < modelpoints.length; i++) {
            cc.lineTo(modelpoints[i][0], modelpoints[i][1]);
          }
          cc.lineTo(modelpoints[0][0], modelpoints[0][1]);
          cc.closePath();
          cc.fillStyle = '#ffffff';
          cc.fill();
        }
      }
      drawGridLoop();
      ctrack.start(imageCC);

      fd.init(webgl_overlay);
      fd2.init(webgl_overlay2);
    };
  }, []);

  return (
    <div className="App">
      <div id="container" style={{ height: 576, width: 720 }}>
        <canvas id="image" width="720" height="576"></canvas>
        <canvas id="overlay" width="720" height="576"></canvas>
        <canvas id="webgl" width="720" height="576"></canvas>
      </div>
      <canvas id="webgl2" width="720" height="576"></canvas>
    </div>
  );
}

export default Swap;
