
/*
 *	Load events
 */

function onLoad()
{
	//	Disable image and text drag/drop
	var body = document.getElementsByTagName('body')[0];
	body.ondragstart = function() { return false; };
	
	//	Notify engine that the UI is ready
	try { window.external.onLoad(); } catch (err) { alert(err); }
}

function onInit()
{
	try
	{
		//	Classes
		dialogMng = new DialogManager();
		errMng = new ErrorManager();

		system = new System();
	
		zxpMng = new ZXPManager();
	}
	catch (err)
	{
		log(err);
	}
	
	//	Reveal UI
	$('body').fadeTo(1000, 1, 'easeOutExpo');
}

function onUpdate()
{
	dialogMng.onUpdate();
}
