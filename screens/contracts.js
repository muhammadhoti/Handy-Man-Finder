import React from 'react';
import {StyleSheet,
       View} from 'react-native';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';
import { dbRef } from '../constants/constants'
import {Button,
        Body,
        Container, 
        Content, 
        Header, 
        Icon,
        Left,
        List, 
        ListItem, 
        Right,
        Separator,
        Text, 
        Thumbnail } from 'native-base';
import _ from 'lodash'


export default class Contracts extends React.Component {
  constructor(props){
    super(props)
    this.state={
    
    }
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
          data2[i].key = i;
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
          received : received,
          requested : requested,
          accepted : accepted
        })
      })
    }
    {
      //Fetching User From Database
      fetch(`${dbRef}/userInfo.json`)
      .then(data => {
        return data.json();
      })
      .then(data2 => {
        let user = {};
        let users = [];
        const { uid } = this.state;
        for(let i in data2){
          if(data2[i].uid !== uid){
            users.push(data2[i])
          }else{
            user = data2[i]
          }
        }
        this.setState({
          otherUsers : users,
          currentUser : user
        })
      })
    }
}

viewProifle(value){
  const{ uid } = this.state
  this.props.navigation.navigate("otherProfile",{uid:value.uid,currentUserUid:uid})
}

showMap(value){
  const { currentUser } = this.state
  this.props.navigation.navigate("Maps",{origin:currentUser.coordinates,destination:value})
}

reject(index,key){
  const {received} = this.state
  const database = firebase.database();
  database.ref(`contracts/${key}`).set({})
  .then(
    ()=>{
      received.splice(index,1)
      this.setState(received)
    }
  )
}

accept(index,value){
  const { received, accepted } = this.state
  const database = firebase.database();
  database.ref(`contracts/${value.key}`).update({ status: "accepted" })
  .then(
    ()=>{
      received.splice(index,1)
      accepted.push(value)
      this.setState( received )
      this.setState( accepted )
    }
  )
}

render() {
    const { accepted, received, requested, otherUsers, uid} = this.state
    return (
      <Container>
        <Header />
        <Content>
          <Separator bordered>
            <Text>ACCEPTED</Text>
          </Separator>
          <List>
          {
            accepted && accepted.map((value,index)=>{
              value.sender === uid ?
              renderingUser = value.receiver
              :
              renderingUser = value.sender
              const renderingUserDetails = _.find(otherUsers, {
                uid: renderingUser
              });
              return(
                <ListItem avatar>
                  <Left>
                    {renderingUserDetails && <Thumbnail source={{ uri: renderingUserDetails.displayPicture }}/>}
                  </Left>
                  <Body>
                    {renderingUserDetails && 
                    <Button transparent info>
                      <Text onPress={()=>{this.viewProifle(renderingUserDetails)}}>
                        {renderingUserDetails.displayName}
                      </Text>
                    </Button>}
                  </Body>
                  <Right>
                    <Button>
                      <Icon name='md-navigate' onPress={()=>{this.showMap(renderingUserDetails.coordinates)}}/>
                    </Button>
                  </Right>
                </ListItem>
              )
            })
          }
          </List>
          <Separator bordered>
            <Text>RECEIVED</Text>
          </Separator>
          {received && received.map((value,index)=>{
            renderingUser = value.sender
            const renderingUserDetails = _.find(otherUsers, {
              uid: renderingUser
            });
            return(
              <ListItem avatar last>
              <Left>
                {renderingUserDetails && <Thumbnail source={{ uri: renderingUserDetails.displayPicture }}/>}
              </Left>
              <Body>
                {renderingUserDetails && 
                <Button transparent info>
                  <Text onPress={()=>{this.viewProifle(renderingUserDetails)}}>
                    {renderingUserDetails.displayName}
                  </Text>
                </Button>}
              </Body>
              <Right>
              <Button rounded  success onPress={()=>{this.accept(index,value)}}><Text> Accept </Text></Button>
              <Button rounded  danger onPress={()=>{this.reject(index,value.key)}}><Text> Reject </Text></Button>
              </Right>
            </ListItem>  
            )
          })

          }
          <Separator bordered>
            <Text>REQUESTED</Text>
          </Separator>
            {requested && requested.map((value,index)=>{
              renderingUser = value.receiver
              const renderingUserDetails = _.find(otherUsers, {
                uid: renderingUser
              });
              return(
                <ListItem avatar last>
                  <Left>
                    {renderingUserDetails && <Thumbnail source={{ uri: renderingUserDetails.displayPicture }}/>}
                  </Left>
                  <Body>
                    {renderingUserDetails && 
                    <Button transparent info>
                      <Text onPress={()=>{this.viewProifle(renderingUserDetails)}}>
                        {renderingUserDetails.displayName}
                      </Text>
                    </Button>}
                  </Body>
                  <Right>
                    <Button  >
                      <Icon name='md-timer' />
                    </Button>
                  </Right>
                </ListItem>
              )
            })

            }
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
