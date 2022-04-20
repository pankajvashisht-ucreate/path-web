import {useState} from 'react';
import Polyline from "@mapbox/polyline";
import {useDebounceCallback} from 'hook';
import {GoogleMap} from 'component';
import {getJourneyInfo} from 'utils/helper';
import fakeDate from './demoData.json';
import './App.css';


function App() {
  const [googleRoute, setGoogleRoute] = useState([]);
  const [journeyId, setJourneyId] = useState("");
  const [polyline, setPolyline] = useState([]);
  const [showMarker, setShowMarker] = useState(true);
  const [loading, setLoading] = useState(false);
  const [locationInfo, setLocationInfo] = useState({
    startLocation: "",
    endLocation: ""
  });
  const findJourneyInfo = useDebounceCallback((value) => {
    if (!value) {
      return;
    }
    setLoading(true);
    getJourneyInfo(value)
      .then((data) => console.log(data))
      .catch((err) => {
        console.error(err);
        const {
          data: {
            routePolyline,
            journeyRoutes = [],
            source,
            destination,
            journeyType
          }
        } = fakeDate;
        if (journeyType === "default") {
          setLocationInfo({
            startLocation: source,
            endLocation: destination
          });
          const polylineCoodinates = journeyRoutes?.map(
            ({ longitude, latitude }) => ({
              lat: parseFloat(latitude),
              lng: parseFloat(longitude)
            })
          );
          polylineCoodinates.shift();
          setPolyline(polylineCoodinates);
          setGoogleRoute(
            Polyline.decode(routePolyline).map(([lat, lng]) => ({
              lat,
              lng
            }))
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  });
  const handleChange = ({ target: { value } }) => {
    setJourneyId(value);
    findJourneyInfo(value);
  };
  return (
    <div className="App">
      <h1>Journey Info</h1>
      <div className="flex">
        <input
          className="input"
          value={journeyId}
          onChange={handleChange}
          type="number"
          placeholder="Enter Journey ID"
          step="0"
        />
        <div className="margin">
          <label className="container">
            Show Marker
            <input
              checked={showMarker}
              type="checkbox"
              onChange={({ target: { checked } }) => {
                setShowMarker(checked);
              }}
            />
            <span className="checkmark"></span>
          </label>
        </div>
      </div>
      {loading && (
        <div>
          {" "}
          <h2>Please Wait... </h2>{" "}
        </div>
      )}
      {!loading && locationInfo.startLocation && (
        <div className="routeInfo">
          <div className="routeText">
            <b>Source </b>: <h6>{locationInfo.startLocation}</h6>
          </div>
          <div className="routeText">
            <b>Destination </b> : <h6>{locationInfo.endLocation}</h6>
          </div>
        </div>
      )}
      {polyline.length ? (
        <GoogleMap
          isPolyline
          polylineArray={polyline}
          showMarker={showMarker}
          zoom={14}
          className="googlemap"
          height="85vh"
          googleRoute={googleRoute}
          showGoogleRoute
          startLocation={locationInfo.startLocation}
          endLocation={locationInfo.endLocation}
        />
      ) : null}
    </div>
  );
}

export default App;
