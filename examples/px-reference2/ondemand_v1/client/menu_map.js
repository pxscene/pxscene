// Maps a menu web service response to a lighter weight model for the UI (titles and urls)
var MenuMap = function(menu, baseUrl) {

    return menu.map(function(submenu) {
        return {
            title: submenu.title,
            items: submenu.menuItems.filter(function(item){
                // exclude personalized menus
                return !item.personalized && (item.menuContentsType === 'EditorialCollection' || item.menuContentsType === 'SubMenu');
            }).map(function(item) {
                return {
                    title: item.title,
                    url: baseUrl + '?url=' + encodeURIComponent(item.url + '&items.paging=1-12') + '&type=' + encodeURIComponent(item.menuContentsType)
                }
            })
        }
    });
};

module.exports = MenuMap;
