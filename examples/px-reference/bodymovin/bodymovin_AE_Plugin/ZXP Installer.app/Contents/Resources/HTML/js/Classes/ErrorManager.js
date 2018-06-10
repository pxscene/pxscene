
/*
 *	Error Manager
 */

function ErrorManager()
{
	;
}

//	Report

ErrorManager.prototype.show = function(code, msg, installError)
{
    log("Handling error ...")
    
	if (	msg
		&&	code > 0 )
	{
		var beg = msg.lastIndexOf("-");
		var end = msg.length-1;
		code = parseInt(msg.substr(beg, end-beg));
	}

	var str = this.getText(code);

	if (str)
	{
		log("<b>ExManCmd error " + code + ": " + str + "</b>");
		
		/*
		 *	We used to display the error, now we skip directly to a custom install
		 *
		
		
		var id = 'onError';
		str += ". Would you like attempt a custom installation of the product?";
		
		dialogMng.init(id,
					   function ()
					   {
						dialogMng.confirmCustomInstall(null);
						return false;
					   });
		
		//	Error code
		var div = dialogMng.getDialogLinkDiv(id);
		div.onclick = function ()
		{
			system.open("http://aescripts.com/knowledgebase/index/view/faq/zxp-installer-faq/#" + code);
		};
		//	Error message
		div = dialogMng.getDialogTextDiv(id);
		div.innerHTML = str;
		if (msg)
		{
			//	Error complement
			div = dialogMng.getDialogTextDiv(id + '_extra');
			div.innerHTML = msg;
		}
		dialogMng.open();
		*/
	}
	
	if (installError)
	{
		dialogMng.confirmCustomInstall(null);
	}
    else
    {
        dialogMng.close();
    }
}

ErrorManager.prototype.getText = function(code)
{
	var str = null;

	switch (code)
	{
		case -175:
			str = "Failed to obtain elevated privileges";
			break;
			
		case -201:
			str = "Failed to unpack the ZXP file"
			break;
			
		case -402:
			str = "Failed to verify the signature of the ZXP file";
			break;
			
		case -403:
			str = "Installation failed";
			break;
			
		case -410:
			str = "Corrupt ZXP file";
			break;
			
		case -411:
			str = "No compatible CC application found";
			break;
			
		case -407:
		case -408:
			str = "An extension required by this ZXP is not installed or enabled";
			break;
			
		case -412:
			str = "An extension with the same name has been installed";
			break;
			
		case -418:
			str = "A newer version of this extension has been installed";
			break;
			
		case -456:
			str = "The CC application should be terminated to install this extension";
			break;
			
		case -458:
			str = "None of required CC apps has been installed";
			break;
			
		case -459:
			str = "The CC application is not compatible"
			break;
			
		case -152:
		case -154:
		case -155:
		case -156:
		case -157:
		case -158:
		case -160:
		case -161:
		case -162:
		case -163:
		case -164:
		case -165:
		case -168:
		case -169:
		case -171:
		case -172:
		case -176:
		case -178:
		case -179:
			str = "There was a file operation error when installing this extension";
			break;
			
		case -251:
		case -252:
		case -253:
		case -254:
		case -255:
		case -256:
		case -257:
		case -259:
		case -260:
		case -261:
		case -265:
		case -266:
		case -267:
		case -268:
		case -269:
		case -270:
		case -271:
		case -272:
			str = "Failed to parse the file";
			break;
			
		case -500:
		case -501:
		case -502:
		case -503:
		case -504:
		case -505:
		case -506:
		case -507:
		case -508:
		case -508:
		case -509:
			str = "Failed to update the database";
			break;
			
		case -601:
		case -602:
		case -603:
		case -604:
		case -651:
		case -652:
		case -653:
			str = "Failed to perform online license check";
			break;
			
		default:
			str = "Unknown installation error";
			break;
	}
	
	return str;
}

