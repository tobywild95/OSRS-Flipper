---
cssclasses: bottomTableBorder
natureRuneId: 561
highAlchItems: 
{
	"Maple longbow" : 851,
	"Sapphire necklace" : 1656,
	"Emerald necklace" : 1658,
	"Rune arrow" : 892,
	"Runite bolts" : 9144,
	"Yew longbow" : 855,
	"Yew shortbow" : 857,
	"Amethyst arrow" : 21326,
	"Atlatl dart" : 28991,
	"Magic shortbow" : 861,
	"Magic longbow": 859,
	"Diamond bracelet" : 11092,
	"Jade bracelet" : 21120,
	"Rune dart" : 811,
	"Diamond bolts (e)" : 9243
}
setItems: 
{
	"Ahrim's armour set" : {
		"id" : 12881,
		"components" : [4708, 4712, 4714, 4710]
	},
	"Dharok's armour set" : {
		"id" : 12877,
		"components" : [4718, 4716, 4720, 4722]
	},
	"Dwarf cannon set" : {
		"id" : 12863,
		"components" : [10, 6, 12, 8]
	},
}
combineItems: 
{
	"Bandos godsword" : {
		"id" : 11804,
		"components" : [11812, 11798]
	},
	"Saradomin godsword" : {
		"id" : 11806,
		"components" : [11814, 11798]
	},
	"Zamorak godsword" : {
		"id" : 11808,
		"components" : [11816, 11798]
	},
	"Ancient godsword" : {
		"id" : 26233,
		"components" : [26370, 11798]
	},
	"Armadyl godsword" : {
		"id" : 11802,
		"components" : [11810, 11798]
	},
	"Burning claws" : {
		"id" : 29577,
		"components" : [29574, 29574]
	},
	"Voidwaker" : {
		"id" : 27690,
		"components" : [27684, 27687, 27681]
	}
}
favouriteItems: 
{
	"Amulet of fury": 6585,
	"Chaos rune" : 562,
	"Ranarr seed" : 5295,
	"Ranarr weed" : 257,
	"Snape grass seed" : 22879,
	"Kwuarm seed" : 5299,
	"Adamant arrow" : 890,
	"Gold ore" : 444,
	"Law rune" : 563,
	"Berserker necklace" : 11128,
	"Berserker ring" : 6737,
	"Archer helm" : 3749,
	"Adamant dart" : 810,
	"Dark crab" : 11936,
	"Black chinchompa" : 11959,
	"Mahogany logs" : 6332
}
---
```meta-bind-button
label: Refresh
icon: ""
hidden: false
class: ""
tooltip: ""
id: ""
style: default
actions:
  - type: open
    link: "[[Automated flipping data sheet]]"
    newTab: false

```
# Library
```dataviewjs
/*
*	------------------------------
*	Library dataview
*	------------------------------
*/
window.OSRS = {};
window.OSRS.library = {};
window.OSRS.library.parseTypeName = parseTypeName;
window.OSRS.library.formatAboveBelowZero = formatAboveBelowZero;
window.OSRS.library.numberWithCommas = numberWithCommas;
window.OSRS.library.drawSetItemTable = drawSetItemTable;
window.OSRS.library.drawFavouritesTable = drawFavouritesTable;

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

function drawSetItemTable(metaData, dv)
{
	let results = [];

	for(var key in metaData)
	{
		var result = metaData[key];
		result.data = window.OSRS.data.consolidatedData[result.id];
		result.data = window.OSRS.library.parseTypeName(result.data);
		result.componentsData = [];
		console.log("result.components", result.components)

		for(var i = 0; i < result.components.length; i++)
		{
			console.log("result.components[i]", result.components[i])
			console.log("window.OSRS.data.consolidatedData[result.components[i]]", window.OSRS.data.consolidatedData[result.components[i]])
			result.componentsData.push(window.OSRS.library.parseTypeName(window.OSRS.data.consolidatedData[result.components[i]]));
			console.log("result.componentsData", result.componentsData)
		}

		result.calcData = {};
		result.calcData.componentCost = 0;
		result.calcData.componentCostMax = 0;
		result.calcData.lowestLimit = null;
		for(var j = 0; j < result.componentsData.length; j++)
		{
			result.calcData.componentCost += result.componentsData[j].priceData.low;
			result.calcData.componentCostMax += result.componentsData[j].priceData.high;
			if(result.calcData.lowestLimit== null)
			{
				result.calcData.lowestLimit = result.componentsData[j].itemData.limit;
			}
			else if(result.calcData.lowestLimit > result.componentsData[j].itemData.limit)
			{
				result.calcData.lowestLimit = result.componentsData[j].itemData.limit;
			}
		}
		result.calcData.profit = result.data.priceData.high;
		result.calcData.profit = result.calcData.profit - (Math.floor(result.calcData.profit * 0.01));
		result.calcData.profit = result.calcData.profit - result.calcData.componentCost;
		result.calcData.profitTotal = result.calcData.profit * result.calcData.lowestLimit;
		result.calcData.profitMin = result.data.priceData.low;
		result.calcData.profitMin = result.calcData.profitMin - (Math.floor(result.calcData.profitMin * 0.01));
		result.calcData.profitMin = result.calcData.profitMin - result.calcData.componentCostMax;
		result.calcData.profitMinTotal = result.calcData.profitMin * result.calcData.lowestLimit;
		result.calcData.componentCostTotal = result.calcData.componentCost * result.calcData.lowestLimit;
		results.push(result);
	}

	dv.table(
	["Name", "Components", "Profit", "Cost"],
	results
	.sort(function(a, b){return b.calcData.profitTotal - a.calcData.profitTotal;})
	.map(row => [
		row.data.itemData.name + "<br><span class=\"deepOrangeText\">" + window.OSRS.library.numberWithCommas(row.data.priceData.low) + 
		"</span> | <span class=\"blueText\">" + window.OSRS.library.numberWithCommas(row.data.priceData.high) + "</span><br>" +
		"<span class=\"greyText\">" + (window.OSRS.library.numberWithCommas(row.data.quantityData.highPriceVolume) || 0) + " | " + 
		(window.OSRS.library.numberWithCommas(row.data.quantityData.lowPriceVolume) || 0) + " | " + 
		window.OSRS.library.numberWithCommas(row.data.calcData.buySellRatio) + "</span>"
		,
		generateComponentString(row)
		,
		"Max " + window.OSRS.library.formatAboveBelowZero(row.calcData.profit)  + " per</span><br>" +
		window.OSRS.library.formatAboveBelowZero(((row.calcData.profitTotal)/1000000).toFixed(2)) + "m</span><br>"+
		"Min " + window.OSRS.library.formatAboveBelowZero(row.calcData.profitMin)  + " per</span><br>" +
		window.OSRS.library.formatAboveBelowZero(((row.calcData.profitMinTotal)/1000000).toFixed(2)) + "m</span>"
		,
		window.OSRS.library.numberWithCommas(row.calcData.componentCost) + " per<br><span class=\"greyText\">" + window.OSRS.library.numberWithCommas((row.calcData.componentCostTotal/1000000).toFixed(2)) + "m<br>"
		 + window.OSRS.library.numberWithCommas(row.calcData.lowestLimit) + " limit</span>"
		])
	);
}

function getTotalComponentCost(row)
{
	let totalComponentCost = 0;

	for(var i = 0; i < row.componentsData.length; i++)
	{
		totalComponentCost = totalComponentCost + row.componentsData[i].priceData.low;
	}

	return totalComponentCost;
}

function generateComponentString(row)
{
	let componentString = "";

	for(var i = 0; i < row.componentsData.length; i++)
	{
		componentString += row.componentsData[i].itemData.name;
		componentString += "<br>";
		componentString += ("<span class=\"deepOrangeText\">" + window.OSRS.library.numberWithCommas(row.componentsData[i].priceData.low) + "</span> | <span class=\"blueText\">" + window.OSRS.library.numberWithCommas(row.componentsData[i].priceData.high) + "</span>");
		componentString += " | <span class=\"greyText\">" + row.componentsData[i].calcData.buySellRatio + "</span>";
		if(i+1 != row.componentsData.length)
		{
			componentString += "<br>";
		}
		
	}
_

	return componentString;

}

function drawFavouritesTable(metaData, dv)
{
	let results = [];
	for(var key in metaData)
	{
		var result = {};
		var resultId = metaData[key];
		result = window.OSRS.data.consolidatedData[resultId];
		result = window.OSRS.library.parseTypeName(result);
		results.push(result);
	}

	dv.table(
	["Item", "Low | High", "Profit", "Cost"],
	results
	.sort(function(a, b){return b.calcData.profitPotential - a.calcData.profitPotential;})
	.map(row => [
		row.itemData.name + "<br><span class=\"greyText\">" + "Limit: " + window.OSRS.library.numberWithCommas(row.itemData.limit) + "<br>" +
		(window.OSRS.library.numberWithCommas(row.quantityData != null ? row.quantityData.highPriceVolume : 0)) + " | " + 
		(window.OSRS.library.numberWithCommas(row.quantityData != null ? row.quantityData.lowPriceVolume : 0)) + "</span>"
		,   
		("<span class=\"deepOrangeText\">" + window.OSRS.library.numberWithCommas(row.priceData.low) + "</span> | <span class=\"blueText\">" + window.OSRS.library.numberWithCommas(row.priceData.high) + "</span> | <span class=\"greyText\">" + row.calcData.buySellRatio + "</span>"),
		(row.calcData.profitText + " per</span><br>" + row.calcData.profitPotentialText),
		window.OSRS.library.numberWithCommas(row.calcData.totalCost) + "<br><span class=\"greyText\">" + window.OSRS.library.numberWithCommas(row.calcData.totalCostMillion) + "m</span>",
		])
	);
}
```
# Loader
```dataviewjs
/*
*	------------------------------
*	Data loader dataview
*	------------------------------
*/

//Gets current page file path
let thisPageFilePath = dv.current().file.path;
let metaData = getMetaData();
let priceResponse = requestPriceData();
let itemResponse = requestItemData();
let quantityResponse = requestQuantityData();
let natureRune = getNatureRuneObject();
let consolidatedData = {};
let sortableData = [];

consolidateData(priceResponse, itemResponse, quantityResponse);

window.OSRS.data = {};
window.OSRS.data.metaData = metaData;
window.OSRS.data.natureRune = natureRune;
window.OSRS.data.consolidatedData = consolidatedData;
window.OSRS.data.sortableData = sortableData;

function getMetaData()
{
	let metaData = {};
	metaData.highAlchItems = dv.page(thisPageFilePath).highAlchItems;
	metaData.natureRuneId = dv.page(thisPageFilePath).natureRuneId;
	metaData.setItems = dv.page(thisPageFilePath).setItems;
	metaData.combineItems = dv.page(thisPageFilePath).combineItems;
	metaData.favouriteItems = dv.page(thisPageFilePath).favouriteItems;

	return metaData;
}

function requestPriceData()
{
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "https://prices.runescape.wiki/api/v1/osrs/latest", false ); 
	xmlHttp.send( null );
	let priceResponse = xmlHttp.responseText;
	priceResponse = JSON.parse(priceResponse);
	priceResponse = priceResponse.data;

	return priceResponse;
}

function requestItemData()
{
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "https://prices.runescape.wiki/api/v1/osrs/mapping", false ); 
	xmlHttp.send( null );
	let itemResponse = xmlHttp.responseText;
	itemResponse = JSON.parse(itemResponse);

	return itemResponse;
}

function requestQuantityData()
{
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "https://prices.runescape.wiki/api/v1/osrs/1h", false ); 
	xmlHttp.send( null );
	let quantityResponse = xmlHttp.responseText;
	quantityResponse = JSON.parse(quantityResponse);
	quantityResponse = quantityResponse.data;

	return quantityResponse;
}

function getNatureRuneObject()
{
	let returnData = {};
	returnData.priceData = priceResponse[metaData.natureRuneId];
	returnData.quantityData = quantityResponse[metaData.natureRuneId];
	returnData.itemData = itemResponse.filter(record => record.id == metaData.natureRuneId)[0]; //Destructure array
	return returnData;
}

function consolidateData(priceResponse, itemResponse, quantityResponse)
{
	for(var key in priceResponse)
	{
		consolidatedData[key] = {};
		consolidatedData[key].priceData = priceResponse[key] || null;
		consolidatedData[key].quantityData = quantityResponse[key] || null;
		consolidatedData[key].itemData = itemResponse.filter(record => record.id == key)[0] || null; //Destructure array

		if(consolidatedData[key].priceData == null || consolidatedData[key].itemData == null)
		{
			delete consolidatedData[key];
		}
		else
		{
			if(consolidatedData[key].itemData.limit == undefined)
			{
				if(consolidatedData[key].quantityData)
				{
					if(consolidatedData[key].quantityData.lowPriceVolume)
					{
						consolidatedData[key].itemData.limit = consolidatedData[key].quantityData.lowPriceVolume;
					}
					else if(consolidatedData[key].quantityData.highPriceVolume)
					{
						consolidatedData[key].itemData.limit = consolidatedData[key].quantityData.highPriceVolume;
					}
					else
					{
						consolidatedData[key].itemData.limit = 1
					}
				}
				else
				{
					consolidatedData[key].itemData.limit = 1
				}
			}

			consolidatedData[key].calcData = getCalculatedData(consolidatedData[key]);

			var tempObj = {};
			tempObj.id = key;
			tempObj.profit = consolidatedData[key].calcData.profit;
			tempObj.profitPotential = consolidatedData[key].calcData.profitPotential;
			tempObj.limit = consolidatedData[key].itemData.limit;
			sortableData.push(tempObj)
		}
	}

	console.log("sortableData", sortableData);
}

function getCalculatedData(result)
{
	let calcData = {};
	calcData.guideBuy = result.itemData.highalch - natureRune.priceData.high;
	calcData.guideBuy = calcData.guideBuy - (Math.floor(calcData.guideBuy * 0.01));

	calcData.profit = result.priceData.high - result.priceData.low;

	if(result.itemData.id == 13190)
	{
		calcData.profit = calcData.profit - (Math.floor(result.priceData.high * 0.1));
	}
	else
	{
		calcData.profit = calcData.profit - (Math.floor(result.priceData.high * 0.01));
	}
	
	calcData.profitText = window.OSRS.library.formatAboveBelowZero(calcData.profit)

	calcData.profitPotential = calcData.profit * result.itemData.limit;
	calcData.profitPotentialText = window.OSRS.library.formatAboveBelowZero(calcData.profitPotential)

	calcData.totalCost = result.priceData.low * result.itemData.limit;
	calcData.totalCostMillion = (calcData.totalCost / 1000000).toFixed(2);

	if(result.quantityData)
	{
		calcData.buySellRatio = (result.quantityData.highPriceVolume / (result.quantityData.lowPriceVolume != 0 ? result.quantityData.lowPriceVolume : result.quantityData.highPriceVolume)).toFixed(2);
	}
	else
	{
		calcData.buySellRatio = 0;
	}

	return calcData;
}
```
# Nature rune summary
```dataviewjs
/*
*	------------------------------
*	Draw nature rune summary
*	------------------------------
*/
drawNatureRuneSummary();

function drawNatureRuneSummary()
{
	let message = "";
	message += "Low: " + window.OSRS.data.natureRune.priceData.low;
	message += " | ";
	message += "High: " + window.OSRS.data.natureRune.priceData.high;
	dv.paragraph(message)
}
```
~~~tabs
top
tab: High alchemy
```dataviewjs
drawHighAlchTable();

function drawHighAlchTable()
{
	let results = [];

	for(var key in window.OSRS.data.metaData.highAlchItems)
	{
		var result = {};
		var resultId = window.OSRS.data.metaData.highAlchItems[key];
		result = window.OSRS.data.consolidatedData[resultId];
		result = window.OSRS.library.parseTypeName(result);
		results.push(result);
	}

	dv.table(
	["Item", "Low | High", "Profit", "Cost"],
	results
	.sort(function(a, b){return b.calcData.profitPotential - a.calcData.profitPotential;})
	.map(row => [
		row.itemData.name + "<br><span class=\"greyText\">" + window.OSRS.library.numberWithCommas(row.itemData.limit) + " | Max: " + window.OSRS.library.numberWithCommas(row.calcData.guideBuy) + "</span>"
		,   
		("<span class=\"deepOrangeText\">" + window.OSRS.library.numberWithCommas(row.priceData.low) + "</span> | <span class=\"blueText\">" + window.OSRS.library.numberWithCommas(row.priceData.high) + "</span> | <span class=\"greyText\">" + row.calcData.buySellRatio + "</span>")
		,
		(row.calcData.profitText + " per</span><br>" + row.calcData.profitPotentialText)
		,
		window.OSRS.library.numberWithCommas(row.calcData.totalCost) + "<br><span class=\"greyText\">" + window.OSRS.library.numberWithCommas(row.calcData.totalCostMillion) + "m</span>",
		])
	);
}
```
tab: Sets
```dataviewjs
console.log("osrs", window.OSRS)

window.OSRS.library.drawSetItemTable(window.OSRS.data.metaData.setItems, dv)
```
tab: Components
```dataviewjs
window.OSRS.library.drawSetItemTable(window.OSRS.data.metaData.combineItems, dv)
```
tab: Favourites
```dataviewjs
window.OSRS.library.drawFavouritesTable(window.OSRS.data.metaData.favouriteItems, dv)
```
tab: Profit
```dataviewjs
window.OSRS.data.sortableData.sort(function(a, b){return Number(b.profitPotential) - Number(a.profitPotential);})

let inputData = [];
let i = 0;

while(inputData.length < 50)
{
	if(window.OSRS.data.consolidatedData[window.OSRS.data.sortableData[i].id].quantityData != null)
	{
		if(window.OSRS.data.consolidatedData[window.OSRS.data.sortableData[i].id].quantityData.highPriceVolume != 0 
		&& window.OSRS.data.consolidatedData[window.OSRS.data.sortableData[i].id].quantityData.lowPriceVolume != 0)
		{
			inputData.push(window.OSRS.data.sortableData[i].id);
		}
	}
	i++;
}

window.OSRS.library.drawFavouritesTable(inputData, dv)
```

tab: Margin
```dataviewjs
window.OSRS.data.sortableData.sort(function(a, b){return Number(b.profit) - Number(a.profit);})

let inputData = [];
let i = 0;

while(inputData.length < 50)
{
	if(window.OSRS.data.consolidatedData[window.OSRS.data.sortableData[i].id].quantityData != null)
	{
		if(window.OSRS.data.consolidatedData[window.OSRS.data.sortableData[i].id].quantityData.highPriceVolume != 0 
		&& window.OSRS.data.consolidatedData[window.OSRS.data.sortableData[i].id].quantityData.lowPriceVolume != 0)
		{
			console.log("window.OSRS.data.sortableData[i]", window.OSRS.data.sortableData[i]);
			inputData.push(window.OSRS.data.sortableData[i].id);
		}
	}
	i++;
}

console.log("inputData", inputData);
window.OSRS.library.drawFavouritesTable(inputData, dv)
```
~~~



%%%

# Todo
- [x] Organise table to be more mobile efficient ✅ 2025-01-13
- [x] Add qty x instabuy (total cost) ✅ 2025-01-13
- [x] fix profits not including tax ✅ 2025-01-13
- [x] Add build sets calculator
- [x] Add combo items (similar to build sets), such as godswords to the build (hilt and blade), guardian boots, devout boots, saturated heart, burning claws ✅ 2025-01-15
- [ ] Add break sets calculator
- [ ] add a table for most traded items, high/low/average, show 50 most traded items, sort by profit 
- [X] Add a favourites list
- [x] Add X most highest margins ✅ 2025-01-17
- [x] Add X most profitable ✅ 2025-01-17
- [ ] add x most profitable under Y cost
- [ ] add high alch calculator
- [x] look at buy/sell ratio data, add to table, including high alch ✅ 2025-01-16
- [x] look into delegating the request to a global variable, then finding a way to put the data views into tabs ✅ 2025-01-16
- [ ] add a min and max profit for builder tables (buy min, sell high and buy high, sell low)
- [ ] fix buy ratio, if either upper or lower volume is 0, set ratio to 0 or n/a
- [ ] add ROI%
- [ ] Refactor
- [ ] consider farming as semi active money maker
- [ ] consider a decanting calculator , do cost per dose, you'd do potential profit as lowest cost per dose to highest cost per dose, or maybe just compare to 4 doses. 
- [ ] make similar tables libraries
- [ ] high alch - add onyx bolts e, water, fire, air battlestaffs, diamond bracelet, magic long, dragon javelin heads


# Source key
https://oldschool.runescape.wiki/w/Module:GEIDs/data.json

https://www.gielinorgains.com/

https://oldschool.runescape.wiki/w/Calculator:Herblore/Decanting

https://www.reddit.com/r/GrandExchangeBets/s/JjLBvNwUPM

https://www.reddit.com/r/OSRSflipping/s/vLyd7gjtwt

https://www.reddit.com/r/OSRSflipping/s/T98J7FWO5A
(Black chins, dark crabs and mahog logs)

https://www.reddit.com/r/OSRSflipping/s/qJK59zlc7C