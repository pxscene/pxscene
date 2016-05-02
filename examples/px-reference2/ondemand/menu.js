// Scene that renders a list of gallery rows

px.import({
    http: 'http',
    Url:'url',
    scene: 'px:scene.1.js',
    color: 'module/color.js',
    galleryRow: 'module/gallery_row.js',
    tileDataSource: 'module/tile_data_source.js',
    listContainer: 'module/list_container.js',
    MenuClient: 'client/menu_client.js',
    MenuMap:'client/menu_map.js', KeyCodes:"enums/keycodes.js",
    ProgramListMap:'client/programlist_map.js', Color:"enums/colors.js",
    SubMenuMap:'client/submenu_map.js', fontStore:"utils/fontstore.js",
    customComponents:"widgets/customcomponents.js",stylesheets:"styles/stylesets.js"
}).then(function importsAreReady(imports) {
    // Global configuration
    var arsResponse = '{"resolveAvailabilityResponse":{"adZone":"comcast:merlin:Region:8495212051926249172","availabilityGroups":[{"availabilities":["comcast:merlin:Location:5882676955034868110"],"productContext":"comcast:merlin:ProductContext:7013566886215080174","scope":"station"},{"availabilities":["comcast:merlin:Location:5931695747941653110"],"productContext":"comcast:merlin:ProductContext:6036846939271877174","scope":"station"},{"availabilities":["comcast:merlin:Location:5882676955034868110","comcast:merlin:Location:5931695747941653110"],"scope":"channel"},{"availabilities":["comcast:merlin:Region:5212395315150519172","comcast:merlin:Region:5811340667430388172","comcast:merlin:Region:6590783032951582172","comcast:merlin:Region:6877073030443335172"],"scope":"stream"},{"availabilities":["comcast:merlin:Location:4681152428903034110","comcast:merlin:Location:6417034932495404110","comcast:merlin:Location:6537074518960321110"],"productContext":"comcast:merlin:ProductContext:7013566886215080174","scope":"vod"},{"availabilities":["comcast:merlin:Location:4681152428903034110","comcast:merlin:Location:6417034932495404110","comcast:merlin:Location:6537074518960321110"],"productContext":"comcast:merlin:ProductContext:7013566886215080174","scope":"offer"},{"availabilities":["comcast:merlin:Location:4681152428903034110","comcast:merlin:Location:6417034932495404110","comcast:merlin:Location:6537074518960321110"],"scope":"menu"}],"distributionModeZone":"IP","recorderManager":"comcast:RecorderManager:cdvr-vbn-m-rmID-nwca01","version":"2.2.0","timeRegion":"US/Eastern","schema":"1.5"}}';
    var ANIMATION_SPEED = 0.25;
    var LIST_YOFFSET = 108;

    var Url = imports.Url;
    var color = imports.color;
    var scene = imports.scene;
    var listView;
    var GalleryRow = imports.galleryRow;
    var ListContainer = imports.listContainer;
    var TileDataSource = imports.tileDataSource;    
    var http = imports.http;
    var fontStore = imports.fontStore;
    var KeyCode = imports.KeyCodes.KeyCode;

    var onDemandMenuList = [];
    var listContainer;
    var currentWidget;


    // Add custom component definitions so that they case be used with scene.create({t:<customType>
    scene.addComponentDefinitions(imports.customComponents);

    console.log("menu - start - wait for fonts to load");

    fontStore.onLoadFinished(function onReady() {
          // Successfully downloaded all fonts - now move on to create the scene
          console.log("menu - loaded all fonts");
          init();
      },
      function onFontLoadingFailure() {
          console.error("menu.js: One or more fonts failed to load");
      });

    function buttonFocused(sourceContext, userContext) {
        console.log("\n\nButtonFocused Callback");
        console.log("   sourceContext=" + sourceContext);
        console.log("   userContext=" + userContext);
        //showObject("sourceContext", sourceContext);
        //showObject("userContext", userContext);

        listContainer.removeComponents();

        listView = scene.create({
            t: 'rect',
            parent: scene.root,
            fillColor: 0x000000ff,
            x: 40,
            y: LIST_YOFFSET,
            w: 1280,
            h: 720
        });

        console.log("Selected Index=" + userContext);
        var urls = [];
        onDemandMenuList[userContext].items.forEach(function (item) {
            //console.log("      Movie: " + item.url + ", url=" + item.url);
            urls.push({
                title: item.title,
                url: item.url
            });
        });

        displayMenu(urls);
    }

    function displayMenu(galleryRowUrlList) {
        Promise.all(galleryRowUrlList.map(getSubMenu))
          .then(function (results) {

              var rowY = 0;
              var rowHeight = 400;
              var rows = [];

              for (var i = 0; (i < results.length && i < 5); i++) {

                  var model = results[i];

                  if (model.length > 0) {
                      //console.log("       GalleryRow: title=" + galleryRowUrlList[i].title);
                      var row = new GalleryRow(scene, {
                            rowHeight: rowHeight,
                            title: galleryRowUrlList[i].title,
                            titleColor: color.ALMOST_WHITE,
                            titleHeight: 36,
                            initialIndex: 0,
                            stickyIndex: 2,
                            padding: 16,
                            scaleFactor: 1.16,
                            animationSpeed: ANIMATION_SPEED,
                            rect: scene.create({
                                t: 'rect',
                                parent: listView,
                                x: 0,
                                y: rowY,
                                h: rowHeight
                            })
                        },
                        new TileDataSource(scene, color, model)
                      );

                      rows.push(row);

                      rowY += rowHeight;
                  }
              }

              listContainer = new ListContainer(scene, {
                  initialIndex: 0,
                  stickyIndex: 0,
                  yOffset: LIST_YOFFSET,
                  rowHeight: 400,
                  animationSpeed: ANIMATION_SPEED,
                  rect: listView,
                  items: rows
              });

              ///listContainer.focus();

          }, function (err) {
              console.log(err);
          });


    }

    function getSubMenu(submenuUrl) {
        return new Promise(function (resolve, reject) {
            var request = imports.Url.parse(submenuUrl.url, true);
            var url = request.query.url;
            var type = request.query.type;

            var client = new imports.MenuClient(http, arsResponse);
            client.getMenuByUrl(imports.Url.parse(url), function (menu) {

                if (type === 'EditorialCollection') {
                    resolve(new imports.ProgramListMap(menu.menuItems, 180, 240));
                } else if (type === 'SubMenu') {
                    resolve(new imports.SubMenuMap(menu.menuItems, 360, 240));
                } else {
                    reject("unknown type" + type);
                }
            });
        });

    }

    function init() {

        var navbar = scene.create({
            t: "navbar",
            x: 40,
            y: 30,
            w: scene.root.w,
            h: 30,
            direction: "horizontal",
            alignment: "left",
            enabled: false,
            class: "HeaderNavBar",
            parent: scene.root,
            buttons: [
                {label: "TV", onSelection: {callback: buttonFocused.bind(this), userContext: 0}},
                {label: "Movies", onSelection: {callback: buttonFocused.bind(this), userContext: 1}},
                {label: "Kids", onSelection: {callback: buttonFocused.bind(this), userContext: 2}},
                {label: "News", onSelection: {callback: buttonFocused.bind(this), userContext: 3}},
                {label: "Networks", onSelection: {callback: buttonFocused.bind(this), userContext: 4}},
                {label: "Music", onSelection: {callback: buttonFocused.bind(this), userContext: 5}},
                {label: "Latino", onSelection: {callback: buttonFocused.bind(this), userContext: 6}},
                {label: "Web", onSelection: {callback: buttonFocused.bind(this), userContext: 7}},
                {label: "Streampix", onSelection: {callback: buttonFocused.bind(this), userContext: 8}},
                {label: "Sports & Fitness", onSelection: {callback: buttonFocused.bind(this), userContext: 9}},
                //{label: "Black Film & TV", onSelection: {callback: null, userContext: "<hit>"}},
                //{label: "Multicultural", onSelection: {callback: null, userContext: "<hit>"}},
                //{label: "XFINITY Services", onSelection: {callback: null, userContext: "<press>"}}
            ]
        });

        ///navbar.focus = true;
        currentWidget = navbar;

        listView = scene.create({
            t: 'rect',
            parent: scene.root,
            fillColor: 0x000000ff,
            x: 40,
            y: LIST_YOFFSET,
            w: 1280,
            h: 720
        });

        scene.root.focus = true;
        navbar.focus();
        //listView.focus = true;

        var root = {
            title: 'root',
            url: px.appQueryParams.rootMenuUrl
        };

        getOnDemandMenuItems(function (menuData) {
            var menuMap = new imports.MenuMap(menuData, 'http://' + "localhost:3000" + '/data/submenu');
            ///showObject("MenuMap", menuMap);

            for (var i = 0; i < menuMap.length; i++) {
                //console.log("      MenuItem: " + menuMap[i].title );
                onDemandMenuList.push(menuMap[i]);
            }

            var initialUrls = [];
            menuMap[0].items.forEach(function (item) {
                ///console.log("      Movie: " + item.url + ", url=" + item.url);
                initialUrls.push({
                    title: item.title,
                    url: item.url
                });
            });

            displayMenu(initialUrls);

        });

        function getType(thing) {
            if (thing === null)return "[object Null]"; // special case
            return Object.prototype.toString.call(thing);
        }


        function doHttpGet(url) {

            return new Promise(function (resolve, reject) {
                http.get(url.url, function (res) {
                    res.setEncoding('utf8');
                    var str = '';
                    res.on('data', function (chunk) {
                        str += chunk;
                    });
                    res.on('end', function (chunk) {
                        resolve(JSON.parse(str));
                    });
                });
            });
        }

        function getOnDemandMenuItems(rootCallback) {
            // Root menu
            var url = 'http://udbbrs.g.comcast.net:9096/menu/alias/x2-root?schema=3.0&client=XRE%3AX2&filter.image.gid=9218902759746521161%2C8580885346555644161%2C7020167223608802161%2C7171039184798784161&language=eng';

            var client = new imports.MenuClient(http, arsResponse);
            client.getMenu(imports.Url.parse(url)).then(function (menu) {
                var urls = menu.menuItems.map(function (item) {
                    return Url.parse(item.url);
                });

                Promise.all(urls.map(client.getMenu))
                  .then(function (response) {
                      ///reply(new MenuMap(response, 'http://' + host + '/data/submenu')).header('Content-Type', 'application/json');
                      rootCallback(response);
                  }, function (err) {
                      console.log(err);
                      rootCallback(null);
                  });

            }).catch(function (err) {
                console.log('Error getting root', error);
                ///reply().code(500);
                rootCallback(null);
            });

        }

        function getRoot(rootCallback) {
            // Root menu
            var url = 'http://udbbrs.g.comcast.net:9096/menu/alias/x2-root?schema=3.0&client=XRE%3AX2&filter.image.gid=9218902759746521161%2C8580885346555644161%2C7020167223608802161%2C7171039184798784161&language=eng';

            var client = new imports.MenuClient(http, arsResponse);
            client.getMenu(imports.Url.parse(url)).then(function (menu) {
                var urls = menu.menuItems.map(function (item) {
                    return Url.parse(item.url);
                });

                Promise.all(urls.map(client.getMenu))
                  .then(function (response) {
                      ///reply(new MenuMap(response, 'http://' + host + '/data/submenu')).header('Content-Type', 'application/json');
                      rootCallback(response);
                  }, function (err) {
                      console.log(err);
                      rootCallback(null);
                  });

            }).catch(function (err) {
                console.log('Error getting root', error);
                ///reply().code(500);
                rootCallback(null);
            });

        }

        function showObject(name, obj) {
            console.log("      showObject(" + name + "):");
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    console.log("          obj." + prop + " = " + obj[prop]);
                }
            }
        }

        scene.root.on('onKeyDown', function(e) {
            var keyHandlerRtnValue;
            console.log("MenuRoot#onKeyDown: code=" + e.keyCode + ", flags=" + e.flags);

            if( currentWidget === navbar ) {
                keyHandlerRtnValue = navbar.handleKeyDown(e.keyCode);
                console.log("   navbar keyhandler returns " + keyHandlerRtnValue);
                console.log("       e.keyCode=" + e.keyCode + ", keyCode.DOWN=" + KeyCode.DOWN);
                if( keyHandlerRtnValue === -1 && e.keyCode === KeyCode.DOWN) {
                    console.log("set currentWidget to listContainer: " + listContainer);
                    currentWidget = listContainer;
                    console.log("blur navbar");
                    navbar.blur();
                    console.log("focus listContainer");
                    listContainer.focus();
                    console.log("hide navbar");
                    navbar.visible(false);
                }
            } else {
                keyHandlerRtnValue = listContainer.handleKeyDown(e.keyCode);
                if( keyHandlerRtnValue === -1 && e.keyCode === KeyCode.UP) {
                    currentWidget = navbar;
                    listContainer.blur();
                    navbar.focus();
                    navbar.visible(true);
                }
            }

            switch(e.keyCode) {
                case KeyCode.LEFT:
                    console.log("   LEFT");
                    break;
                case KeyCode.RIGHT:
                    console.log("   RIGHT");
                    break;
                case KeyCode.UP:
                    console.log("   UP");
                    break;
                case KeyCode.DOWN:
                    console.log("   DOWN");
                    break;
            }
        });

    } // end of init

});


    
