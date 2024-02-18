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

import { getDocs, addDoc, collection } from "firebase/firestore";
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

    const [marker, setMarker] = React.useState(null);

    //currently selected marker
    const [selected, setSelected] = React.useState(null);

    const onMapClick = React.useCallback((event)=>{
        setMarker({
            lat:event.latLng.lat(),
            lng:event.latLng.lng(),
            time: new Date(),
        });
    },[]);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map)=>{
        mapRef.current = map;
    },[]);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
        setMarker({
            lat: lat,
            lng: lng,
            time: new Date(),
        });
    }, []);

    const [locationData, setLocationData] = useState(null); // State to hold the data of the clicked location


    const [lastDateUpdate, setLastDateUpdate] = useState('');
    const [lastTamponUpdate, setLastTamponUpdate] = useState('');
    const [lastPadUpdate, setLastPadUpdate] = useState('');
    const [infoFound, setInfoFound] = useState(false);
    const onMarkerClick = async (marker) => {
      setLastDateUpdate('');
      setLastPadUpdate('');
      setLastTamponUpdate('');
      setInfoFound(false);
      try {
          // Fetch location data from Firestore based on marker position
          setSelected(marker);
          const querySnapshot = await getDocs(collection(db, "addresses"));
          querySnapshot.forEach((doc) => {
              const data = doc.data();
              // Check if the marker's position matches the location data Math.round(value/1000)*1000
              if (Math.round(data.lat*1000)/1000 == Math.round(marker.lat*1000)/1000 && Math.round(data.lng*1000)/1000 == Math.round(marker.lng*1000)/1000) {
                  // Set location data to be displayed
                  console.log(Math.round(data.lat/1000)*1000)
                  setLocationData(data);
                  const timestamp = data.date;
                  const date = timestamp.toDate();
                  const formattedDate = formatRelative(date, new Date());
                  setLastDateUpdate(formattedDate);
                  setLastPadUpdate(data.padAnswer);
                  setLastTamponUpdate(data.tamponAnswer);
                  setInfoFound(true);
              }
          });
      } catch (error) {
          console.error("Error fetching location data:", error);
      }
  };

    if(loadError) return "Error loading maps"
    if(!isLoaded) return "Loading maps"
    return(
        <div style={{display:"flex"}}>

        <div>
            <br />
            <br />
        <Locate panTo={panTo} />
        <Search panTo={panTo} />
        {marker ? <div>
        <Form latitude={marker.lat} longitude={marker.lng}/></div> : null}
        </div>
        <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        onClick={onMapClick}
        onLoad={onMapLoad}
        >
            {marker && (
                <Marker
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => {
                        
                        onMarkerClick(marker);
                    }}
                />
            )}

            {selected ? (
            <InfoWindow position={{lat:selected.lat, lng:selected.lng}} onCloseClick={()=>{
                setSelected(null);
            }}>
                <div style={{color:"black"}}>
                {infoFound?<DisplayDataPopUp timestamp={lastDateUpdate} tamponTF={lastTamponUpdate} padTF={lastPadUpdate}/>: <p>No Information Available</p>}
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

function Form({latitude, longitude}){
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

function DisplayDataPopUp({timestamp, tamponTF, padTF}){
  //info present = true => display : "no information yet"
  return(
    <div>
      <p>Tampons: {tamponTF}</p>
      <p>Pads: {padTF}</p>
      <p>Last Updated: {timestamp}</p>
    </div>
  )
}