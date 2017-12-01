
function System()
{
	this.file = new FileManager();
	
	//	OS
	if (navigator.appVersion.indexOf("Win")!=-1)
	{
		this.OS = System.WIN;
	}
	else if (navigator.appVersion.indexOf("Mac")!=-1)
	{
		this.OS = System.MAC;
	}
	else
	{
		this.OS = 0;
	}
}

System.WIN = 1;
System.MAC = 2;

System.prototype.isMac = function()
{
	return this.OS === System.MAC;
}
System.prototype.isWindows = function()
{
	return this.OS === System.WIN;
}

System.prototype.open = function(url)
{
	window.external.openURL(url);
}

System.prototype.run = function(cmd)
{
	window.external.rumCommand(cmd);
}