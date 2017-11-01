
/*
 *	Application
 */

function Application(name)
{
	this.name = name;
	this.extensions = new Array();
}

Application.prototype.add = function(extension)
{
	this.extensions.push(extension);
}

