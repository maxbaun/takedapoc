import React, { useEffect } from 'react';

const Track = () => {
  useEffect(() => {
    var pointsInput = document.getElementById('points');
    var container = document.getElementById('container');
    var imageRef = document.getElementById('image');
    var cc = imageRef.getContext('2d');
    var overlay = document.getElementById('overlay');
    var overlayCC = overlay.getContext('2d');
    let drawRequest;
    var ctrack = new window.clm.tracker({ stopOnConvergence: true });
    ctrack.init();

    function drawLoop() {
      drawRequest = requestAnimationFrame(drawLoop);
      overlayCC.clearRect(0, 0, 720, 576);
      if (ctrack.getCurrentPosition()) {
        ctrack.draw(overlay);
      }
    }

    document.addEventListener(
      'clmtrackrConverged',
      function (event) {
        console.log('converged');
        // stop drawloop
        cancelAnimationFrame(drawRequest);

        var parameters = ctrack.getCurrentParameters();
        let positions = ctrack.calculatePositions(parameters);
        pointsInput.innerHTML = JSON.stringify(positions);
      },
      false
    );

    var img = new Image();
    img.onload = function () {
      imageRef.setAttribute('width', img.width);
      imageRef.setAttribute('height', img.height);

      overlay.setAttribute('width', img.width);
      overlay.setAttribute('height', img.height);

      container.style.width = `${img.width}px`;
      container.style.height = `${img.height}px`;

      cc.drawImage(img, 0, 0, img.width, img.height);

      console.log('here');

      ctrack.start(imageRef);

      drawLoop();
    };
    img.src = './hae3.jpg';
  }, []);

  return (
    <>
      <div id="container">
        <canvas id="image" width="625" height="500"></canvas>
        <canvas id="overlay" width="625" height="500"></canvas>
        {/* <canvas id="webgl" width="625" height="500"></canvas> */}
      </div>
      <textarea id="points" />
    </>
  );
};

export default Track;
