import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings from "./global.js";
// import bgImage from "../assets/bg-figma.png";

// TODO: Break repeated use color values out into list of consts declared here
// then set the values in figmaTheme using the global color variables

const figmaTheme = {
  color: "#FCFCFC",
  gold: "#F8CC82",
  gray: "#A3A3A3",
  textHighlightColor: "#F4D092",

  // ADDED
  // backgroundColor: "#0C1B29",
  background: "rgba(45, 60, 120, 1)",
  filter: "blur(4px)",
  // opacity: "0.5",
  // background: `url(${bgImage}) no-repeat center center fixed`,
  // webkitBackgroundSize: "cover",
  // mozBackgroundSize: "cover",
  // oBackgroundSize: "cover",
  // backgroundSize: "cover",
  // width: "100vw",
  // height: "100vh",
  // ADDED

  // backgroundSize: "cover",
  // background: `
  //   linear-gradient(180deg, rgba(8, 15, 53, 0), rgba(0, 0, 10, 0.9)),
  //   linear-gradient(333deg, rgba(153, 207, 255, 0.2), rgba(180, 255, 217, 0.08)),
  //   radial-gradient(circle at 77% 89%, rgba(125, 163, 169, 0.8), rgba(125, 163, 169, 0) 50%),
  //   radial-gradient(circle at 15% 95%, rgba(125, 163, 169, 0.8), rgba(125, 163, 169, 0) 43%),
  //   radial-gradient(circle at 65% 23%, rgba(137, 151, 119, 0.4), rgba(137, 151, 119, 0) 70%),
  //   radial-gradient(circle at 10% 0%, rgba(187, 211, 204, 0.33), rgba(187,211,204,0) 35%),
  //   radial-gradient(circle at 11% 100%, rgba(131, 165, 203, 0.3), rgba(131, 165, 203, 0) 30%)
  //   `,
  paperBg: "rgba(54, 56, 64, 0.5)",
  modalBg: "rgba(36, 36, 38, 0.6)",
  popoverBg: "rgba(54, 56, 64, 1)",
  menuBg: "#36384080",
  backdropBg: "rgba(54, 56, 64, 0.5)",
  largeTextColor: "#F4D092",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#333333",
  primaryButtonBG: "#F4D092",
  primaryButtonHoverBG: "#EDD8B4",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#F8CC82",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#F8CC82", //gold
  containedSecondaryButtonHoverBG: "rgba(255, 255, 255, 0.15)",
};

export const figma = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: figmaTheme.color,
      },
      palette: {
        type: "dark",
        background: {
          default: figmaTheme.backgroundColor,
          paper: figmaTheme.paperBg,
        },
        contrastText: figmaTheme.color,
        primary: {
          main: figmaTheme.color,
        },
        secondary: {
          main: figmaTheme.gold,
        },
        neutral: {
          main: figmaTheme.color,
          secondary: figmaTheme.gray,
        },
        text: {
          primary: figmaTheme.color,
          secondary: figmaTheme.gray,
        },
      },
      typography: {
        fontFamily: "Square",
      },
      props: {
        MuiSvgIcon: {
          htmlColor: figmaTheme.color,
        },
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "@font-face": fonts,
            body: {
              background: figmaTheme.background,
            },
          },
        },
        MuiDrawer: {
          paper: {
            backgroundColor: figmaTheme.paperBg,
            zIndex: 7,
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: figmaTheme.paperBg,
            "&.ohm-card": {
              backgroundColor: figmaTheme.paperBg,
            },
            "&.ohm-modal": {
              backgroundColor: figmaTheme.modalBg,
            },
            "&.ohm-menu": {
              backgroundColor: figmaTheme.menuBg,
              backdropFilter: "blur(33px)",
            },
            "&.ohm-popover": {
              backgroundColor: figmaTheme.popoverBg,
              color: figmaTheme.color,
              backdropFilter: "blur(15px)",
            },
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: figmaTheme.backdropBg,
          },
        },
        MuiLink: {
          root: {
            color: figmaTheme.color,
            "&:hover": {
              color: figmaTheme.textHighlightColor,
              textDecoration: "none",
              "&.active": {
                color: figmaTheme.color,
              },
            },
            "&.active": {
              color: figmaTheme.color,
              textDecoration: "underline",
            },
          },
        },
        MuiTableCell: {
          root: {
            color: figmaTheme.color,
          },
        },
        MuiOutlinedInput: {
          root: {
            focused: {
              borderColor: figmaTheme.gold,
            },
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: figmaTheme.paperBg,
            "&:hover": {
              color: figmaTheme.color,
              backgroundColor: `${figmaTheme.containedSecondaryButtonHoverBG} !important`,
            },
            selected: {
              backgroundColor: figmaTheme.containedSecondaryButtonHoverBG,
            },
            "@media (hover:none)": {
              "&:hover": {
                color: figmaTheme.color,
                backgroundColor: figmaTheme.paperBg,
              },
              "&:focus": {
                color: figmaTheme.color,
                backgroundColor: figmaTheme.paperBg,
                borderColor: "transparent",
                outline: "#00000000",
              },
            },
          },
        },
        MuiButton: {
          containedPrimary: {
            color: figmaTheme.primaryButtonColor,
            backgroundColor: figmaTheme.gold,
            "&:hover": {
              backgroundColor: figmaTheme.primaryButtonHoverBG,
              color: figmaTheme.primaryButtonHoverColor,
            },
            "&:active": {
              backgroundColor: figmaTheme.primaryButtonHoverBG,
              color: figmaTheme.primaryButtonHoverColor,
            },
            "@media (hover:none)": {
              color: figmaTheme.primaryButtonColor,
              backgroundColor: figmaTheme.gold,
              "&:hover": {
                backgroundColor: figmaTheme.primaryButtonHoverBG,
              },
            },
          },
          containedSecondary: {
            backgroundColor: figmaTheme.paperBg,
            color: figmaTheme.color,
            "&:hover": {
              backgroundColor: `${figmaTheme.containedSecondaryButtonHoverBG} !important`,
            },
            "&:active": {
              backgroundColor: figmaTheme.containedSecondaryButtonHoverBG,
            },
            "&:focus": {
              backgroundColor: figmaTheme.paperBg,
            },
            "@media (hover:none)": {
              color: figmaTheme.color,
              backgroundColor: figmaTheme.paperBg,
              "&:hover": {
                backgroundColor: `${figmaTheme.containedSecondaryButtonHoverBG} !important`,
              },
            },
          },
          outlinedPrimary: {
            color: "#fff",
            borderColor: "#fff",
            "&:hover": {
              color: figmaTheme.outlinedPrimaryButtonHoverColor,
              backgroundColor: figmaTheme.primaryButtonHoverBG,
            },
            "@media (hover:none)": {
              color: "#fff",
              borderColor: "#fff",
              "&:hover": {
                color: figmaTheme.outlinedPrimaryButtonHoverColor,
                backgroundColor: `${figmaTheme.primaryButtonHoverBG} !important`,
                textDecoration: "none !important",
              },
            },
          },
          outlinedSecondary: {
            color: figmaTheme.color,
            borderColor: figmaTheme.color,
            "&:hover": {
              color: figmaTheme.outlinedSecondaryButtonHoverColor,
              backgroundColor: figmaTheme.outlinedSecondaryButtonHoverBG,
              borderColor: figmaTheme.gold,
            },
          },
          textPrimary: {
            color: "#A3A3A3",
            "&:hover": {
              color: figmaTheme.gold,
              backgroundColor: "#00000000",
            },
            "&:active": {
              color: figmaTheme.gold,
              borderBottom: "#F8CC82",
            },
          },
          textSecondary: {
            color: figmaTheme.color,
            "&:hover": {
              color: figmaTheme.textHighlightColor,
            },
          },
        },
      },
    },
    commonSettings,
  ),
);
