import React, { useState } from 'react';
import './App.css';
import { getWeather } from './services/weatherService';
import { getForecast } from './services/weatherService';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';


const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(city);
      const forecastData = await getForecast(city); 
      setWeather(data);
      setForecast(forecastData);
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
</div>
    
  );
};

export default App;