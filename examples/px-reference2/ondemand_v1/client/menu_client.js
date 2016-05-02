
function showObject(name, obj) {
    console.log("      " + name + ":");
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            console.log("          obj." + prop + " = " + obj[prop]);
        }
    }
}

// Menu web service client for getting menus and program lists
var MenuClient = function(http, arsResponse) {
    var postData = 'ars=' + arsResponse;

    return {

        getMenuByUrl: function(url, callback) {

            var options = {
                host: url.hostname,
                port: url.port,
                path: url.path,
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                }
            };

            doPost(options, callback, postData);
        },

        getMenu: function(url) {
            return new Promise(function(resolve, reject) {
                var options = {
                    host: url.hostname,
                    port: url.port,
                    path: url.path,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    }
                };

                doPost(options, function(response) {
                    resolve(response);
                }, postData);
            });
        }
    }
    
    function doPost(options, callback, postData) {

        var theConsole = console;
        var post_req = http.request(options, function(res) {
            res.setEncoding('utf8');
            var str = '';
            res.on('data', function(chunk) {
                str += chunk;
            });
            res.on('end', function(chunk) {
                ///console.log("Post response for " + options.path + ", resp=" + str);
                callback(JSON.parse(str));
            });
            post_req.on('error', function(err){console.log("Error: FAILED to read file[" + options.path + "] from web service");});
        });

        // post it
        post_req.write(postData);
        post_req.end();
    }
};

module.exports = MenuClient;
