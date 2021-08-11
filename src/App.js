// import logo from './logo.svg';
import './App.css';

// import jimp from 'jimp';

import zeusImg from './Zeus_Full_Body.png';
import sOhm from './token_sOHM.png';

function draw() {
  var canvasOnly = document.getElementById('canvas')
  var ctx = canvasOnly.getContext('2d');
  var img = new Image();
  img.src = zeusImg;
  var logo = new Image();
  logo.src = sOhm;
  
  console.log("img.naturalHeight");
  console.log(img.naturalHeight);
  ctx.canvas.height = img.naturalHeight;
  ctx.canvas.width = img.naturalWidth;
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    // ctx.drawImage(logo, 10, 10, 20, 20);
  };

  // When true, moving the mouse draws on the canvas
  let isDrawing = false;
  // let x = 0;
  // let y = 0;

  // Add the event listeners for mousedown, mousemove, and mouseup
  canvasOnly.addEventListener('mousedown', e => {
    // x = e.offsetX;
    // y = e.offsetY;
    isDrawing = true;
  });

  // drawImage usage
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  canvasOnly.addEventListener('mousemove', e => {
    if (isDrawing === true) {
      // ctx.drawImage(image, dx, dy, dWidth, dHeight);
      ctx.drawImage(logo, e.offsetX, e.offsetY, 20, 20);
      // drawLine(context, x, y, e.offsetX, e.offsetY);
      // x = e.offsetX;
      // y = e.offsetY;
    }
  });

  window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
      ctx.drawImage(logo, e.offsetX, e.offsetY, 20, 20);
      // drawLine(context, x, y, e.offsetX, e.offsetY);
      // x = 0;
      // y = 0;
      isDrawing = false;
    }
  });
  
}

// async function jimpImages() {
//   const image = await jimp.read(zeusImg);
//   const ohmLogo = await jimp.read(sOhm);

//   image.blit(ohmLogo, 10, 10)
//     .getBase64(jimp.AUTO, function(err, data) {
//         console.log(data);
//         document.getElementById("image").setAttribute("src", data);
//       });
//   // image.blit(ohmLogo, 10, 10, function(Error, Jimp) {
//   //   console.log(Jimp);

//   //   // writing file
//   //   // https://stackoverflow.com/questions/52715291/error-cant-access-the-filesystem-you-can-use-the-getbase64-method-electronjs
//   //   // Jimp.write('new.png');
//   //   image.getBase64(Jimp.AUTO, function(err, data) {
//   //     console.log(data);
//   //     document.getElementById("image").setAttribute("src", data);
//   //   });
//   // });
// }


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<button onClick={jimpImages}>Click to Jimp</button>*/}
        <button onClick={draw}>Click to draw</button>
        <div>
          <img
            id="image"
            src={zeusImg}
            alt='zeus'
            style={{ cursor: 'url('+{sOhm}+'),auto' }}
          />
          <canvas
            id="canvas"
          ></canvas>
        </div>
        {/* <img src={sOhm} alt='sOhm' /> */}
      </header>
    </div>
  );
}

export default App;
