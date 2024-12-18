const API_KEY = 'fbcb06babde2d7fb64a9f2d6c629b049';  // Sostituisci con la tua API Key

export const getWeather = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  const alerts = data.alerts || []; // Se non ci sono allerte, restituisci un array vuoto
  return { ...data, alerts };
};

export const getForecast = async (city) => {
 
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }
  const data = await response.json();
  return data;
};

export const getAirQuality = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  

  if (!response.ok) {
    throw new Error('Failed to fetch air quality data');
  }

  const data = await response.json();
  return data;
};

