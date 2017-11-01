
/*
 *	ZXP
 */

function updateZXPList(data)
{
	dialogMng.close();
	zxpMng.update(data);
}

function installZXP(name)
{
	zxpMng.install(name);
}

function customInstallZXP(name)
{
	dialogMng.confirmCustomInstall(name);
}

/*
 *	Dialog
 */

function closeDialog(name)
{
	dialogMng.close();
}

function onInstalling(name)
{
	dialogMng.onInstalling(name);
}

function onInstallation(name, mistake)
{
	dialogMng.onInstallation(name, mistake);
}


/*
 *	Error
 */

function error(value, msg, installError)
{
	errMng.show(value, msg, installError);
}
