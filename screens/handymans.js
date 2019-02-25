import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';
import { dbRef } from '../constants/constants'

export default class Handymans extends React.Component {
  constructor(props){
    super(props)
    this.state={
    
    }
    this.check= this.check.bind(this)
  }

  componentDidMount(){
      //Getting Uid From Props
      {
        this.setState({
        uid : this.props.navigation.state.params.uid
      })
    }
}

check(){

}

render() {
    console.log(this.state)
    return (
      <View style={styles.container}>
      <Text>Handymans Page</Text>
      <Button title = "check" onPress={()=>{this.setState({check : "check"})}}/>
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
