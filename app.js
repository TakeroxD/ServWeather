//Init
const express = require('express')
const weather = require('./weather.js')
const app = express()
const port = process.env.PORT || 3000

//Areas
app.get('/',function(req,res){
	res.send(`<h1>Esta es la main view casi vacía</h1>,
			  <h3>Agrega en el URL /weather?search=LUGAR_QUE_QUIERES_CONSULTAR :)</h3>`)
})


app.get('/weather',function(req,res){
	if(!req.query.search){
		res.send({error: 'Necesitas escribir /weather?search=LUGAR_QUE_QUIERES_CONSULTAR'})
	}
	weather.getLocation(req.query.search,function(error,response){
		if (error){
			res.send({error: 'Error intentado obtener localización :(' + error})
		}
		var name = response.place_name
		var center = response.center
		var loc = '['+center[1]+','+center[0]+']'
		weather.getWeather(center[1],center[0], function(error, response){
			if (error) {
				//return res.send('Error intentado obtener pronóstico :('{error: error})
				res.send({error: 'Error intentado obtener pronóstico :(' + error})
			}
			res.send({name,
					  loc,
					  summary: response.summary,
					  temperature: response.temperature,
					  humidity: response.humidity,
					  precipProbability: response.precipProbability,
					  string: 'Para '+name+' '+loc+' se pronostica '+response.summary+
					  '. La temperatura actual es '+response.temperature+
					  ' con humedad de '+response.humidity+
					  ' y '+response.precipProbability+' de probabilidad de lluvia'})
		})
	})	
})


 app.get('*', function(req,res){
 	res.send({Message: 'Jaja ke pex esa ruta no existe BB',
 		      Disclaimer: 'Este mensaje fue considerado adecuado ;)',
 		      Help: 'Debes poner /weather?search=LUGARQUEBBUSCAS'})
 })

//Run
app.listen(port,function(){
	console.log('Weather request up babe!')
})