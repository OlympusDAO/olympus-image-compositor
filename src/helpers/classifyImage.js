// classifyImage.js

// adds attributes to image DOM object
//
// .portrait (bool)
// .governing_height
// .governing_width
function classifyImage(image, parentElement) {
  var portrait = true;
  if (image.height < image.width) {
    portrait = false;
  }
  image.portrait = portrait;

  // need to limit image & canvas height & width to parent
  var parent_height = parentElement.offsetHeight;
  var parent_width = parentElement.offsetWidth;
  var image_height = image.height;
  var image_width = image.width;
  image.aspectRatio = (image_width/image_height);

  if (portrait === true) {
    // PORTRAIT
    // then height is the governing factor...
    if (image_height < parent_height) {
      // don't stretch
      image.governing_height = image_height;
      image.governing_width = image_width;
    } else {
      // aspectRatio = w/h = new_width/new_height
      // new_width = new_height * aspect_ratio
      image.governing_height = parent_height;
      image.governing_width = (parent_height * image.aspectRatio);
    }
  } else {
    // LANDSCAPE
    // width is the governing factor

    if (image_width < parent_width) {
      image.governing_width = image_width;
      image.governing_height = image_height;
    } else {
      // aspectRatio = w/h = new_width/new_height
      // new_height = new_width / aspect_ratio
      image.governing_width = parent_width;
      image.governing_height = (parent_width / image.aspectRatio);
    }
  }

  return image;
}

export default classifyImage;