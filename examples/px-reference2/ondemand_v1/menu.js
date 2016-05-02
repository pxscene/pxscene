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
    MenuMap:'client/menu_map.js',
    ProgramListMap:'client/programlist_map.js',
    SubMenuMap:'client/submenu_map.js'
}).then(function importsAreReady(imports) {
    // Global configuration
    var arsResponse = '{"resolveAvailabilityResponse":{"adZone":"comcast:merlin:Region:8495212051926249172","availabilityGroups":[{"availabilities":["comcast:merlin:Location:5882676955034868110"],"productContext":"comcast:merlin:ProductContext:7013566886215080174","scope":"station"},{"availabilities":["comcast:merlin:Location:5931695747941653110"],"productContext":"comcast:merlin:ProductContext:6036846939271877174","scope":"station"},{"availabilities":["comcast:merlin:Location:5882676955034868110","comcast:merlin:Location:5931695747941653110"],"scope":"channel"},{"availabilities":["comcast:merlin:Region:5212395315150519172","comcast:merlin:Region:5811340667430388172","comcast:merlin:Region:6590783032951582172","comcast:merlin:Region:6877073030443335172"],"scope":"stream"},{"availabilities":["comcast:merlin:Location:4681152428903034110","comcast:merlin:Location:6417034932495404110","comcast:merlin:Location:6537074518960321110"],"productContext":"comcast:merlin:ProductContext:7013566886215080174","scope":"vod"},{"availabilities":["comcast:merlin:Location:4681152428903034110","comcast:merlin:Location:6417034932495404110","comcast:merlin:Location:6537074518960321110"],"productContext":"comcast:merlin:ProductContext:7013566886215080174","scope":"offer"},{"availabilities":["comcast:merlin:Location:4681152428903034110","comcast:merlin:Location:6417034932495404110","comcast:merlin:Location:6537074518960321110"],"scope":"menu"}],"distributionModeZone":"IP","recorderManager":"comcast:RecorderManager:cdvr-vbn-m-rmID-nwca01","version":"2.2.0","timeRegion":"US/Eastern","schema":"1.5"}}';

    var Url = imports.Url;
    var color = imports.color;
    var scene = imports.scene;
    var GalleryRow = imports.galleryRow;
    var ListContainer = imports.listContainer;
    var TileDataSource = imports.tileDataSource;    
    var http = imports.http;

    var listView = scene.create({
		t:'rect',
        parent: scene.root,
		fillColor:0x000000ff, 
        x: 50,
        y: 50,
		w: 1280,
		h: 720
    });

    scene.root.focus = true;
    listView.focus = true;

    var root = {
        title: 'root',
        url: px.appQueryParams.rootMenuUrl
    };    

    getRoot(function(menuData) {
        console.log("Got root data");
        var menuMap = new imports.MenuMap(menuData, 'http://' + "localhost:3000" + '/data/submenu');

        var urls = [];
        for (var i = 0; i < menuMap.length; i++) {
            if (menuMap[i].title === 'Movies') {
                menuMap[i].items.forEach(function(item){
                    console.log("  movie: " + item.title);
                    urls.push({
                        title: item.title,
                        url: item.url
                    });
                });
            }
        }

        Promise.all(urls.map(getSubMenu))
          .then(function(results) {

              var rowY = 0;
              var rowHeight = 400;
              var rows = [];

              for (var i = 0; i < results.length; i++) {

                  var model = results[i];

                  if (model.length > 0) {
                      var row = new GalleryRow(scene, {
                            title: urls[i].title,
                            titleColor: color.ALMOST_WHITE,
                            titleHeight: 36,
                            initialIndex: 0,
                            stickyIndex: 2,
                            padding: 16,
                            scaleFactor: 1.16,
                            animationSpeed: 0.25,
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

              var list = new ListContainer(scene, {
                  initialIndex: 0,
                  stickyIndex: 0,
                  rowHeight: 400,
                  animationSpeed: 0.25,
                  rect: listView,
                  items: rows
              });

              list.focus();

          }, function(err) {
              console.log(err);
          });


    });

    function getType(thing){
        if(thing===null)return "[object Null]"; // special case
        return Object.prototype.toString.call(thing);
    }


    function doHttpGet(url) {

        return new Promise(function(resolve, reject) {
            http.get(url.url, function(res) {
                res.setEncoding('utf8');
                var str = '';
                res.on('data', function(chunk) {
                    str += chunk;
                });
                res.on('end', function(chunk) {
                    resolve(JSON.parse(str));
                });
            });
        });
    }

    function getSubMenu(submenuUrl) {
        return new Promise(function(resolve, reject) {
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

    function getRoot(rootCallback) {
        // Root menu
        var url = 'http://udbbrs.g.comcast.net:9096/menu/alias/x2-root?schema=3.0&client=XRE%3AX2&filter.image.gid=9218902759746521161%2C8580885346555644161%2C7020167223608802161%2C7171039184798784161&language=eng';

        var client = new imports.MenuClient(http, arsResponse);
        client.getMenu(imports.Url.parse(url)).then(function(menu) {
            var urls = menu.menuItems.map(function(item) {
                return Url.parse(item.url);
            });

            Promise.all(urls.map(client.getMenu))
              .then(function(response) {
                  ///reply(new MenuMap(response, 'http://' + host + '/data/submenu')).header('Content-Type', 'application/json');
                  rootCallback(response);
              }, function(err) {
                  console.log(err);
                  rootCallback(null);
              });

        }).
        catch (function(err) {
            console.log('Error getting root', error);
            ///reply().code(500);
            rootCallback(null);
        });

    }

    function showObject(obj) {
        console.log("      showObject:")
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                console.log("          obj." + prop + " = " + obj[prop]);
            }
        }
    }

});


    
