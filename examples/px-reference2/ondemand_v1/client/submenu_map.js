// Maps a menu web service program list to a lighter weight model for the UI (titles and urls)
var SubMenuMap = function(submenus, width, height) {

    return submenus.map(function(submenu) {
        return {
            imageUrl: selectImage(submenu.images, width, height),
            width: width,
            height: height
        }
    });
    
    function selectImage(images, width, height) {
        if (images) {
            for (var i = 0; i < images.length; i++) {
                if (images[i].width === width && images[i].height === height) {
                    return images[i].url;
                }
            }
        }
        return null;
    }
};

module.exports = SubMenuMap;
