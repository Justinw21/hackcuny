"use client";

import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

function Intro() {
  const position = { lat: 40.7128, lng: -74.0060 };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey="AIzaSyCwxPwfxk2Ln1ERsqjtPOc08-gJDIrAyBg">
      <div style={{ height: "100vh", width: "100%" }}>
        <Map zoom={9} center={position} mapId="4d4e0bea4cc94c64">
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin
              background={"grey"}
              borderColor={"green"}
              glyphColor={"purple"}
            />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <p>I'm in Hamburg</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
export default Intro