"use client";

import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
function Intro() {
  const position = { lat: 40.7128, lng: -74.0060 };
  const [open, setOpen] = useState(false);

  return (
    <LoadScript
        googleMapsApiKey="AIzaSyCwxPwfxk2Ln1ERsqjtPOc08-gJDIrAyBg"
      >
        <GoogleMap
          mapContainerStyle={{height: '100vh',width: '100%'}}
          zoom={13}
          center={position}
          gestureHandling="greedy" // Set the gestureHandling property here
        >
          { /* Child components, markers, etc. */ }
        </GoogleMap>
      </LoadScript>
  );
}
export default Intro