import SquareWOFF from "../assets/fonts/EuclidSquare-Regular.woff";
import SquareBoldWOFF from "../assets/fonts/EuclidSquare-Bold.woff";
// // not used
// import SquareSemiBoldWOFF from "../assets/fonts/EuclidSquare-SemiBold.woff";
import SquareItalicWOFF from "../assets/fonts/EuclidSquare-Italic.woff";
import SquareLightWOFF from "../assets/fonts/EuclidSquare-Light.woff";
import SquareMediumWOFF from "../assets/fonts/EuclidSquare-Medium.woff";
import RedHatDisplayWOFF from "../assets/fonts/red-hat-display-v4-latin-ext_latin-regular.woff";
import RedHatDisplayTTF from "../assets/fonts/red-hat-display-v4-latin-ext_latin-regular.ttf";
import RedHatDisplayMediumTTF from "../assets/fonts/RedHatDisplay-Medium.ttf";
import RedHatDisplayBoldTTF from "../assets/fonts/RedHatDisplay-Bold.ttf";

import OpenSansExtraBoldTTF from "../assets/fonts/OpenSans-ExtraBold.ttf"
import OpenSansRegularTTF from "../assets/fonts/OpenSans-Regular.ttf"

const openSansExtraBold = {
  fontFamily: 'Open Sans',
  fontStyle: "bold",
  fontWeight: 800,
  src: `
		local(''),  
		url(${OpenSansExtraBoldTTF}) format('truetype')
	`,
};

const openSansRegular = {
  fontFamily: 'Open Sans',
  fontStyle: "normal",
  fontWeight: 500,
  src: `
		local(''),  
		url(${OpenSansRegularTTF}) format('truetype')
	`,
};

const redHatDisplay = {
  fontFamily: 'RedHatDisplay',
  fontStyle: "normal",
  fontWeight: 400,
  src: `
		local(''),  
		url(${RedHatDisplayWOFF}) format('woff'),
		url(${RedHatDisplayTTF}) format('truetype')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const redHatDisplayMedium = {
  fontFamily: 'RedHatDisplay',
  fontStyle: "medium",
  fontWeight: 500,
  src: `
		local(''),  
		url(${RedHatDisplayMediumTTF}) format('truetype')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const redHatDisplayBold = {
  fontFamily: 'RedHatDisplay',
  fontStyle: "bold",
  fontWeight: 700,
  src: `
		local(''),  
		url(${RedHatDisplayBoldTTF}) format('truetype')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const square = {
  fontFamily: "Square",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
		local('EuclidSquare'),
		local('EuclidSquare-Regular'),
		url(${SquareWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const squareLight = {
  fontFamily: "Square",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 300,
  src: `
		local('EuclidSquare'),
		local('EuclidSquare-Light'),
		url(${SquareLightWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const squareMedium = {
  fontFamily: "Square",
  fontStyle: "medium",
  fontDisplay: "swap",
  fontWeight: 500,
  src: `
		local('EuclidSquare'),
		local('EuclidSquare-Medium'),
		url(${SquareMediumWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

//// not used
// const squareSemiBold = {
//   fontFamily: "Square",
//   fontStyle: "normal",
//   fontDisplay: "swap",
//   fontWeight: 600,
//   src: `
// 		local('EuclidSquare-SemiBold'),
// 		local('EuclidSquare-SemiBold'),
// 		url(${SquareSemiBoldWOFF}) format('woff')
// 	`,
//   unicodeRange:
//     "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
// };

const squareBold = {
  fontFamily: "Square",
  fontStyle: "bold",
  fontDisplay: "swap",
  fontWeight: 700,
  src: `
		local('EuclidSquare-Bold'),
		local('EuclidSquare-Bold'),
		url(${SquareBoldWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const squareItalic = {
  fontFamily: "Square",
  fontStyle: "italic",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
		local('EuclidSquare-Italic'),
		local('EuclidSquare-Italic'),
		url(${SquareItalicWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const fonts = [
  openSansRegular,
  openSansExtraBold,
  redHatDisplay,
  redHatDisplayMedium,
  redHatDisplayBold,
  square,
  squareLight,
  squareMedium,
  squareBold,
  squareItalic
];

export default fonts;