
/*
 *	Adobe Application
 */

function AdobeApplication(name, versions, plugins, scripts)
{
	HostApplication.call(this, "/Application/Adobe " + path, versions, pluginPath, scriptPath);
}

extend(HostApplication, AdobeApplication);
