
/*
 *	Class inheritance
 */

function extend(Parent, Child)
{
	for (k in Parent.prototype)
	{
		if ( (Parent.prototype[k] instanceof Function) && !(Child.prototype[k] instanceof Function) )
		{
			Child.prototype[k] = Parent.prototype[k];
		}
	}
}