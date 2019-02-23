import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';
import { dbRef } from '../constants/constants'

export default class Home extends React.Component {
  constructor(props){
    super(props)
    this.state={
      
      
    }
  }

  componentDidMount(){
    this.setState({
      uid : this.props.navigation.state
    })
    fetch(`${dbRef}/usersList.json`)
    .then(data => {
        return data.json();
    })
    .then(data2 => {
      // console.log(data2)
        for(let i in data2){
          this.state.usersList.push(data2[i].uid);
        }
        this.setState(this.state.usersList)
    })
}

  render() {
    console.log(this.state)
    console.log(dbRef)
    return (
      <View style={styles.container}>
      <Text>App Under Construction</Text>
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
