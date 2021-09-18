/**
 * 
 * @param {bool} preview is optional
 * @param {object} croppedBg the background image
 * @param {object} toCanvasRef the finalCanvas, i.e.`finalCanvasRef`
 * @param {Array} combinedCanvases the array of canvases to combine, i.e. `[bgCanvasRef, pfpCanvasRef, textCanvasRef]`
 * @param {float} fixedWidth
 */
export const drawFinalCanvas = (preview, croppedBg, toCanvasRef, governingCanvasRef, combineCanvases, fixedWidth, fixedHeight) => {
  var dpiType = "final";
  // if (preview) dpiType = "preview";
  setDPI(toCanvasRef, dpiType, governingCanvasRef);

  // // ratio of screen height to original
  // var scaleFactor = croppedBg.governing_height/croppedBg.height;

  // // setting back to original height & width
  // toCanvasRef.current.width = croppedBg.width;
  // toCanvasRef.current.height = croppedBg.height;
  // var ctx = toCanvasRef.current.getContext('2d');
  // ctx.drawImage(bgCanvasRef.current, 0, 0, croppedBg.governing_width/scaleFactor, croppedBg.governing_height/scaleFactor);
  // ctx.drawImage(pfpCanvasRef.current, 0, 0, croppedBg.governing_width/scaleFactor, croppedBg.governing_height/scaleFactor);
  // // draw Text
  // ctx.drawImage(textCanvasRef.current, 0, 0, croppedBg.governing_width/scaleFactor, croppedBg.governing_height/scaleFactor);
  
  var ctx = toCanvasRef.current.getContext('2d');
  // Object.entries(combineCanvases).map((canvasRef) => (
  combineCanvases.forEach(canvas => ctx.drawImage(canvas.current, 0, 0, croppedBg.governing_width, croppedBg.governing_height));
  //   ctx.drawImage(combineCanvases[0].current, 0, 0, croppedBg.governing_width, croppedBg.governing_height)
  // // ));
  // ctx.drawImage(combineCanvases[1].current, 0, 0, croppedBg.governing_width, croppedBg.governing_height);
  // // // draw Text
  // ctx.drawImage(combineCanvases[2].current, 0, 0, croppedBg.governing_width, croppedBg.governing_height);

  // setting back to original height & width
  // toCanvasRef.current.width = croppedBg.width;
  // toCanvasRef.current.height = croppedBg.height;
  // finalDPI(toCanvasRef);
  resizeAndExport(preview, toCanvasRef, croppedBg, fixedWidth, fixedHeight);
};

export const resizeAndExport = (preview, toCanvasRef, croppedBg, fixedWidth, fixedHeight) => {
  var thisCanvas = toCanvasRef.current;
  if (thisCanvas.width !== fixedWidth) {
    var backup = thisCanvas.cloneNode(false);
    backup.getContext('2d').drawImage(thisCanvas, 0, 0);

    if (preview) {
      thisCanvas.width = croppedBg.governing_width;
      thisCanvas.height = croppedBg.governing_height;

      thisCanvas.getContext('2d').drawImage(backup, 0,0, croppedBg.governing_width, croppedBg.governing_height);  
    } else {
      thisCanvas.width = fixedWidth;
      thisCanvas.height = fixedHeight;

      thisCanvas.getContext('2d').drawImage(backup, 0,0, backup.width, backup.height, 0, 0, fixedWidth, fixedHeight);  
    }
  }
};

// TODO (appleseed):
// I think we'll want to setDPI on pfpCanvasRef
// ... but size based on bgCanvasRef
export function setDPI(thisCanvasRef, type, bgCanvasRef) {
  var thisCanvas = thisCanvasRef.current;
  var bgCanvas = bgCanvasRef.current;
  // var dpi = 96*3;
  // var scaleFactor = dpi / 96;
  var scaleFactor;
  if (type === "text") {
    scaleFactor = 3;
  } else if (type === "final") {
    scaleFactor = 12;
  } else {
    scaleFactor = 3;
  }
  
  // Set up CSS size.
  thisCanvas.style.width = bgCanvas.style.width || bgCanvas.width + 'px';
  thisCanvas.style.height = bgCanvas.style.height || bgCanvas.height + 'px';

  // console.log('setDpi', canvas.style.width, canvas.style.height);
  // Get size information.
  var width = parseFloat(thisCanvas.style.width);
  var height = parseFloat(thisCanvas.style.height);

  // Backup the canvas contents.
  var oldScale = thisCanvas.width / width;
  var backupScale = scaleFactor / oldScale;
  var backup = thisCanvas.cloneNode(false);
  backup.getContext('2d').drawImage(thisCanvas, 0, 0);

  // Resize the canvas.
  var ctx = thisCanvas.getContext('2d');
  thisCanvas.width = Math.ceil(width * scaleFactor);
  thisCanvas.height = Math.ceil(height * scaleFactor);

  // Redraw the canvas image and scale future draws.
  ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
  ctx.drawImage(backup, 0, 0);
  ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
};