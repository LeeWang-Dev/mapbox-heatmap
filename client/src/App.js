
import React, { useState, useEffect, useRef } from 'react';
import "./App.css";
import ReactMapGL, { 
  Source,
  Layer,
  ScaleControl,
  NavigationControl,
} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl";

import dataSource from "./assets/data/features.geojson";
import iconMarker from "./assets/images/home-icon.png";

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const HEATMAP_MAX_ZOOM_LEVEL = 12;

function App() {
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    longitude: 173.1657001,
    latitude: -41.4408959,
    zoom: 5
  });
  
  useEffect(() => {
    const map = mapRef.current.getMap();
    map.loadImage(iconMarker, (error, image) => {
        if (error) throw error;
        // Add the image to the map style.
        map.addImage('marker-icon', image);
    });
    return () => {
        if(map.hasImage('marker-icon')){
            map.removeImage('marker-icon');
        }
    }

  }, []);

  return (
      <div className="mapContainer">
        <ReactMapGL
              className="mapContainer"
              {...viewport}    
              width="100%"
              height="100%"
              mapStyle="mapbox://styles/mapbox/dark-v9"
              //mapStyle="mapbox://styles/mapbox/light-v10"
              //mapStyle="mapbox://styles/mapbox/streets-v11"
              //mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
              mapboxApiAccessToken="pk.eyJ1IjoibGVld2FuZ2RldiIsImEiOiJja2tnbDU2c2gwMHNvMndsdDF1d2pxNTQ2In0.zKeo06DtCh6fLifrbCZCFA"
              ref = {mapRef}
              attributionControl={false}
              maxZoom={22}
              minZoom={5}
              onViewportChange={setViewport}
          >
            {dataSource && (
              <Source
                  id="heatmapSource"
                  type="geojson"
                  data={dataSource}
              >
                <Layer 
                      id='heatmap-layer'
                      type='heatmap'
                      source='heatmapSource'
                      maxzoom={HEATMAP_MAX_ZOOM_LEVEL}
                      paint={{
                        'heatmap-weight':[
                          'interpolate',['linear'], ['zoom'],
                          5,
                          0.2,
                          HEATMAP_MAX_ZOOM_LEVEL,
                          1
                        ],
                       'heatmap-intensity': [
                          'interpolate',['linear'], ['zoom'],
                          5,
                          5,
                          HEATMAP_MAX_ZOOM_LEVEL,
                          1
                        ],
                        'heatmap-color': [
                          'interpolate',
                          ['linear'],
                          ['heatmap-density'],
                          0,
                          'rgba(33,102,172,0)',
                          0.2,
                          'rgb(103,169,207)',
                          0.4,
                          'rgb(209,229,240)',
                          0.6,
                          'rgb(253,219,199)',
                          0.8,
                          'rgb(239,138,98)',
                          0.9,
                          'rgb(255,201,101)'
                        ],
                       'heatmap-radius': [
                          'interpolate',['linear'],['zoom'],
                          5,
                          12,
                          HEATMAP_MAX_ZOOM_LEVEL,
                          20
                       ],
                       'heatmap-opacity': [
                          'interpolate',['linear'],['zoom'],
                          5,
                          1,
                          HEATMAP_MAX_ZOOM_LEVEL,
                          0.2
                       ]
                      }}
                  />
                  <Layer
                      id='point-layer'
                      type='symbol'
                      source='heatmapSource'
                      minzoom={HEATMAP_MAX_ZOOM_LEVEL}
                      layout={{
                          'icon-image': 'marker-icon',
                          'icon-size': 0.7,
                          'icon-offset':[0, -22],
                          'icon-allow-overlap':true,
                          'icon-ignore-placement': true
                      }}
                  />
              </Source>
            )}
            <NavigationControl style={{ top:10,right:10}}/>
            <ScaleControl style={{bottom:10,left:10}} />
        </ReactMapGL>
      </div>
  );
}

export default App;
