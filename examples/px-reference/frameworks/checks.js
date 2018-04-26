px.import("px:scene.1.js").then( function ready(scene) {


var root = scene.root;

module.exports.checkType = function(type) {
    try{
        var test = scene.create({t:type});
        return true;
    } catch(error) {
        return false;
    }
}


}).catch( function importFailed(err){
  console.error("Import failed for checks.js: " + err)
});