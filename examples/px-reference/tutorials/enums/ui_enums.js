/**
 * Created by tjcarroll2
 * on 2/23/16.
 */

Color = {RED:0xff0000ff, GREEN:0x00ff00ff, BLUE:0x0000ffff, CYAN:0x00ffffff,
  YELLOW:0xffff00ff, GRAY:0xff0000ff, WHITE:0xffffffff, BLACK:0x0c0c0cff};

FocusType = {HOVER:0, SELECTION:1};

HorizontalAlignment = {LEFT:0, CENTER:1, RIGHT:2};
VerticalAlignment = {TOP:0, CENTER:1, BOTTOM:2};

module.exports = {FocusType:FocusType, HorizontalAlignment:HorizontalAlignment, VerticalAlignment:VerticalAlignment,
                 Color:Color};