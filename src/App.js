import React, {useState, useEffect} from "react";
import axios from 'axios';
import './App.css';

function App() {

  const[countries, setCountries] = useState([]);
  const[states, setStates] = useState([]);
  const[cities, setCities] = useState([]);
  const[selectedCountry, setSelectedCountry] = useState('');
  const[selectedState, setSelectedState] = useState('');
  const[selectedCity, setSelectedCity] = useState('');
  const[message, setMessage] = useState('');

  useEffect(()=>{
    axios.get('https://crio-location-selector.onrender.com/countries')
    .then(response => {
      setCountries(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the countries!',error);
    });
  }, []);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setMessage('');

    if(country){
      axios.get(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then(response => {
        setStates(response.data);
        setCities([]);
      })
      .catch(error => {
        console.error(`There was an error fetching the states for ${country}!`,error);
      });
    }else{
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setMessage('');

    if(state){
      axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`)
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        console.error(`There was an error fetching the cities for ${state} in ${selectedCountry}!`,error);
      });
    }else{
      setCities([]);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if(city){
      setMessage(`You selected ${city}, ${selectedState}, ${selectedCountry}`);
    } else {
    setMessage('');
    }
  };



  return (
    <div className = "App">
      <h1>Select Location</h1>
      <div className="dropdown-container">
      <div className = "dropdown">
        <select id="country" value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      <div className = "dropdown">
        <select id="state" value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div className = "dropdown">
        <select id="city" value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
    </div>
    <div>
    {message && <p>{message}</p>}
    </div>
      {/* {message && <p>{message}</p>} */}
    </div>

  );
}

export default App;
