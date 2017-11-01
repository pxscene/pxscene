# bodymovin pxscene support

Support for playback of Bodymovin JSON exports via the `bodymovin.1.js` plugin file.

<br/>

# Plugin build for pxScene

Within 'bodymovin/bodymovin_player' folder.

  >  npm install
  >  gulp

This will build 'bodymovin.1.js' within `bodymovin/bodymovin_player/build/player`

# Plugin build for pxScene

1) Import Bodymovin JSON animations you only have to import the 'bodymovin.1.js' 
within your *pxApp*.

Example:

```
px.import({     scene: 'px:scene.1.js',
            bodymovin: 'bodymovin.1.js'              //    <<<<<  IMPORT
}).then( function importsAreReady(imports)
{

```

2) Create a container element to anchor the Bodymovin content.

```
    var bmContainer = new containerElement();
```

3) Create an import configuration object with a reference to our container element

```
    var animData1 =
    {
        renderer:  'pxscene',
        loop:     true,
        autoplay: true,
        rendererSettings: {
            progressiveLoad: false
        },
        path:     jsonFile,
        wrapper:  bmContainer
    };
```

4) Load the animation from the JSON file.


```
    var testBM = {};

    testBM = Bodymovin.loadAnimation(animData1);
```

5) Play the animation

```
  testBM.play();
```
