import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';

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
}

  render() {
    console.log(this.state)
    return (
      <View style={styles.container}>
      <Text>Home Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
