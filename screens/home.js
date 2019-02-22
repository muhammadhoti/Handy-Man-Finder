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
    fetch(`https://i-friend-you.firebaseio.com/usersList.json`)
    .then(data => {
        return data.json();
    })
    .then(data2 => {
        for(let i in data2){
          this.state.usersList.push(data2[i].uid);
        }
    })
}

  render() {
    console.log(this.state)
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
