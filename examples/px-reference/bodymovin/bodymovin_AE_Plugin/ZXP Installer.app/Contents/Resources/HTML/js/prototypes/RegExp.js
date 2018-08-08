
RegExp.prototype.find = function(str)
{
	var result = this.exec(str);
	var groups = null;
	
	if (result)
	{
		groups = new Array();
		groups.push({index: result.index, length:result[0].length, text:str.substr(result.index, result[0].length)});
		
		var start = 0;
		for (var i=1; i<result.length; i++)
		{
			if (result[i])
			{
				var length = result[i].length;
				var index = result[0].indexOf(result[i], start);
				groups.push({index: index+groups[0].index, length:length, text:groups[0].text.substr(index, length)});
				start = index + length;
			}
			else
			{
				groups.push(null);
			}
		}
	}
	
	return groups;
}

RegExp.prototype.findLast = function(str)
{
	var groups = null;
	var tmp = null;
	
	while (tmp = this.find(str))
	{
		groups = tmp;
	}
	
	return groups;
}
