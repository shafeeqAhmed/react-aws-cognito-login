// @flow

"use strict";

// Global CSS variables passed via precss > postcss-custom-properties
// Also used throughout JS files in the site
// https://github.com/postcss/postcss-custom-properties#variables

const variables = {
  // App-specific config
  appTitle: "ProductionCliq Filmmaker",
  appDescription: "The best script editor ever.",
  appIcon: "/static/images/logo-square.png",
  appLogo: "/static/images/logo-square.png",
  appLogoWidth: "184",
  appLogoHeight: "184",

  appAuthCookieKey: "procliq-v1",
  appAuthExpirySeconds: 1209600, // 14 days in seconds

  baseRemSize: "16", // CAUTION: Think twice before changing!
  borderRadius: "3px",

  // From Zeplin:
  //
  colorWhite0: "rgba(255, 255, 255, 0)",
  colorBlack: "#000000",
  colorCloudyBlue: "#cdd5dd",
  colorWhite: "#ffffff",
  colorOpaqueWhite: "#bab9ba",
  colorPaleGrey: "#fafbfc",
  colorPaleGreyTwo: "#f5f8fb",
  colorGreyishBrown: "#4a4a4a",
  colorPaleGreyThree: "#e4eaf0",
  colorPaleGreyFour: "#e9edf1",
  colorCharcoalGrey: "#313d4a",
  colorBlueyGrey: "#a1b1be",
  colorGreyBoulder: "#767676",
  colorSilver: "#cad1d8",
  colorSteel: "#798999",
  colorSoftGrey: "#d5d5d5",
  colorCoolGrey: "#98a2ab",
  colorDarkMint: "#54c08a",
  colorBrightOrange: "#f46800",
  colorRobinsEggBlue: "#b2e1f7",
  colorSquash: "#e8b71a",
  colorSlate: "#394656",
  colorBattleshipGrey: "#62707f",
  colorDarkSkyBlue: "#38b3ec",
  colorLightBlueGrey: "#c5d9e8",
  colorLightBlueCerulean: "#00b5f2",
  colorPerrywinkle: "#759cde",
  colorWhiteTwo: "#ececec",
  colorDuskBlue: "#226786",
  colorOpaqueBlue: "#2c405a",
  colorLightNavy: "#154d67",
  colorDuckEggBlue: "#ecf5fd",
  colorSquashTwo: "#e8891a",
  colorMarine: "#09374c",
  colorPeacockBlue: "#0547a6",
  colorCerulean: "#0282d2",
  colorDarkViolet: "#2a044a",
  colorBrightCyan: "#4fe2f6",
  colorAzure: "#0093ee",
  colorReddishOrange: "#f26522",
  colorButterscotch: "#fbb040",
  colorPurple: "#ab7df6",
  colorWarmPurple: "#92278f",
  colorEmerald: "#00a651",
  colorTopaz: "#0fb7b7",
  colorDarkMintTwo: "#54c08a",
  colorPinkishRed: "#ed1c24",
  colorAzureTwo: "#00aeef",
  colorDarkSkyBlueTwo: "#57aee0",
  colorDarkSkyBlueThree: "#4a90e2",
  colorNavy: "#001c3d",
  // colorDark: "#1e112a",
  colorWarmGrey: "#979797",
  colorDullOrange: "#e3803c",
  colorJadeGreen: "#269f48",
  colorDarkGreyBlue: "#383466",
  colorBrownishRed: "#98301f",
  colorMustard: "#e0b501",
  colorCopper: "#c95b27",
  colorVeryLightBlue: "#f8faff",
  colorTurtleGreen: "#6fbf58",
  colorWhiteThree: "#f7f5f5",
  colorWhiteFour: "#f7f7f7",
  colorGreyish: "#acacac",
  colorLightGreyBlue: "#79a3d5",
  colorDarkTeal: "#003149",
  colorGrassGreen: "#269f07",
  colorGreyishBrownTwo: "#474747",
  colorWarmGreyTwo: "#878787",
  colorTea: "#64a685",
  colorPaleSkyBlue: "#cfe3f2",
  colorTwilightBlue: "#0e476b",
  colorBeige: "#fae190",
  colorLightBeige: "#fff9bc",
  colorDarkishRed: "#b0020c",
  colorPaleGreyFive: "#f4f5f7",
  colorLightSkyBlue: "#d8e5ee",
  colorSepia: "#975f2e",
  colorVeryDark: "#4e5665",

  colorDark: "#4f4f4f", // darkgrey
  colorDarkFaded: "rgba(74, 74, 74, 0.5)",
  colorTheme: "#38B3FE", // Dodger Blue
  colorThemeFaded: "#e3d6e5", // fadetheme
  colorThemePale: "#F8F3FC", // White Lilac
  colorThemeSecondary: "#246DCA", // Mariner
  colorThemeTertiary: "#1aa590", // jadegreen
  colorBlue: "#64daff", // cartoonblue
  colorLightBlue: "#8ED7FA",
  colorBlueLight: "#1895EB",
  colorGreen: "#84c500", // green
  colorGreenTwo: "#2D9D1C",
  colorGreenLight: "#83C736",
  colorGreenLightTwo: "#F6F6F6",
  colorGreenDark: "#68AF8B",
  colorGreenApple: "#5ab342",
  colorGreenAppleLight: "#81c926",
  colorGray: "#9f9f9f", // midgrey
  colorGrayLight: "#ECECEC", // Gallery
  // colorWhite: "#ffffff",
  colorWhiteFaded: "rgba(255, 255, 255, 0.5)",
  colorWhiteFadedTwo: "rgba(255, 255, 255, 0.1)",
  colorBlueDark: "#164AA0",
  colorBlueTwo: "#BBE0F5",
  colorBlueTwoFaded: "rgb(187, 224, 245, 0.2)",
  colorRed: "#CE3010", // Tia Maria
  colorYellow: "#FAC636",
  colorOrange: "#E38146",
  colorOrangeRoughy: "#c55f1a",
  // colorGrassGreen: "#6EC157", // Mantis
  colorDarkBlue: "#002533", // Daintree
  // colorWhiteTwo: "#F7F7F7", // Alabaster
  colorGrayDove: "#62707F",
  // colorPaleGreyTwo: "#f5f8fb",
  // colorPaleGreyThree: "#e4eaf0",

  fontFamily: "Roboto, Helvetica-Neue, Helvetica, Arial, sans-serif",
  fontWeight: 300,
  fontRoboto: "Roboto, Helvetica-Neue, Helvetica, Arial, sans-serif",

  navLogoTopPadding: "6rem",
  navLogoTopPaddingSm: "4rem",

  drawerWidth: "318px",

  screenLgMax: "1199px",
  screenLgMaxHeight: "800px",
  screenLgMin: "1200px",
  screenMdMax: "1023px",
  screenMdMin: "1024px",
  screenSmMax: "767px",
  screenSmMin: "768px",
  screenXsMax: "320px",
  screenXsMin: "321px",

  // editor layout
  flexWidthScreenplaySidebar: "10", // Shows the editor mode (writer, shooting event, etc.), notificaitons, and currentUser
  flexWidthScreenplayContent: "90", // Main content area
  flexWidthScreenplayEditorLeftSidebar: "15", // Add new and current tabs
  flexWidthScreenplayEditorRightSidebar: "15", // Details pane
  flexWidthScreenplayEditorContent: "70", // Text editor content

  zModal: 50,
  zModalBackdrop: 40,

  // Framework-specific config
  fobReduxStateVar: "__THIS_DA_LOAD__",
  fobWebpackManiVar: "__MANI_FOR_WEBPACK__",
  jssElementId: "jss-server-side",

  // Standard sizes based on REMs
  s1: ".25rem",
  s2: ".5rem",
  s3: "1rem",
  s4: "2rem",
  s5: "4rem",
  s6: "8rem",
  s7: "16rem"
};

module.exports = variables;
