const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

// Variable d'environnement 
const port = process.env.PORT
const app = express();
const apiKey = process.env.API_KEY

// Variable
const weatherData = []; // Contient les données météo d'une ville en un objet

// Mise en place de la vue
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Coucou hibou coucou hibouuuuuu')
})

app.get('/accueil', (req, res) => { 
    const data = {
        long: 5.172575,
        lat: 43.477005,
    }

    console.log(data);
    

    res.render('accueil', {data: data, weatherData: weatherData})
})

app.post('/getCity', async (req, res) => {
    const city = req.body.city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    try {
        const response = await fetch(url)
        if(!response.ok){
            throw new Error('Erreur de requête : ' + response.status);
        }
        
        const data = await response.json()
        const weatherInfo = {}
        // console.log(data);
        weatherInfo.temperature = data.main.temp;
        weatherInfo.latitude = data.coord.lat
        weatherInfo.longitude = data.coord.lon
        weatherInfo.icon = data.weather[0].icon
        weatherInfo.description = data.weather[0].description
        weatherInfo.tempMin = data.main.temp_min;
        weatherInfo.tempMax = data.main.temp_max;
        weatherInfo.ressenti = data.main.feels_like
        weatherInfo.city = city
        weatherData.push(weatherInfo)

    } catch (error) {
        console.error('Erreur:', error);
    }
    
    res.redirect('accueil')
})

app.post('/deleteCard', (req, res) => {
    weatherData.splice(req.body.sub, 1)
    res.status(201).redirect('/accueil')
})


app.listen(port, () => {
    console.log(`Le serveur tourne sur le port ${port}`);
})