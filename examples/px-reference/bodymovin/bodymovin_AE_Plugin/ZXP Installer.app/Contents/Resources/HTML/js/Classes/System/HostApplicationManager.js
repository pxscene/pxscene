
/*
 *	Host Application Manager
 */

function HostApplicationManager()
{
	this.Adobe = {
		AE: new AfterEffects(),
		PS: new Photoshop(),
		PR: new Premiere(),
	};
}
