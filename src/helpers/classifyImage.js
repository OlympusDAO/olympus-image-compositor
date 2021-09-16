// classifyImage.js

// adds attributes to image DOM object
//
// .portrait (bool)
// .governing_height
// .governing_width
function classifyImage(image, parentWidth, parentHeight, mobile) {
  // mobile is used to limit memory usage in Cropper.js
  var portrait = true;
  if (image.height < image.width) {
    portrait = false;
  }
  image.portrait = portrait;
  image.parentWidth = parentWidth;

  // need to limit image & canvas height & width to parent
  // console.log('classifyimage');
  // console.log(portrait, parentWidth, parentHeight);
  var image_height = image.height;
  var image_width = image.width;
  console.log(image_width, image_height);
  image.aspectRatio = (image_width/image_height);

  // if image_width & image_height are each less than parent
  // if image_width 
  if (portrait === true) {
    // PORTRAIT --- OR ---- SQUARE
    // then height is the governing factor...
    if (image_height < parentHeight) {
      // don't stretch... unless width is too wide
      if (image_width < parentWidth) {
        // ok, don't stretch
        image.governing_height = image_height;
        image.governing_width = image_width;
      } else {
        // too wide, shrink
        // console.log('too wide');
        widthGoverning();
      }
      
    } else {
      // aspectRatio = w/h = new_width/new_height
      // new_width = new_height * aspect_ratio
      heightGoverning();
      // don't shrink any further unless width is too wide:
      if (image.governing_width < parentWidth) {
        // ok, we're good
      } else {
        // too wide, shrink
        // console.log('too wide');
        widthGoverning();
      }
    }
  } else {
    // LANDSCAPE
    // width is the governing factor

    if (image_width < parentWidth) {
      // don't stretch ... unless height is too tall
      if (image_height < parentHeight) {
        // ok, don't stretch
        image.governing_width = image_width;
        image.governing_height = image_height;
      } else {
        // too tall, shrink
        heightGoverning();
      }
    } else {
      // aspectRatio = w/h = new_width/new_height
      // new_height = new_width / aspect_ratio
      widthGoverning();
      if (image.governing_height < parentHeight) {
        // ok, we're good
      } else {
        // too tall, shrink
        // console.log('too wide');
        heightGoverning();
      }
    }
  }

  if (mobile) {
    // resizing the image for cropper.js
    // image.height = image.governing_height;
    // image.width = image.governing_width;
  }

  function heightGoverning() {
    // console.log('heightGoverning');
    image.governing_height = parentHeight;
    image.governing_width = (parentHeight * image.aspectRatio);
  }

  function widthGoverning() {
    // console.log('widthGoverning');
    image.governing_width = parentWidth;
    image.governing_height = (parentWidth / image.aspectRatio);
  }

  return image;
}

/**
 * stretches image to fit our desired view port
 */
export const classifyOhmieImage = (image, parentWidth, parentHeight) => {
  image.aspectRatio = parentWidth / parentHeight;
  image.governing_width = parentWidth;
  image.governing_height = parentHeight;

  return image;
}

export default classifyImage;