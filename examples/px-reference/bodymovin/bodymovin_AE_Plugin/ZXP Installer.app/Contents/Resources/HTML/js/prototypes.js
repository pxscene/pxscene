
function extend(Parent, Child)
{
	for (var k in Parent.prototype)
	{
		if (Parent.prototype.hasOwnProperty(k) && !Child.prototype.hasOwnProperty(k))
		{
			Child.prototype[k] = Parent.prototype[k];
		}
	}
}

/*
 *	Array
 */

Array.prototype.clear = function()
{
	this.splice(0, this.length);
}

Array.prototype.clone = function()
{
	return this.slice();
}

Array.prototype.remove = function(value)
{
	var index = this.indexOf(value);
	if (index >= 0)
	{
		this.splice(index, 1);
	}
}

Array.prototype.last = function()
{
	return this[this.length-1];
}

Array.prototype.contains = function(value)
{
	return this.indexOf(value) >= 0;
}

Array.prototype.insert = function(value, index)
{
	this.splice(index, 0, value);
}

/*
 *	String
 */

String.prototype.contains = function(value)
{
	return this.indexOf(value) >= 0;
}
