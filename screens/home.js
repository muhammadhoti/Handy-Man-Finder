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
    //Getting Uid From Props
    {
      this.setState({
      uid : this.props.navigation.state.params
    })
  }
    //Fetching User List From Database
    {
      fetch(`${dbRef}/usersList.json`)
      .then(data => {
        return data.json();
      })
      .then(data2 => {
        const users = [];
      // console.log(data2)
        for(let i in data2){
          users.push(data2[i].uid);
        }
        this.setState({
          usersList : users
        })
      })
    }
    {
      //Fetching User Info From Database
      fetch(`${dbRef}/userInfo.json`)
      .then(data => {
        return data.json();
      })
      .then(data2 => {
        let users = [];
        let user = {};
        const { uid } = this.state;
        for(let i in data2){
          data2[i].uid === uid ?
          user = data2[i]
          :
          users.push(data2[i])
        }
        this.setState({
          otherUsers : users,
          currentUser : user
        })
      })
    }
}

render() {
    return (
      <View style={styles.container}>
      <Text>App Under Construction</Text>
      <Button title = "check" onPress={()=>{this.setState({check:"check"})}}/>
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
