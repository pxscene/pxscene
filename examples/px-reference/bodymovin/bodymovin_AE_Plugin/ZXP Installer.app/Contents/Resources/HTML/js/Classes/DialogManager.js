
/*
 *	DialogManager
 */

function DialogManager()
{
	this.dialogRequiresNoInput;
	this.dialogCannotBeClosed;
	
	this.contentDiv = $('#ks_container_content');
	this.dialogDiv = $('#ks_container_dialog');
	
	this.fadeDuration = 0;
}

DialogManager.prototype.init = function(contentId, callback, cannotCloseDialog)
{
	this.dialogRequiresNoInput = !callback;
	this.dialogCannotBeClosed = !!cannotCloseDialog;
	
	var hasCallback = (callback instanceof Function);
	
	//	Update the buttons
	var div = document.getElementById('ks_dialog_buttons');
	div.style.display = (  !hasCallback  ?  'none' : 'block'  );
	
	div = document.getElementById('ks_dialog_close');
	div.style.display = (  hasCallback || this.dialogCannotBeClosed  ?  'none' : 'block'  );
	
	if (hasCallback)
	{
		document.getElementById('ks_dialog_buttons_ok').onclick = function ()
		{
			var close = callback(dialogMng.dialogDiv);
			if ( ( close === undefined ) || !!close )
			{
				dialogMng.close()
			}
		};
	}

	if (!this.dialogRequiresNoInput)
	{
		document.getElementById('ks_dialog_buttons_cancel').style.display = (  this.dialogCannotBeClosed  ?  'none' : 'block'  );
	}
	
	//	Hide all dialog contents
	$('.ks_dialog_content').hide();
	
	//	Retrieve current dialog content
	div = document.getElementById('ks_dialog_' + contentId);
	$(div).show();
	return div;
}

DialogManager.prototype.open = function(contentId, callback, cannotCloseDialog)
{
	if (!!contentId)
	{
		this.init(contentId, callback, cannotCloseDialog);
	}

	this.dialogDiv.stop().css({display: 'block'});
	this.dialogDiv.stop().css({opacity: 1.0});
	this.contentDiv.stop().css({opacity: 0.2});
}


DialogManager.prototype.alert = function(code, callback, cannotCloseDialog)
{
	var div = this.init('content', callback || true, cannotCloseDialog);
	div.innerHTML = code;
	this.open();
}


DialogManager.prototype.tryClose = function(strict)
{
	if ( !this.dialogCannotBeClosed && ( !strict || this.dialogRequiresNoInput ) )
	{
		this.close();
	}
}

DialogManager.prototype.close = function()
{
	this.dialogDiv.fadeTo(this.fadeDuration, 0, 'easeOutExpo', function () { $(this).css({display: 'none'}) } );
	this.contentDiv.stop().fadeTo(this.fadeDuration, 1, 'easeOutExpo');
}

//	Click

DialogManager.prototype.onClick = function(event)
{
	this.tryClose(true);
		
	if (event)
	{
		event.preventDefault();
	}
}

//	Customisation

DialogManager.prototype.getDialogDiv = function(id, type)
{
	return document.getElementById('ks_dialog_' + id + '_' + type);
}

DialogManager.prototype.getDialogTextDiv = function(id)
{
	return this.getDialogDiv(id, 'text');
}

DialogManager.prototype.getDialogLinkDiv = function(id)
{
	return this.getDialogDiv(id, 'link');
}
