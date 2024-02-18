import React, { useState } from "react";
import { 
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
} from "@react-google-maps/api";
import { formatRelative, nextDay } from "date-fns";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

const libraries = ["places"];
const mapContainerStyle = {
    width:'100vw',
    height:'100vh',
}
const center = {
    lat: 40.7128, lng: -74.0060
}
export default function GMap(){
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    })

    const [markers, setMarkers] = React.useState([]);

    //currently selected marker
    const [selected, setSelected] = React.useState(null);

    const onMapClick = React.useCallback((event)=>{
        setMarkers((current) => [
            ...current, 
            {
            lat:event.latLng.lat(),
            lng:event.latLng.lng(),
            time: new Date(),
            },
        ]);
    },[]);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map)=>{
        mapRef.current = map;
    },[]);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
        setMarkers((current) => [
            ...current, 
            {
            lat: lat,
            lng: lng,
            time: new Date(),
            },
        ]);
      }, []);

    if(loadError) return "Error loading maps"
    if(!isLoaded) return "Loading maps"
    return(
        <div style={{display:"flex"}}>

        <div>
            <br />
            <br />
        <Locate panTo={panTo} />
        <Search panTo={panTo} />
        {selected?<Form latitude={selected.lat} longitude={selected.lng}/>:null}
        </div>
        <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        onClick={onMapClick}
        onLoad={onMapLoad}
        >
            {markers.map((marker) => (
                <Marker key={marker.time.toISOString} 
                position={{lat: marker.lat , lng:marker.lng}}
                onClick={() => {
                    setSelected(marker);
                }}
                />
                
            ))}

            {selected ? (
            <InfoWindow position={{lat:selected.lat, lng:selected.lng}} onCloseClick={()=>{
                setSelected(null);
            }}>
                <div style={{color:"black"}}>
                    <h2>Pad Tampon Spotted</h2>
                    <p>Spotted {formatRelative(selected.time, new Date())}</p>
                </div>
            </InfoWindow>):null}

        </GoogleMap>
        </div>
    )
}

function Locate({ panTo }) {
    return (
      <button
        className="locate"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => null
          );
        }}
      >
        <img src="" alt="compass" />
      </button>
    );
  }

function Search({ panTo }) {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        location: { lat: () => 43.6532, lng: () => -79.3832 },
        radius: 100 * 1000,
      },
    });
  
    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
  
    const handleInput = (e) => {
      setValue(e.target.value);
    };
  
    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
  
      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        panTo({ lat, lng });
      } catch (error) {
        console.log("😱 Error: ", error);
      }
    };
  
    return (
      <div className="search" style={{minWidth:"25vw"}}>
        <Combobox onSelect={handleSelect}>
          <ComboboxInput
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Search your location"
          />
          <ComboboxPopover>
            <ComboboxList style={{backgroundColor:"black"}}>
              {status === "OK" &&
                data.map(({ id, description }) => (
                  <ComboboxOption key={id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </div>
    );
}  

function Form(latitude, longitude){
    const [tampon, setTampon] = useState('Yes');
    const [pad, setPad] = useState('Yes');
    const handleTamponChange = (event) => {
        setTampon(event.target.value);
    };
    const handlePadChange = (event) => {
        setPad(event.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const collectionRef = collection(db, "addresses");
      
      try {
        const entryData = {
          date: new Date(),
          tamponAnswer: tampon,
          padAnswer: pad,
          lat: latitude,
          lng: longitude,
        };
      const docRef = await addDoc(collectionRef, entryData);
      console.log("Review added with ID: ", docRef.id);

      alert("Review submitted successfully!");
      } catch (error) {
      console.error("Error adding review: ", error);
      }
    };

    //implement submission which sends data to firestore
    //info: user name/id + tampon answer + pad answer + lat lng

    return(
      <form onSubmit = {handleSubmit}>
        <div style={{display:"flex" , flexDirection:"column" , alignItems:"center"}}>
            <h3>Submit a Review</h3>
            <div style={{display:"flex"}}>
            <h5 style={{margin:"0.5rem"}}>Tampons:</h5>
            <select value={tampon} onChange={handleTamponChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            </div>
            <br />
            <div style={{display:"flex"}}>
            <h5 style={{margin:"0.5rem"}}>Pads:</h5>
            <select value={pad} onChange={handlePadChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            </div>
            <br />
            <button type = "submit">Submit</button>
        </div>
      </form>
    )
}