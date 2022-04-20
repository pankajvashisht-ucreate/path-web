import React, { memo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
const GoogleURl = (apiKey) =>
  `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
const configKey = (apiKey) => {
  const googleMapsScriptUrl = GoogleURl(apiKey);
  if (
    document.querySelectorAll(`script[src="${googleMapsScriptUrl}"]`).length > 0
  ) {
    return Promise.resolve();
  }
  let googleMapsScript = document.createElement("script");
  googleMapsScript.src = googleMapsScriptUrl;
  document.body.appendChild(googleMapsScript);
  return new Promise((resolve) => {
    googleMapsScript.addEventListener("load", () => resolve());
  });
};

const MAP = React.memo(
  ({
    lat,
    lng,
    zoom = 13,
    className = "",
    width = "100%",
    height = "700px",
    name,
    showMarker = false,
    isPolyline = true,
    polylineArray = [],
    googleRoute = [],
    showGoogleRoute = false,
    startLocation = "",
    endLocation = ""
  }) => {
    const mapRef = useRef(null);
    useEffect(() => {
      if (!polylineArray?.length) {
        return;
      }
      const loadScript = () => {
        return configKey(process.env.REACT_APP_GOOGLE_KEY);
      };
      const initMap = () => {
        const { google } = window;
        if (!google) {
          return;
        }
        const { lat, lng } = googleRoute[0];
        const mapDiv = mapRef.current;
        const map = new google.maps.Map(mapDiv, {
          center: { lat: parseFloat(lat), lng: parseFloat(lng) },
          zoom,
          draggable: true
        });
        const infowindow = new google.maps.InfoWindow({
          content: name
        });
        if (isPolyline) {
          const userPath = new google.maps.Polyline({
            path: polylineArray,
            geodesic: true,
            strokeColor: "#8CA3F3",
            strokeOpacity: 1.0,
            strokeWeight: 6
          });
          userPath.setMap(map);
        }
        if (showGoogleRoute) {
          const googlePath = new google.maps.Polyline({
            path: googleRoute,
            geodesic: true,
            strokeColor: "#00FF00",
            strokeOpacity: 2.0,
            strokeWeight: 6
          });
          googlePath.setMap(map);
          const sourcePoint = googleRoute[0];
          const source = new google.maps.Marker({
            position: new google.maps.LatLng(sourcePoint.lat, sourcePoint.lng),
            map,
            title: startLocation,
            draggable: true,
            label: { text: startLocation, color: "8CA3F3", fontSize: "20px" }
          });
          source.addListener("click", () => {
            infowindow.open(map, source);
          });
          const destinationPoint = googleRoute[googleRoute?.length - 1];
          const destination = new google.maps.Marker({
            position: new google.maps.LatLng(
              destinationPoint.lat,
              destinationPoint.lng
            ),
            map,
            title: endLocation,
            draggable: true,
            label: { text: endLocation, color: "#8CA3F3", fontSize: "20px" }
          });
          destination.addListener("click", () => {
            infowindow.open(map, destinationPoint);
          });
        }
        if (showMarker) {
          polylineArray.forEach(({ lat, lng, name }) => {
            const marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              map,
              title: name,
              draggable: true,
              label: { text: name, color: "white" }
            });
            marker.addListener("click", () => {
              infowindow.open(map, marker);
            });
          });
        }
      };
      console.log("google");
      loadScript()
        .then(() => {
          initMap();
        })
        .catch((err) => {
          console.error(err);
        });
    }, [
      isPolyline,
      lat,
      lng,
      name,
      zoom,
      polylineArray,
      showMarker,
      googleRoute,
      showGoogleRoute,
      startLocation,
      endLocation
    ]);
    return (
      <div
        className={className}
        ref={mapRef}
        style={{
          height,
          width
        }}
      />
    );
  }
);

MAP.proptypes = {
  lat: PropTypes.any.isRequired,
  lng: PropTypes.any.isRequired,
  zoom: PropTypes.number,
  className: PropTypes.string,
  showMarker: PropTypes.bool,
  isPolyline: PropTypes.bool,
  polylineArray: PropTypes.array,
  googleRoute: PropTypes.array,
  showGoogleRoute: PropTypes.bool,
  startLocation: PropTypes.string,
  endLocation: PropTypes.string
};

export default memo(MAP);
