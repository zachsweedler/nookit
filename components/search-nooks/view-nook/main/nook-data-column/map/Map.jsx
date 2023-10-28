"use client";
import { Para } from "@/styles/Typography";
import { styled } from "styled-components";
import { Map, Marker, NavigationControl } from "react-map-gl";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'

export default function NookMap() {

   const nook = useSelector((state) => state.viewNook.nook);

   const [view, setView] = useState({
      longitude: nook?.location_latitude,
      latitude: nook?.location_longitude,
      zoom: 15,
   });

   const size = 50;

   useEffect(() => {
      setView((prevView) => ({
         ...prevView,
         longitude: nook?.location_longitude || 0,
         latitude: nook?.location_latitude || 0,
      }));
   }, [nook]);

   return (
      <Wrapper>
      <Para size="textlg" $weight="medium">Map</Para>
      <MapWrapper>
         {nook.locations.longitude && nook.locations.latitude ? (
           <Map
           {...view}
           onMove={(evt) => setView(evt.viewState)}
           mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
           style={{ width: "100%", height: "100%" }}
           scrollZoom={false}
           mapStyle="mapbox://styles/mapbox/streets-v9"
        >
           <Marker
              longitude={nook.locations.longitude}
              latitude={nook.locations.latitude}
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
