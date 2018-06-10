
/*
 *	ZXP Manager
 */

function ZXPManager()
{
	this.div = document.getElementById('ks_zxp_list');

	this.reset();
	
	this.awaken = false;
    
    this.runtimes = [];
    
    this.expanded = new Object();
    
    this.installedApps = 1;
    
    //  Setting to choose between showing all apps or only ones with extensions installed
    this.showAllApps = false;
}

//	Utils

ZXPManager.prototype.hasHost = function(name, version)
{
	var path = "Adobe " + name + " " + version;
	
	if (system.isMac())
	{
		;
	}
	else
	{
		path = "C:/Program Files/Adobe/" + path + "/Support Files/AfterFX.exe";
	}
	
	return system.file.has(path);
}

//	List

ZXPManager.prototype.reset = function()
{
	this.apps = [];
	this.lastZXP = null;
    
    this.addApplication('Custom Installations');
}

ZXPManager.prototype.addApplication = function(name)
{
    log("Storing application <b>" + name + "</b>");
	this.apps.push(new Application(name));
}

ZXPManager.prototype.addExtension = function(id, version, enabled)
{
    log("Storing extension <b>" + id + "</b> (" + version + ")");

    var name = id;
	var path = null;
	var prefs = [];
    
	var index = this.apps.length-1;
    
    for (var i=0; i<this.apps[0].extensions.length; i++)
    {
        var ext = this.apps[0].extensions[i];
        if (ext.id === id)
        {
            name = ext.name;
			path = ext.path;
			prefs = ext.prefs;
            ext.registered = false;
        }
    }
    
    this.apps[index].add(new Extension(id, name, path, version, prefs, enabled));
}

ZXPManager.prototype.addVirtualExtension = function(id, name, path, version, prefs)
{
    this.apps[0].add(new VirtualExtension(id, name, path, version, prefs));
}

//	Update

ZXPManager.prototype.update = function(data)
{
	this.reset();
    
    /*
     *  From drive
     */
    
    //  TODO: update FileSystem class to handle list()
    var path = this.getInstallPath();
    log("Listing extensions installed for All Users:<br>" + path);
    var tmp = window.external.listFiles(path);
    if (tmp.length)
    {
        paths = tmp.split('|');
    }
    else
    {
        paths = new Array();
    }
    path = this.getInstallPath(true);
    log("Listing extensions installed for Current User:<br>" + path);
    tmp = window.external.listFiles(path);
    if (tmp.length)
    {
        paths = paths.concat(tmp.split('|'));
    }
    
    //  For all files
    for (var i=0; i<paths.length; i++)
    {
        var id = paths[i].split("/");
        id = id[id.length-2];
    
        if ( id.indexOf("CC") !== 0 && id.indexOf("com.adobe") !== 0 )
        {
			var version = "?";
			var name = id;
			var prefs = [];
			
            log("Extracting extension data:<br>" + paths[i]);
			
			try
			{
				var manifest = system.file.read(paths[i] + "CSXS/manifest.xml");

				if (manifest && manifest.length)
				{
					var exp_version = /ExtensionBundleVersion=\"([^\"]+)\"/;
					var groups = exp_version.find(manifest);
					if (groups.length > 0)
					{
						version = groups[1].text;
					}
				
					if (id.indexOf("com.") == 0)
					{
						var exp_name = /ExtensionBundleName=\"([^\"]+)\"/;
						groups = exp_name.find(manifest);
						if (groups.length > 0)
						{
							name = groups[1].text;
						}
						
						tmp = id.split(".");
						if (tmp.length > 3)
						{
							name += " (" + tmp[3] + ")";
						}
					}
					
					
					var exp_ids = /Extension Id="([^\"]+)"/;
					
					var groups = exp_ids.find(manifest);
					for (var j=1; j<groups.length; j++)
					{
						prefs.push(groups[j].text);
					}
					
					log("... " + name + " v." + version);
				}
				else
				{
					log("... could not read manifest");
				}
			}
			catch (err)
			{
				log("... could not access manifest");
			}
			
			this.addVirtualExtension(id, name, paths[i], version, prefs);
        }
    }
    
    /*
     *  From ExManCmd
     */
	
	//	Split the data into application-specific data
	data = data.replace(/\r\n/g, "\n").split("\n\n");
	
	//	Create search regex
	var countPattern = new RegExp("([0-9]+)[ ]");
	var appNamePattern = new RegExp("installed for ([^\n]+)");
	var extPaddingPattern = new RegExp("[^ ][ ]+([^ ]+)$");
	
	//	Parsing settings
	var appDataOffset = 3;	// Lines to skip before reaching an app's extensions list
	var extDataOffset = 12;	// Characters to skip before reaching an extension's name
	
	/*
	 *	CC2014
	 */

	if (this.hasHost("After Effects", "CC 2014"))
	{
		var found = false;
		
		for (var i=data.length-1; i >= 0 && !found; i--)
		{
			//	Extract number of extension
			var match = countPattern.exec(data[i]);
			
			//	Check regex result
			if (match)
			{
				//	Extract app name
				match = appNamePattern.find(data[i]);
				
				if (match)
				{
					var appName = match[1].text;
					
					found = appName.indexOf("After Effects") >= 0;
					if (found)
					{
						tmp = data[i].substring(0, match[1].index) + "After Effects CC 2014" + data[i].substring(match[1].index + match[1].length);
						data.insert(tmp, i+1);
					}
				}
			}
		}
	}
	
	/*
	 *	For each application ...
	 */

	for (var i=0; i<data.length; i++)
	{
		//	Extract number of extension
		var match = countPattern.exec(data[i]);
		
		//	Check regex result
		if (match)
		{
            this.installedApps ++;
            
			//	Convert first group to integer
			var count = parseInt(match[1]);
			
			if ( count > 0 || this.showAllApps )
			{
				//	Split the data for the current app
				var appData = data[i].split("\n");

				//	Extract app name
				match = appNamePattern.exec(appData[0]);
				
				if (match)
				{
					var appName = match[1];

					//	Prepare data for application
					this.addApplication(appName);
					
					/*
					 *	For each extension ...
					 */
					
					for (j=appDataOffset; j<appDataOffset+count; j++)
					{
						var extData = appData[j];
						
						var extEnabled = ( extData.charAt(0) !== 'D' );

						extData = extData.substr(extDataOffset);
						
						match = extPaddingPattern.exec(extData);
						
						if (match)
						{
							var extName = extData.substr(0, match.index+1);
							var extVersion = match[1];
							
							this.addExtension(extName, extVersion, extEnabled);
						}
					}
				}
			}
		}
	}
	
	/*
	 *	Update UI
	 */
	
	this.display();
}

//	UI

ZXPManager.prototype.display = function()
{
    log("Displaying ...");
                
	var code = '';
	
	/*
	 *	Runtime
	 */
	
	var runtimes = window.external.getCCPlayerRuntimes();
	if (runtimes && runtimes.length)
	{
        log("... Settings");
                
                
		runtimes = runtimes.split("|").sort();
        this.runtimes = runtimes;
        
        code += "<div class='ks_settings'>";
        
        code += "	<div class='ks_title' id='ks_settings_title'>Advanced Settings";
        code +=	"        <div class='ks_reveal' id='ks_reveal_settings' onclick='zxpMng.showAppExtensions(\"settings\")'>+</div>";
        code += "	</div>";
        
        code += "<div class='ks_hidden' id='ks_list_settings'>";
        
        code += "<br>";
        
		code += "   <div class='ks_title'>Enable Extensions Debugging</div>";
		for (var i=0; i<runtimes.length; i++)
		{
			var status = window.external.getCCPlayerDebugMode(runtimes[i]);
			code += "	<div id='ks_debug_" + runtimes[i] + "' class='ks_extension " + (  status  ?  '' : 'ks_disabled'  ) + "'>"
			code += "		<div class='ks_title'>";
			
			code += "	<input type='checkbox' class='ks_status' onclick='zxpMng.enableDebugging(\"" + runtimes[i] + "\", this.checked)' " + (  status  ?  'checked' : ''  ) + ">Version " + runtimes[i] + " Extensions</input>";
			
			code += "		</div>"
			code += "	</div>"
		}
        
        code += "           </div>"
        code += "       </div>"
        
        code += "   </div>";
        
        code += "</div>";
	}
	
	/*
	 *	Extensions
	 */
    
    log("... Applications");
	
	if (this.apps.length === 0)
	{
		code += "<div class='ks_application'>";
		code += "	<div class='ks_title'>No extensions found</div>";
		code += "</div>";
	}
    
	for (var i=0; i<this.apps.length; i++)
    {
        if ( this.apps[i].extensions.length || this.showAllApps )
        {
                
            log("...... " + this.apps[i].name);
                
            var divId = this.apps[i].name.replace(/ /g, '').replace(/\./g, '_');
            var isExpanded = !!this.expanded[divId];

            var appCode = "<div class='ks_application'>";
            appCode += "	<div class='ks_title'>";
            appCode +=	"        <div class='ks_reveal " + (  isExpanded  ?  "ks_hide" : ""  ) + "' id='ks_reveal_" + divId + "' onclick='zxpMng.showAppExtensions(\"" + divId + "\")'>+</div>";
            appCode += this.apps[i].name;
            appCode += "	</div>";
            appCode += "	<div class='" + (  isExpanded  ?  "" : "ks_hidden"  ) + "' id='ks_list_" + divId + "'>";
            
            var count = 0;
                
            for (var j=0; j<this.apps[i].extensions.length; j++)
            {
                if (this.apps[i].extensions[j].registered)
                {
                    count++;
                    
                    var enabled = this.apps[i].extensions[j].enabled;
                    var id = "status" + i + ":" + j;
                    
                    appCode += "	<div class='ks_extension " + (  enabled || !i  ?  '' : 'ks_disabled'  ) + "'>"
                    appCode += "		<div class='ks_buttons'>"
					appCode += "			<button class='button ks_button ks_button_small ks_noopacity " + (  this.apps[i].extensions[j].prefs.length  ?  "" : "ks_invisible"  ) + "' onclick='zxpMng.clear(" + i + ", " + j + ")'>Reset</button>";
                    appCode += "			<button class='button ks_button ks_button_small ks_noopacity' onclick='zxpMng.remove(" + i + ", " + j + ")'>Remove</button>";
                    appCode += "			<div class='ks_version'>"
                    appCode += this.apps[i].extensions[j].version;
                    appCode += "			</div>"
                    appCode += "		</div>"
                    appCode += "		<div class='ks_title'>"
                    
                    appCode += "			<input type='checkbox' class='ks_status " + (  i  ?  '' : 'ks_hidden'  ) + "' onclick='zxpMng.toggle(" + i + ", " + j + ")' " + (  enabled  ?  'checked' : ''  ) + ">";
                    
                    appCode += this.apps[i].extensions[j].name;
                    appCode += "		</div>"
                    appCode += "	</div>"
                }
            }
            
            
            if (!count)
            {
                appCode += "	<div class='ks_extension ks_disabled'>";
                appCode += "	<div class='ks_title'>No extensions found</div>";
                appCode += "	</div>";
            }
            
            appCode += "	</div>";
            
            appCode += "</div>";
                
            if ( count || this.showAllApps )
            {
                code += appCode;
            }
        }
        else
        {
            log("... " + this.apps[i].name + " <i>Skipped</i>")
        }
    }
                
    log("All done");
    
    code += "<br>";
	
	this.div.innerHTML = code;
	
	if (!this.awaken)
    {
                
        log("Wake up ...");
        
        //  there should be at least 2 apps: Others and Custom Installations
        if (this.installedApps > 2)
        {
            this.awaken = true;
            dialogMng.greet();
        }
        else
        {
            dialogMng.onReset();
        }
	}
}

//	List visibility

ZXPManager.prototype.showAppExtensions = function(id)
{
	var listDiv = $('#ks_list_' + id);
	var buttonDiv = $('#ks_reveal_' + id);
    
    this.expanded[id] = listDiv.hasClass('ks_hidden');

	if (this.expanded[id])
	{
		listDiv.removeClass('ks_hidden');
		buttonDiv.addClass('ks_hide');
	}
	else
    {
		listDiv.addClass('ks_hidden');
		buttonDiv.removeClass('ks_hide');
	}
}

//	Debugging

ZXPManager.prototype.enableDebugging = function(version, mode)
{
	window.external.setCCPlayerDebugMode(version, mode);
	
	var div = $('#ks_debug_' + version);

	if (mode)
	{
		div.removeClass('ks_disabled');
	}
	else
	{
		div.addClass('ks_disabled');
	}
}

//  Paths

ZXPManager.prototype.getInstallPath = function(userInstall)
{
	switch (system.OS)
	{
		case System.WIN:
			dstPath = (  userInstall  ?  "%USERPROFILE%/AppData/Roaming" : "C:/Program Files (x86)/Common Files"  ) + "/Adobe/CEP/extensions/";
			break;
		case System.MAC:
			dstPath = (  userInstall  ?  "~" : ""  ) + "/Library/Application Support/Adobe/CEP/extensions/";
			break;
	}
    return dstPath;
}

//	Bridge

ZXPManager.prototype.toggle = function(appIndex, extIndex)
{
	var ext = this.apps[appIndex].extensions[extIndex];

	window.external.toggleZXP(ext.name, !ext.enabled);
}

ZXPManager.prototype.remove = function(appIndex, extIndex)
{
	var ext = this.apps[appIndex].extensions[extIndex];
	dialogMng.confirmRemoval(ext);
}

ZXPManager.prototype.install = function(path)
{
	this.lastZXP = path;
}

ZXPManager.prototype.customInstall = function(zxpPath, userInstall)
{
	zxpPath = zxpPath || this.lastZXP;
	
	if (!!zxpPath)
	{
		var success = false;
		var mistake = false;

		//	Unzip zxp
		var path = system.file.unzip(zxpPath);
		var hasPath = path && path.length;
		var hasData = false;
		
		if (hasPath)
		{
			if (path[path.length-1] === '/')
			{
				path = path.substr(0, path.length-1);
			}
			var name = path.substr(path.lastIndexOf('/') + 1);
			
			//	Get the manifest
			var data = system.file.read(path + "/CSXS/manifest.xml");
			
			hasData = data && data.length;
			
			if (hasData)
			{
				var exp_id = /ExtensionBundleId=\"([^\"]+)\"/;
				var groups = exp_id.find(data);
                var id = groups[1].text;
                
                var exp_name = /ExtensionBundleName=\"([^\"]+)\"/;
                var groups = exp_name.find(data);
                name = groups[1].text;
				
				var exp_runtime = /RequiredRuntime Name=\"CSXS\" Version=\"([^\"]+)\"/;
				groups = exp_runtime.find(data);
				var runtime = parseInt(groups[1].text);
				
				var exp_host = /Host Name=\"([^\"]+)\" Version=\"([^\"]+)\"/g;
				
				while (groups = exp_host.find(data))
				{
					if (groups[1])
					{
						var host = groups[1].text;
						
						var dstPath = this.getInstallPath(userInstall);
						
						var status = system.file.copy(path, dstPath + id + "/");
						success |= status;
						mistake |= !status;
						
						if (host === 'PPRO')
						{
							//  At first, we were only enabling the target runtimaescriptse debug mode:
		//					window.external.setCCPlayerDebugMode(runtime.toString(), true);
							
							//  But we're now enabling them all:
							for (var i=0; i<this.runtimes.length; i++)
							{
								window.external.setCCPlayerDebugMode(this.runtimes[i], true);
							}
						}
					}
				}
			}
			else
			{
				;
			}
			
			//	Clean the unzipped zxp
			system.file.delete(path);
		}
		
		if (success)
		{
			dialogMng.onInstallation(name, mistake);
		}
		else if (!hasPath)
		{
			dialogMng.alert("Custom installation failed: could not extract files from the ZXP.");
		}
		else if (!hasData)
		{
			dialogMng.alert("Custom installation failed: could not read ZXP data.");
		}
        else
        {
            dialogMng.alert("<b>Custom installation failed.</b><br><br>If you were installing the product for <b>All Users</b>,<br>try again by selecting <b>Only for Me</b>.");
        }
	}
	
}

ZXPManager.prototype.clear = function(appIndex, extIndex)
{
	var ext = this.apps[appIndex].extensions[extIndex];
	dialogMng.confirmClear(ext);
}

ZXPManager.prototype.clearZXP = function(prefs)
{
	if (system.isMac())
	{
		path = "~/Library/Caches/CSXS/cep_cache";
	}
	else
	{
		path = "%USERPROFILE%/AppData/Local/Temp/cep_cache";
	}
	
    tmp = window.external.listFiles(path);
	if (tmp.length)
    {
        paths = tmp.split('|');
    }
    else
    {
        paths = new Array();
    }
	
	for (var i=0; i<paths.length; i++)
	{
		var path = paths[i];
		
		for (var j=0; j<prefs.length; j++)
		{
			if (path.contains(prefs[j]))
			{
				log("Clearing pref <b>" + prefs[j] + "</b>")
				system.file.delete(path);
			}
		}
	}
}

ZXPManager.prototype.fullReset = function()
{
    switch (system.OS)
    {
        case System.WIN:
            path = null;
            break;
        case System.MAC:
            path = "/Library/Application Support/Adobe/Extension Manager CC/Configuration/DB/ExMan.db";
            break;
    }
    
    if (path)
    {
        system.file.delete(path);
        window.external.updateUI();
    }
}
