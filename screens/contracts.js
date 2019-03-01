import React from 'react';
import {StyleSheet,
       View, 
       Button } from 'react-native';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';
import { dbRef } from '../constants/constants'
import {Container, 
        Header, 
        Content, 
        List, 
        ListItem, 
        Text, 
        Separator } from 'native-base';

export default class Contracts extends React.Component {
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
    //Getting Contracts Props
    {
      fetch(`${dbRef}/contracts.json`)
      .then(data => {
        return data.json();
      })
      .then(data2 => {
        let received = [];
        let requested = [];
        let accepted = [];
        const { uid } = this.state;
        for(let i in data2){
          if(data2[i].sender === uid && data2[i].status === "pending"){
            requested.push(data2[i])
          }
          else if(data2[i].receiver === uid && data2[i].status === "pending"){
            received.push(data2[i])
          }
          else if((data2[i].sender === uid || data2[i].receiver === uid) && data2[i].status === "accepted"){
            accepted.push(data2[i])
          }
        }
        this.setState({
          contracts : contracts
        })
      })
    }
}

check(){

}

render() {
    console.log(this.state)
    return (
      <Container>
        <Header />
        <Content>
          <Separator bordered>
            <Text>REQUESTED</Text>
          </Separator>
          <ListItem>
            <Text>Caroline Aaron</Text>
          </ListItem>
          <ListItem last>
            <Text>Lee Allen</Text>
          </ListItem>
          <Separator bordered>
            <Text>RECEIVED</Text>
          </Separator>
          <ListItem>
            <Text>Caroline Aaron</Text>
          </ListItem>
          <ListItem last>
            <Text>Lee Allen</Text>
          </ListItem>
          <Separator bordered>
            <Text>ACCEPTED</Text>
          </Separator>
            <Text>Caroline Aaron</Text>
        </Content>
      </Container>
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
