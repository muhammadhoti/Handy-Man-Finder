import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';
import { dbRef, googleAPI } from '../constants/constants'
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default class Maps extends React.Component {
  constructor(props){
    super(props)
    this.state={
    
    }
  }

  componentDidMount(){
    //Getting Uid From Props
    {   
    this.setState({
        origin : this.props.navigation.state.params.origin,
        destination : this.props.navigation.state.params.destination
      })
    }
}

render() {
  console.log(this.state.destination)
  const {origin,destination} = this.state
    return (
        <View style={{
            flex: 1
            }}>
            {origin && destination &&
            <MapView 
              style={{
              flex: 1
              }}
              initialRegion={{
                latitude: origin.latitude,
                longitude: origin.longitude,
                latitudeDelta: 0.0072,
                longitudeDelta: 0.0051
              }}>
              <MapView.Marker
                coordinate={{
                latitude: origin.latitude,
                longitude: origin.longitude,
                }}
                />
              <MapView.Marker 
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
                }}/>
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={googleAPI}
                strokeWidth={3}
                strokeColor="red"
                />
            </MapView>
            }
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
