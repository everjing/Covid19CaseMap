import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import CountyCard from './CountyCard';
import { CovidCaseService } from '../services/CovidCaseService';
import { MapUtil } from '../util/MapUtil';
import StateCard from './StateCard';
 
const Marker = ({ children }) => children;
 
class CovidMap extends Component {
  static defaultProps = {
    center: {
      lat: 42,
      lng: -74
    },
    zoom: 11
  };
 
   state = {
       zoom:11,
       bounds: null,
       points: {} // saved all points from the API
   };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAgbUfY70EqyziS2P6NEA2Y1lGf-PgwADU" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.handleMapInitialized()}
          onChange={({zoom, bounds}) => {
              this.setState({
                  zoom,
                  bounds
              });
          }}
        >
          {this.renderPoints()}
        </GoogleMapReact>
      </div>
    );
  }

  // ES2017 async await
  async handleMapInitialized() {
      try {
      const response = await CovidCaseService.getUsData() // Promise
      this.setState ({
          points : MapUtil.createClusterPoints(response.data)
      });
      } catch (e) {
          console.log(e);
      }
      //TODO render data from http://corona.lmao.ninja/v2/jhucsse/counties
  }
  
  renderPoints() {
    const clusterPoints = this.state.points[this.state.zoom];
    console.log(clusterPoints);
    const result = [];
    if (!clusterPoints) {
        return result;
    }

    if (Array.isArray(clusterPoints)) { // county points
      for (const point of clusterPoints) {
          if (MapUtil.inBoundary(point.coordinates, this.state.bounds)) {
              result.push(
                  <Marker key={`${point.province}-${point.county}`}
                          lat={point.coordinates.latitude} 
                          lng={point.coordinates.longitude}>
                      <CountyCard {...point}/>
                  </Marker>
              );
          }
      }
    } else { // state points 
     for (const state in clusterPoints) {
         const point = clusterPoints[state];
         if (MapUtil.inBoundary(point.coordinates, this.state.bounds)) {
            result.push(
                <Marker key={state}
                        lat={point.coordinates.latitude} 
                        lng={point.coordinates.longitude}>
                    <StateCard {...point} state = {state}/>
                </Marker>
            );
        }
        if (result.length >= this.limit) {
            break;
        }
     }
    }

    console.log(result);
    return result;
}
 
}



export default CovidMap;