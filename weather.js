//Credentials & request init
const request = require('request')

if(process.env.NODE_ENV === 'production'){
	var mapboxKey = process.env.MAPBOX_KEY
	var darkSkyKey = process.env.DARKSKY_KEY
} else {
	const credentials = require('./credentials.js')
	var mapboxKey = credentials.MAPBOX_TOKEN
	var darkSkyKey = credentials.DARK_SKY_SECRET_KEY
}

//Methods
//Request Mapbox
const getLocation = function(cityName,callback){
	const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+cityName+'.json?access_token='+mapboxKey
	request({url, json: true},function(error, response){
		if(error){
			callback(error, undefined)
		} else {
			const data = response.body
			if(data.message){
				callback(data.message,undefined)
			} else if(data.features[0]==undefined){
				callback(data.query+' was not found',undefined)
			} else {
				const info = {
					place_name: data.features[0].place_name,
					center: data.features[0].center 
				}
				callback(undefined, info)
			}
		}
	})
}

//Request DarkSky
const getWeather = function(latitude,longitude,callback){
	const url = 'https://api.darksky.net/forecast/'+darkSkyKey+'/'+latitude+','+longitude+
	'?exclude=minutely,daily,alerts,flags&lang=es&units=si'

	request({url, json: true},function(error, response){
		if(error){
			callback(error,undefined)
		} else {
			const data = response.body
			if(data.code){
				callback(data.code+' - '+data.error,undefined)
			} else {
				const info = {
					summary: data.hourly.summary,
					temperature: data.currently.temperature.toFixed(1)+'°C',
					humidity: (data.currently.humidity*100).toFixed(0)+'%',
					precipProbability: (data.currently.precipProbability*100).toFixed(0)+'%'
				}
				callback(undefined, info)
			}
		}
	})
}

//Export
module.exports = {
	getLocation: getLocation,
	getWeather: getWeather
}