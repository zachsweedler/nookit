"use client";
import { Para } from "@/styles/Typography";
import { styled } from "styled-components";
import { Map, Marker, NavigationControl } from "react-map-gl";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'

export default function NookMap() {

   const location = useSelector((state) => state.viewNook.nook?.locations);

   const [view, setView] = useState({
      longitude: location?.latitude,
      latitude: location?.longitude,
      zoom: 15,
   });

   const size = 50;

   useEffect(() => {
      setView((prevView) => ({
         ...prevView,
         longitude: location?.longitude || 0,
         latitude: location?.latitude || 0,
      }));
   }, [location]);

   return (
      <Wrapper>
      <Para size="textlg" $weight="medium">Map</Para>
      <MapWrapper>
         {location?.longitude && location?.latitude ? (
           <Map
           {...view}
           onMove={(evt) => setView(evt.viewState)}
           mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
           style={{ width: "100%", height: "100%" }}
           scrollZoom={false}
           mapStyle="mapbox://styles/mapbox/streets-v9"
        >
           <Marker
              longitude={location?.longitude}
              latitude={location?.latitude}
              anchor="bottom"
           >
              <Image
                 src="/map-marker-black.svg"
                 alt=""
                 width={size}
                 height={size}
                 style={{ zIndex: "1000" }}
              />
           </Marker>
           <NavigationControl showCompass={false} position="top-left" />
        </Map>
         ) : (
            <p>Loading map...</p>
         )}
      </MapWrapper>
   </Wrapper>

      
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
   column-gap: 20px;
   width: 100%;
`;

const MapWrapper = styled.div`
   height: 400px;
   width: 100%;
   overflow: hidden;
   border-radius: 12px;
`;
