import React, { useState, useEffect } from 'react';
import dateFormat from './dateformat';

const App = () => {
  const [curCity, setCurCity] = useState('Austin');
  const [newCity, setNewCity] = useState('');
  const [timeData, setTimeData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [weatherAvailable, setWeatherAvailable] = useState(true);

  useEffect(() => {
    fetchNewWeatherData(curCity);
  }, [curCity]);

  const fetchNewWeatherData = async (cityName) => {
    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`);
      const geoData = await geoResponse.json();
      if (geoData.results[0] != null) {
        const city = geoData.results[0];
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=temperature_2m&temperature_unit=fahrenheit`);
        const data = await response.json();
        console.log(data);
        setTimeData(data.hourly.time);
        setTempData(data.hourly.temperature_2m);
        setWeatherAvailable(true);
      } else {
        setWeatherAvailable(false);
        console.log(`Could not find weather for ${cityName}.`);
      }
    } catch (error) {
      setWeatherAvailable(false);
      console.log(error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '150vh',
      width: '100vw',
      backgroundColor: 'lightgray',
      color: 'black',
      fontFamily: "copperplate",
      font: 'largest',
    }}>
      <h1>{curCity} Weather</h1>
      <div>
        <button onClick={() => {
          setCurCity('Dallas');
          setNewCity('');
        }}>Dallas</button>
        <button onClick={() => {
          setCurCity('Austin');
          setNewCity('');
      }}>Austin</button>
        <button onClick={() => {
          setCurCity('Houston');
          setNewCity('');
        }}>Houston</button>
      </div>
      <br />
      <h3>Choose any city:</h3>
      <row>
        <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <button onClick={() => setCurCity(newCity)}>+</button>
      </row>
      {weatherAvailable ? (
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '15vw',
        }}>
          <div style={{ 
            flex: '0.5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', 
          }}>
            <h3>Time</h3>
            {timeData.slice(0,10).map((time, index) => (
              <p key={index}>{index+12 + ":00"}</p>
              ))}
          </div>
          <div style={{ 
            flex: '0.5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', 
          }}>
            <h3>Temperature</h3>
            {tempData.slice(0,10).map((temp, index) => (
              <p key={index}>{temp} °F</p>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>Weather not available for {curCity}.</h3>
        </div>
      )}
    </div>
  );
};

export default App;