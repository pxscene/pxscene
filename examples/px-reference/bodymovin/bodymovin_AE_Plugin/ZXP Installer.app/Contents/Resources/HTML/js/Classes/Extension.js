
/*
 *	Extension
 */

function Extension(id, name, path, version, prefs, enabled)
{
    this.id = id;
	this.name = name;
    this.path = path;
	this.version = version;
	this.prefs = prefs;
	this.enabled = enabled;
    this.registered = true;
}

function VirtualExtension(id, name, path, version, prefs)
{
	this.virtual = true;
    Extension.call(this, id, name, path, version, prefs, true);
}

extend(Extension, VirtualExtension);


