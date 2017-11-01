
/*
 *	DialogManager Extension
 */



DialogManager.prototype.onUpdate = function()
{
	var id = 'onUpdate';
	this.init(id, null, true);
	this.open();
}

//	Greetings

DialogManager.prototype.greet = function()
{
	var text = "";
    
	switch (system.OS)
	{
		case System.WIN:
			text = "In order to install a ZXP file, open it from the application's menu (<b>Ctrl+O</b>)";
			break;
		case System.MAC:
			text = "In order to install a ZXP file, drag it onto this window or open it from the application's menu (<b>Cmd+O</b>)";
			break;
	}
	
	this.alert(text);
}

//	Dialogs

DialogManager.prototype.onReset = function()
{
    var id = 'onReset';
    this.init(id, function ()
              {
                zxpMng.fullReset();
                return false;
              });
    this.open();
}

DialogManager.prototype.onInstallation = function(name, mistake)
{
	if (!!mistake)
	{
		dialogMng.alert("Some errors were encountered while installing <b>" + name + "</b>.<br><br>Please restart the application and try again.<br>If the application requires authorization to install a product, make sure you enter your password correctly.");
	}
	else 
	{
		dialogMng.alert( (  name && name.length  ?  "<b>" + name + "</b>" : "The extension"  ) + " was successfully installed!", function () { window.external.updateUI(); }, true);
	}
}

DialogManager.prototype.onInstalling = function(fileName)
{
	var id = 'onInstalling';
	this.init(id);
	var div = this.getDialogTextDiv(id);
	div.innerHTML = fileName;
	this.open();
}

DialogManager.prototype.confirmCustomInstall = function(name)
{
	var id = 'confirmCustomInstall';
	this.init(id, function ()
			  {
				zxpMng.customInstall(name, parseInt(document.getElementById('ks_dialog_installation_custom_type').value));
				return false;
			  });
	this.open();
}

DialogManager.prototype.confirmRemoval = function(ext)
{
	var id = 'confirmRemoval';
	this.init(id, function ()
			  {
                if (!ext.virtual)
                {
                    window.external.removeZXP(ext.id);
                }
                else
                {
                    system.file.delete(ext.path);
                    window.external.updateUI();
                }
			  });
	var div = this.getDialogTextDiv(id);
	div.innerHTML = ext.name;
	this.open();
}

DialogManager.prototype.confirmClear = function(ext)
{
	var id = 'confirmClear';
	this.init(id, function ()
			  {
				  zxpMng.clearZXP(ext.prefs);
			  });
	var div = this.getDialogTextDiv(id);
	div.innerHTML = ext.name;
	div = this.getDialogDiv(id, 'prefs');
	div.innerHTML = ext.prefs.join("<br>");
	this.open();
}
