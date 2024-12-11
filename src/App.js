import React, { useState } from 'react';
import './App.css';
import { getWeather } from './services/weatherService';
import { getForecast } from './services/weatherService';
import { getAirQuality } from './services/weatherService';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';



const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const weatherData = await getWeather(city);
    const forecastData = await getForecast(city);
    const { lat, lon } = weatherData.coord;
    const airQualityData = await getAirQuality(lat, lon);

    setWeather(weatherData);
    setForecast(forecastData);
    setAirQuality(airQualityData);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  const processForecastData = (forecastData) => {
    const dailyData = forecastData.list.filter(item =>
      item.dt_txt.includes('12:00:00')
    );
  
    return dailyData.map(item => ({
      date: new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(item.dt_txt)),
      temp: item.main.temp,
      description: item.weather[0].description,
    }));
  };

  const getAirQualityLevel = (pm2_5) => {
    if (pm2_5 <= 12) return 'Good';
    if (pm2_5 <= 35) return 'Moderate';
    return 'Unhealthy';
  };

  const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000); // Converti in millisecondi e aggiungi offset
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const dailyForecast = forecast ? processForecastData(forecast) : [];

  return (
    <div className="App">
  <h1>Weather App</h1>
  <input
    type="text"
    placeholder="Enter city"
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />
  <button onClick={handleSearch} disabled={loading}>
    {loading ? 'Loading...' : 'Get Weather'}
  </button>

  {error && <p>{error}</p>}

  {weather && (
    <div>
          <div>
      <h2>{weather.name}, {weather.sys.country}</h2>
      <p>Temperature: {weather.main.temp}°C</p>
      <p>{weather.weather[0].description}</p>
      <p>Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}</p>
      <p>Sunset: {formatTime(weather.sys.sunset, weather.timezone)}</p>
    </div>
      <h2>{weather.name}, {weather.sys.country}</h2>
      <p>Temperature: {weather.main.temp}°C</p>
      <p>
  <img
    src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
    alt={weather.weather[0].description}
  />
  {weather.weather[0].description}
  </p>
    </div>
  )}

  {dailyForecast.length > 0 ? (
    <>
      <h3>5-Day Forecast</h3>
      <LineChart width={600} height={300} data={dailyForecast}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="temp" stroke="#8884d8" />
      </LineChart>
    </>
  ) : (
    <p>No forecast data available</p>
  )}

  {airQuality && (
    <div>
      <h3>Air Quality</h3>
      <p>PM2.5: {airQuality.list[0].components.pm2_5} µg/m³</p>
      <p>PM10: {airQuality.list[0].components.pm10} µg/m³</p>
      <p>CO: {airQuality.list[0].components.co} µg/m³</p>
      <p>NO2: {airQuality.list[0].components.no2} µg/m³</p>
      <p>Air Quality Level: {getAirQualityLevel(airQuality.list[0].components.pm2_5)}</p>
    </div>
  )}
</div>
    
  );
};

export default App;