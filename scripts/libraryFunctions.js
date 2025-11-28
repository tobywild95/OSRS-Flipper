window.OSRS = {}
window.OSRS.library = {};
window.OSRS.library.parseTypeName = parseTypeName;
window.OSRS.library.formatAboveBelowZero = formatAboveBelowZero;
window.OSRS.library.numberWithCommas = numberWithCommas;

function parseTypeName(result)
{
	if(result.itemData.members)
	{
		result.itemData.name = "<span class=\"orangeText\">" + result.itemData.name + "</span>";
	}

	return result;
}

function formatAboveBelowZero(value)
{
	let string = "";

	if(value > 0)
	{
		string = "<span class=\"greenText\">" + numberWithCommas(value);
	}
	else
	{
		string = "<span class=\"redText\">" + numberWithCommas(value);
	}

	return string;
}

//From here:
//https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
function numberWithCommas(x) 
{
	if(!x)
	{
		x = 0;
	}
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}