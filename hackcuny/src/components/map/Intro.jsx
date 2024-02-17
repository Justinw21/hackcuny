import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import './intro.css'

function Intro() {
  const position = { lat: 40.7128, lng: -74.0060 };
  const [place, setPlace] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'us' }
      });
      autocomplete.addListener('place_changed', () => {
        //actual place needs to be represented on map
        const selectedPlace = autocomplete.getPlace();
        //console.log(selectedPlace)
      });
    }
  }, [inputRef]);

  const handleChange = (event) => {
    setPlace(event.target.value);
  };

  return (
    <div className="map-container">
      <label htmlFor="search">Enter a place: </label>
      <input
        type="text"
        id="search"
        ref={inputRef} 
        value={place}
        onChange={handleChange}
        required
      />
      <LoadScript
        googleMapsApiKey="AIzaSyCwxPwfxk2Ln1ERsqjtPOc08-gJDIrAyBg"
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={{height: '90vh', width: '100%'}}
          zoom={13}
          center={position}
          gestureHandling="greedy"
        >
          {/* Child components, markers, etc. */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Intro;
