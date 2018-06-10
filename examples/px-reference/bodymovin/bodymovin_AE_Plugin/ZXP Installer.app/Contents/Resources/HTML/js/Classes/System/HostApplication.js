
/*
 *	Host Application
 */

function HostApplication(path, versions, plugins, scripts)
{
	this.path = path;
	this.versions = versions;
	this.plugins = plugins;
	this.scripts = scripts;
	
	//	Check if app is installed
	this.isInstalled = system.file.has(this.path);
}


HostApplication.data =
{
	'Adobe' : {
		'AE' : new AdobeApplication('After Effects',
									[new Version(8,		'CS3'),
									 new Version(9,		'CS4'),
									 new Version(10,	'CS5'),
									 new Version(10.5,	'CS5.5'),
									 new Version(11,	'CS6'),
									 new Version(12,	'CC'),
									 new Version(13,	'CC 2014'),
									 new Version(13.5,	'CC 2015')],
									'Plug-ins',
									'Scripts'
									);
		'PR' : new AdobeApplication('Permiere Pro',
									[new Version(3,		'CS3'),
									 new Version(4,		'CS4'),
									 new Version(5,		'CS5'),
									 new Version(5.5,	'CS5.5'),
									 new Version(6,		'CS6'),
									 new Version(7,		'CC'),
									 new Version(8,		'CC 2014'),
									 new Version(9,		'CC 2015')],
									null,
									null
									);
	}
};