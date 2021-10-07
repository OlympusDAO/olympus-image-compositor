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
  background: "rgba(6, 11, 31, 1)",
  filter: "blur(4px)",

  paperBg: "rgba(6, 11, 31, 0.5)",
  modalBg: "rgba(36, 36, 38, 0.6)",
  popoverBg: "rgba(6, 11, 31, 1)",
  menuBg: "#36384080",
  backdropBg: "rgba(6, 11, 31, 0.5)",
  largeTextColor: "#F4D092",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#000000",
  primaryButtonBG: "#fff",
  primaryButtonHoverBG: "#e5e5e5",
  secondaryButtonHoverBG: "rgba(6, 11, 31, 1)",
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
              borderColor: "#fff",
            },
            "& fieldset": {
              borderColor: "#fff",
            },
          },
        },
        MuiInputLabel: {
          root: {
            color: "#fff",
          }
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
