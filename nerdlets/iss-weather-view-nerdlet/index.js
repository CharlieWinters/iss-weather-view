import React from 'react';
//import the appropriate NR1 components
import { NrqlQuery, PlatformStateContext, NerdletStateContext, AutoSizer } from 'nr1';
//import our 3rd party libraries for the geo mapping features
import { Map, TileLayer, Popup, Marker } from 'react-leaflet';
//import utilities we're going to need
import L from 'leaflet'


export const suitcasePoint = new L.Icon({
    iconUrl: 'https://www.svgrepo.com/show/170716/international-space-station.svg',
    iconRetinaUrl: 'https://www.svgrepo.com/show/170716/international-space-station.svg',
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
    iconSize: [40, 40],
    shadowUrl: './marker-shadow.png',
    shadowSize: [29, 40],
    shadowAnchor: [7, 40],
  })

const COLORS = [
    "#2dc937",
    "#99c140",
    "#e7b416",
    "#db7b2b",
    "#cc3232"
];

export default class MyNerdlet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            center: [10.5731, -7.5898],
            zoom: 2,
            lat: 51.505,
            lng: -0.09
        }
    }

    render() {
        const { zoom, center, lat, lng } = this.state;
        const position = [lat, lng]
        return <PlatformStateContext.Consumer>
            {(platformUrlState) => (
              <NerdletStateContext.Consumer>
                {(nerdletUrlState) => (
                    <AutoSizer>
                    {({height, width}) => (
                        <Map
                        className="containerMap"
                        style={{height: `${height-125}px`}}
                        center={center}
                        zoom={zoom}
                        zoomControl={true}
                        ref={(ref) => { this.mapRef = ref }}>
                            <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                            <NrqlQuery accountId={1652861} query="SELECT lat, lon, latitude, longitude, velocity, city_name, weather.description from issSample limit 1">
                            {({ data }) => {
                                if (data){
                                    debugger
                                    return data[0].data.map(datapoint => {
                                        let position = [datapoint.latitude, datapoint.longitude]
                                        return (
                                                <Marker position={position} icon={suitcasePoint}>
                                                    <Popup>
                                                        City Name: {datapoint.city_name} <br />
                                                        Weather: {datapoint["weather.description"]}
                                                    </Popup>
                                                </Marker>
                                            )
                                    })
                                }
                                return 'loading'
                            }}
                            </NrqlQuery>
                        </Map>
                                       
                    )}
                    </AutoSizer>
                )}
              </NerdletStateContext.Consumer>
            )}
        </PlatformStateContext.Consumer>;
    }
}