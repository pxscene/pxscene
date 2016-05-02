// Scene that renders a list of gallery rows
px.configImport({
    'x2:': 'http://{{host}}/module/',
    'scene://': 'http://{{host}}/scene/'
});

px.import({
    http: 'http',
    scene: 'px:scene.1.js',
    color: 'x2:color',
    galleryRow: 'x2:gallery_row',
    tileDataSource: 'x2:tile_data_source',    
    listContainer: 'x2:list_container'   
}).then(function importsAreReady(imports) {
        
    var color = imports.color;
    var scene = imports.scene;
    var GalleryRow = imports.galleryRow;
    var ListContainer = imports.listContainer;
    var TileDataSource = imports.tileDataSource;    
    var http = imports.http;
    
    var listView = scene.createRectangle({
        parent: scene.root,
        x: 50,
        y: 50
    });

    var root = {
        title: 'root',
        url: '{{rootMenuUrl}}'
    };    
    
    console.log("menu for root url=" + root.url);    
    
    doHttpGet(root).then(function(menus) {
                
        var urls = [];
        for (var i = 0; i < menus.length; i++) {
            if (menus[i].title === 'Movies') {
                menus[i].items.forEach(function(item){
                    console.log('menu for item=' + item);
                    urls.push({
                        title: item.title,
                        url: item.url
                    }); 
                });
            }            
        }      
        
        console.log(urls);
        
        Promise.all(urls.map(doHttpGet))
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
                            rect: scene.createRectangle({
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
});


    
