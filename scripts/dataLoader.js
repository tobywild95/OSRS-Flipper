
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
    highAlchItems: {
		"Maple longbow":851,
		"Sapphire necklace":1656,
		"Emerald necklace":1658,
		"Rune arrow":892,
		"Runite bolts":9144,
		"Yew longbow":855,
		"Yew shortbow":857,
		"Amethyst arrow":21326,
		"Atlatl dart":28991,
		"Magic shortbow":861,
		"Magic longbow":859,
		"Diamond bracelet":11092,
		"Jade bracelet":21120,
		"Rune dart":811,
		"Diamond bolts (e)":9243
	},
    setItems: {
		"Ahrim's armour set":{"id":12881,"components":[4708,4712,4714,4710]},
		"Dharok's armour set":{"id":12877,"components":[4718,4716,4720,4722]},
		"Blue moon armour set":{"id":31139,"components":[29019,28988,29016,29013]},
		"Blood moon armour set":{"id":31136,"components":[28997,29028,29025,29022]},
		"Eclipse moon armour set":{"id":31142,"components":[29010,29007,29004,29000]},
		"Sunfire fanatic armour set":{"id":29424,"components":[28933,28936,28939]},
		"Hueycoatl hide armour set":{"id":31169,"components":[30073,30076,30079,30082]},
		"Torag's armour set":{"id":12879,"components":[4745,4747,4749,4751]},
		"Dwarf cannon set":{"id":12863,"components":[10,6,12,8]}
	},
    combineItems: {
		"Bandos godsword":{"id":11804,"components":[11812,11798]},
		"Saradomin godsword":{"id":11806,"components":[11814,11798]},
		"Zamorak godsword":{"id":11808,"components":[11816,11798]},
		"Ancient godsword":{"id":26233,"components":[26370,11798]},
		"Armadyl godsword":{"id":11802,"components":[11810,11798]},
		"Burning claws":{"id":29577,"components":[29574,29574]},
		"Voidwaker":{"id":27690,"components":[27684,27687,27681]}
	},
    favouriteItems: {
		"Amulet of fury":6585,
		"Chaos rune":562,
		"Ranarr seed":5295,
		"Ranarr weed":257,
		"Snape grass seed":22879,
		"Kwuarm seed":5299,
		"Adamant arrow":890,
		"Gold ore":444,
		"Law rune":563,
		"Berserker necklace":11128,
		"Berserker ring":6737,
		"Archer helm":3749,
		"Adamant dart":810,
		"Dark crab":11936,
		"Black chinchompa":11959,
		"Mahogany logs":6332
	},
	plantPots:{
		"Celastrus sapling (85)":{"id":22856,"components":[22869, 5354]},
		"Maple sapling (45)":{"id":5372,"components":[5314, 5354]},
		"Redwood  sapling (90)":{"id":22859,"components":[22871, 5354]},
		"Magic sapling (75)":{"id":5374,"components":[5316, 5354]},
		"Papaya sapling (57)":{"id":5501,"components":[5288, 5354]},
		"Yew sapling (60)":{"id":5373,"components":[5315, 5354]},
		"Calquat sapling (72)":{"id":5503,"components":[5290, 5354]},
		"Willow sapling (30)":{"id":5371,"components":[5313, 5354]},
		"Mahogany sapling (55)":{"id":21480,"components":[21488, 5354]},
		"Oak sapling (15)":{"id":5370,"components":[5312, 5354]},
		"Banana sapling (33)":{"id":5497,"components":[5284, 5354]},
		"Teak sapling (35)":{"id":21477,"components":[21486, 5354]},
		"Orange sapling (39)":{"id":5498,"components":[5285, 5354]},
		"Palm sapling (68)":{"id":5502,"components":[5289, 5354]},
		"Curry sapling (42)":{"id":5499,"components":[5286, 5354]},
		"Apple sapling (25)":{"id":5496,"components":[5283, 5354]},
		"Pineapple sapling (51)":{"id":5500,"components":[5287, 5354]},
		"Dragonfruit sapling (81)":{"id":22866,"components":[22877, 5354]},
		"Camphor sapling (66)":{"id":31502,"components":[31547, 5354]},
		"Ironwood sapling (80)":{"id":31505,"components":[31549, 5354]},
		"Rosewood sapling (92)":{"id":31508,"components":[31551, 5354]}
	}
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

	calcData.geTrackerId = result.itemData.name
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '');

	calcData.wikiId = result.itemData.name
	.replace(/\s+/g, '_');

	return calcData;
}