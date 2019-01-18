/**
 * Markdown style configuration
 *
 * Most values are clear by their name, some are clarified.
 *
 * NOTE about defining fonts.
 * First we define different font styles, and after just use their ids.
 */
'use strict'

module.exports = {
  // paths for various font styles relative to Resource folder
  FONT_STYLE: {
    REGULAR: 'fonts/OpenSans-Regular.ttf',
    ITALIC: 'fonts/OpenSans-Italic.ttf',
    BOLD: 'fonts/OpenSans-Bold.ttf',
    BOLD_ITALIC: 'fonts/OpenSans-BoldItalic.ttf',
    MONOSPACE: 'fonts/SourceCodePro-Regular.ttf',
  },

  // styles of various blocks
  styles: {
    // container of the whole markdown document
    container: {
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,

      selectionBackgroudColor: 0xf3f1d388,
      dragBackgourd: 0xf3f1d344,
      cusorColor: 0x000000ff,
    },

    // BLOCK level blocks
    paragraph: {
      font: 'REGULAR',
      textColor: 0x000000FF,
      pixelSize: 16,
      marginBottom: 20,
    },
    blockquote: {
      font: 'REGULAR',
      textColor: 0x000000FF,
      pixelSize: 16,
      lineOffsetLeft: 15,    // left offset of the decor line
      lineWidth: 5,          // width of the decor line
      lineColor: 0x000000FF, // color of the decor line
      paddingLeft: 30,       // padding left of the text ignoring decor line
      marginBottom: 20,
    },
    'header-1': {
      font: 'BOLD',
      textColor: 0x000000FF,
      pixelSize: 45,
      marginBottom: 20,
    },
    'header-2': {
      font: 'BOLD',
      textColor: 0x000000FF,
      pixelSize: 36,
      marginBottom: 20,
    },
    'header-3': {
      font: 'BOLD',
      textColor: 0x000000FF,
      pixelSize: 27,
      marginBottom: 20,
    },
    'header-4': {
      font: 'BOLD',
      textColor: 0x000000FF,
      pixelSize: 22,
      marginBottom: 20,
    },
    'header-5': {
      font: 'BOLD',
      textColor: 0x000000FF,
      pixelSize: 18,
      marginBottom: 20,
    },
    'header-6': {
      font: 'BOLD',
      textColor: 0x000000FF,
      pixelSize: 16,
      marginBottom: 20,
    },
    code: {
      textColor: 0x000000FF,
      font: 'MONOSPACE',
      lineColor: 0xCCCCCCFF, // line color of the code decoration block
      lineWidth: 1,          // line width of the code decoration block
      fillColor: 0xF5F5F5FF, // background color
      marginBottom: 20,      // space after block with background
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
    },
    list: {
      marginBottom: 20,      // space after the whole list
    },
    'list-item': {
      font: 'REGULAR',
      textColor: 0x000000FF,
      pixelSize: 16,
      symbol: '•',           // symbol for unordered lists
      symbolOffsetLeft: 10,  // left offset of the symbol or number for order lists
      paddingLeft: 30,       // padding left of the text ignoring symbol and number
      marginBottom: 10,      // space after list item (this space doesn't sum up with list marginBottom)
    },
    table:{
      borderColor: 0xdfe2e5FF,
      borderWidth: 1,
      rowBackgrounColor: [0xFFFFFFFF, 0xf6f8faFF ], // row background
      marginBottom: 20, // table margin Bottom
    },
    'table-header':{
      font: 'BOLD',
      textColor: 0x000000FF,
      pixelSize: 16,
    },
    'table-cell':{
      font: 'REGULAR',
      textColor: 0x1e1e1eFF,
      pixelSize: 16,
      paddingRight: 16, // cell padding right 
      paddingLeft: 16, // cell padding left
      paddingTop: 6, // cell padding top
      paddingBottom: 6, //cell padding bottom
    },

    // INLINE level block
    text: {                  // no specific style for regular inline text
    },
    link:{
      textColor: 0x2e62b2ff,
      activeColor: 0x1e3e72ff,
      activeBorderWidth: 2,
      activeBorderColor: 0x2276e4ff,
    },
    em: {                    // emphasis text (italic)
      font: 'ITALIC',
    },
    strong: {                // strong text (bold)
      font: 'BOLD',
    },
    underline:{
      height: 1,
      fillColor: 0x000000ff,
    },
    codespan: {              // inline code text (monospace)
      font: 'MONOSPACE',
    },
    del:{
      height: 1,
      fillColor: 0x000000ff,
    }
  },
};
