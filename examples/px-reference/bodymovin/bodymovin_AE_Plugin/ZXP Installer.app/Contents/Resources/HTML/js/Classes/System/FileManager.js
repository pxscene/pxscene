
/*
 *	File Manager
 */

function FileManager()
{
	;
}

//	File operations

FileManager.prototype.has = function (path)
{
	return window.external.hasFile(path);
}

FileManager.prototype.create = function (path)
{
	log("File::Create<br>SRC: <b>" + path);
	return window.external.createFile(path);
}

FileManager.prototype.delete = function (path)
{
	log("File::Delete<br>SRC: <b>" + path);
	return window.external.deleteFile(path);
}

FileManager.prototype.copy = function (source, destination)
{
	log("File::Copy<br>SRC: <b>" + source + "</b><br>DST: <b>" + destination + "</b>");
	return window.external.copyFile(source, destination);
}

//	File Contents

FileManager.prototype.read = function (path)
{
	log("File::Read<br>SRC: <b>" + path);
	return window.external.readFile(path);
}

//	Zip

FileManager.prototype.unzip = function (path)
{
	var dst =  window.external.unzipFile(path);
	log("File::Copy<br>SRC: <b>" + path + "</b><br>DST: <b>" + dst + "</b>");
	return dst;
}
