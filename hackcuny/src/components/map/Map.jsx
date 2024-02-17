import React from "react";
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
        googleMapsApiKey: "AIzaSyCwxPwfxk2Ln1ERsqjtPOc08-gJDIrAyBg",
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

    if(loadError) return "Error loading maps"
    if(!isLoaded) return "Loading maps"
    return(
        <div>
        <h1>Pads & Tampons</h1>

        <Search/>

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

function Search(){
    const {ready, value, suggestions:{status, data}} = usePlacesAutocomplete({
        requestOptions:{
            location:{lat: ()=> 40.7128, lng: ()=> -74.0060},
            radius:21600,
        },
    });
}