/**
 * rich text style configuration
 *
 * Most values are clear by their name, some are clarified.
 */
'use strict'

module.exports = {

  // paths for various font styles relative to Resource folder
  // font-family will found here
  fonts: {
    OpenSans: {
      REGULAR: 'fonts/OpenSans-Regular.ttf',
      ITALIC: 'fonts/OpenSans-Italic.ttf',
      BOLD: 'fonts/OpenSans-Bold.ttf',
      BOLD_ITALIC: 'fonts/OpenSans-BoldItalic.ttf',
    },
    Montserrat: {
      REGULAR: 'fonts/Montserrat/Montserrat-Regular.ttf',
      ITALIC: 'fonts/Montserrat/Montserrat-Italic.ttf',
      BOLD: 'fonts/Montserrat/Montserrat-Bold.ttf',
      BOLD_ITALIC: 'fonts/Montserrat/Montserrat-BoldItalic.ttf',
    },
    Raleway: {
      REGULAR: 'fonts/Raleway/Raleway-Regular.ttf',
      ITALIC: 'fonts/Raleway/Raleway-Italic.ttf',
      BOLD: 'fonts/Raleway/Raleway-Bold.ttf',
      BOLD_ITALIC: 'fonts/Raleway/Raleway-BoldItalic.ttf',
    },
    SourceCodePro: {
      REGULAR: 'fonts/SourceCodePro-Regular.ttf',
    }
  },

  // styles of various blocks
  styles: {
    // container of the whole rich text document
    container: {
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
    },

    defaultFontSize: 16, // default font size, 1em/16px
    defaultFontColor: 0x000000ff, // default font color , black
    blankLineHeight: 22, // default blank line height

    underline: { // under line height , underline color will depend on the font color
      height: 1,
    }
  }
};
