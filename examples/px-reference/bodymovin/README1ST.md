# Bodymovin pxscene support

## Background

Support for the "playback" of Adobe After Effects designed animated scenes 
in `pxscene` is provided by Bodymovin.
<br/>

Bodymovin is a Open Source plugin for Adobe After Effects, combined with 
JavaScript code to render the animated scene - typically in a Web Browser.

<br/>
This (initial) 'fork' of the Bodymovin player code is for development of 
support for `pxscene` as a player.

<br/>

## After Effects Plugin

Install the `bodymovin/bodymovin_AE_Plugin/Bodymovin_4_6_3.zxp` plugin for 
Adobe After Effects.

`ZXP Installer` can be used to install this .zxip file.

For more information see - https://aescripts.com/bodymovin/


<br/>

## `pxscene` player

The only file you'll need in your pxApp is `bodymovin/test_BallEase/bodymovin.1.js`

See the full `bodymovin/test_BallEase` example for setup of a "container" 
element in `pxscene` to which the After Effects animation will be achored.

<br/>
<br/>
The `bodymovin/test_BallEase/README.md` has complete instructions to allow the
player code `bodymovin.1.js` to be rebuilt using the `bodymovin_player` folder.
<br/>
