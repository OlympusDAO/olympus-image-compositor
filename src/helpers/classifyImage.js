// classifyImage.js

// adds attributes to image DOM object
//
// .portrait (bool)
// .governing_height
// .governing_width
function classifyImage(image, parentElement, areaHt) {
  console.log('classifyImage', image.height, image.width);
  var portrait = true;
  if (image.height < image.width) {
    portrait = false;
  }
  image.portrait = portrait;

  // need to limit image & canvas height & width to parent
  var parent_height = areaHt;
  var parent_width = parentElement.offsetWidth;
  console.log(portrait, parent_width, parent_height);
  var image_height = image.height;
  var image_width = image.width;
  console.log(image_width, image_height);
  image.aspectRatio = (image_width/image_height);

  // if image_width & image_height are each less than parent
  // if image_width 
  if (portrait === true) {
    // PORTRAIT --- OR ---- SQUARE
    // then height is the governing factor...
    if (image_height < parent_height) {
      // don't stretch... unless width is too wide
      if (image_width < parent_width) {
        // ok, don't stretch
        image.governing_height = image_height;
        image.governing_width = image_width;
      } else {
        // too wide, shrink
        console.log('too wide');
        widthGoverning();
      }
      
    } else {
      // aspectRatio = w/h = new_width/new_height
      // new_width = new_height * aspect_ratio
      heightGoverning();
      // don't shrink any further unless width is too wide:
      if (image_width < parent_width) {
        // ok, we're good
      } else {
        // too wide, shrink
        console.log('too wide');
        widthGoverning();
      }
    }
  } else {
    // LANDSCAPE
    // width is the governing factor

    if (image_width < parent_width) {
      // don't stretch ... unless height is too tall
      if (image_height < parent_height) {
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
      if (image_height < parent_height) {
        // ok, we're good
      } else {
        // too tall, shrink
        console.log('too wide');
        heightGoverning();
      }
    }
  }

  function heightGoverning() {
    console.log('heightGoverning');
    image.governing_height = parent_height;
    image.governing_width = (parent_height * image.aspectRatio);
  }

  function widthGoverning() {
    console.log('widthGoverning');
    image.governing_width = parent_width;
    image.governing_height = (parent_width / image.aspectRatio);
  }

  return image;
}

export default classifyImage;