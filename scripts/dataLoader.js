
async function refreshData()
{
	window.OSRS.data = {};

	let metaData = getMetaData();
	let priceResponse = requestPriceData();
	let itemResponse = requestItemData();
	let quantityResponse = requestQuantityData();
	let natureRune = getNatureRuneObject(priceResponse, metaData, itemResponse, quantityResponse);
	let sortableData = [];

	sortableData = consolidateData(priceResponse, itemResponse, quantityResponse, natureRune);


	window.OSRS.data.metaData = metaData;
	window.OSRS.data.natureRune = natureRune;
	//window.OSRS.data.consolidatedData = consolidatedData;
	window.OSRS.data.sortableData = sortableData;

	console.log(window.OSRS.data)

	return true
}

function getMetaData()
{
	let metaData = {
    natureRuneId: 561,
    highAlchItems: {"Maple longbow":851,"Sapphire necklace":1656,"Emerald necklace":1658,"Rune arrow":892,"Runite bolts":9144,"Yew longbow":855,"Yew shortbow":857,"Amethyst arrow":21326,"Atlatl dart":28991,"Magic shortbow":861,"Magic longbow":859,"Diamond bracelet":11092,"Jade bracelet":21120,"Rune dart":811,"Diamond bolts (e)":9243},
    setItems: {"Ahrim's armour set":{"id":12881,"components":[4708,4712,4714,4710]},"Dharok's armour set":{"id":12877,"components":[4718,4716,4720,4722]},"Dwarf cannon set":{"id":12863,"components":[10,6,12,8]}},
    combineItems: {"Bandos godsword":{"id":11804,"components":[11812,11798]},"Saradomin godsword":{"id":11806,"components":[11814,11798]},"Zamorak godsword":{"id":11808,"components":[11816,11798]},"Ancient godsword":{"id":26233,"components":[26370,11798]},"Armadyl godsword":{"id":11802,"components":[11810,11798]},"Burning claws":{"id":29577,"components":[29574,29574]},"Voidwaker":{"id":27690,"components":[27684,27687,27681]}},
    favouriteItems: {"Amulet of fury":6585,"Chaos rune":562,"Ranarr seed":5295,"Ranarr weed":257,"Snape grass seed":22879,"Kwuarm seed":5299,"Adamant arrow":890,"Gold ore":444,"Law rune":563,"Berserker necklace":11128,"Berserker ring":6737,"Archer helm":3749,"Adamant dart":810,"Dark crab":11936,"Black chinchompa":11959,"Mahogany logs":6332}
  };

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

function getNatureRuneObject(priceResponse, metaData, itemResponse, quantityResponse)
{
	let returnData = {};
	returnData.priceData = priceResponse[metaData.natureRuneId];
	returnData.quantityData = quantityResponse[metaData.natureRuneId];
	returnData.itemData = itemResponse.filter(record => record.id == metaData.natureRuneId)[0]; //Destructure array
	return returnData;
}

function consolidateData(priceResponse, itemResponse, quantityResponse, natureRune)
{
	var consolidatedData = {}
	var sortableData = []
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

			consolidatedData[key].calcData = getCalculatedData(consolidatedData[key], natureRune);

			var tempObj = {};
			tempObj.id = key;
			tempObj.profit = consolidatedData[key].calcData.profit;
			tempObj.profitPotential = consolidatedData[key].calcData.profitPotential;
			tempObj.limit = consolidatedData[key].itemData.limit;
			sortableData.push(tempObj)
		}
	}

	window.OSRS.data.consolidatedData = consolidatedData

	return sortableData
}

function getCalculatedData(result, natureRune)
{
	let calcData = {};
	calcData.guideBuy = result.itemData.highalch - natureRune.priceData.high;
	calcData.guideBuy = calcData.guideBuy - (Math.floor(calcData.guideBuy * 0.02));

	calcData.profit = result.priceData.high - result.priceData.low;

	if(result.itemData.id == 13190)
	{
		calcData.tax = Math.floor(result.priceData.high * 0.1);
		calcData.profit = calcData.profit - calcData.tax;
	}
	else
	{
		calcData.tax = Math.floor(result.priceData.high * 0.02);
		calcData.profit = calcData.profit - calcData.tax;
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