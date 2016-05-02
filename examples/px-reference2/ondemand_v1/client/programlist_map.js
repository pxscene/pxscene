// Maps a menu web service program list to a lighter weight model for the UI (titles and urls)
var ProgramListMap = function(programlist, width, height) {

    return programlist.map(function(program) {
        return {
            title: program.title,
            imageUrl: selectImage(program.images, width, height),
            programId: program.programId,
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

module.exports = ProgramListMap;
