import React from 'react';
import { StyleSheet,
         View,
         TouchableOpacity } from 'react-native';
import {Container, 
        Header, 
        Content, 
        List, 
        ListItem, 
        Thumbnail, 
        Text, 
        Left, 
        Body, 
        Right, 
        Button } from 'native-base';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';
import { dbRef } from '../constants/constants'


export default class Handymans extends React.Component {
  constructor(props){
    super(props)
    this.state={
      disableReqButton : false,
    }
  }

  componentDidMount(){
      //Getting Uid From Props
      {
        this.setState({
        uid : this.props.navigation.state.params.uid
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
        const { uid } = this.state;
        for(let i in data2){
          if(data2[i].uid !== uid && data2[i].profession !== "Looking For Handy Man"){
            users.push(data2[i])
          }
        }
        this.setState({
          otherUsers : users
        })
      })
    }
    //Fetching User Conracts From Database
    {
      fetch(`${dbRef}/contracts.json`)
      .then(data => {
        return data.json();
      })
      .then(data2 => {
        let contracts = [];
        const { uid } = this.state;
        for(let i in data2){
          if(data2[i].sender === uid){
            contracts.push(data2[i])
          }
        }
        contracts.length > 0 &&
        this.setState({
          contracts : contracts
        })
      })
    }
}

viewProifle(value){
  const{ uid } = this.state
  this.props.navigation.navigate("otherProfile",{uid:value.uid,currentUserUid:uid})
}

sendRequest(value){
  const{ uid } = this.state;
  const database = firebase.database();
  const newUserRef = database.ref(`contracts`).push();
  newUserRef.set({
    sender : uid,
    receiver : value.uid,
    status : "pending"
  })
  this.setState({
    disableReqButton : true,
    disableReqButtonUid : value.uid
  })
}

render() {
    const { contracts, otherUsers, disableReqButton, disableReqButtonUid } = this.state;
    let  alreadyRendered = false
    return (
      <Container>
        <Header />
        <Content>
          <List>
            {
              otherUsers && otherUsers.map((value,index)=>{
                alreadyRendered = false;
                return (
                  <ListItem thumbnail>
                    <Left>
                      <Thumbnail square source={{ uri: value.displayPicture }} />
                    </Left>
                    <Body>
                      <Text>{value.displayName}</Text>
                      <Text note numberOfLines={1}>{value.profession}</Text>
                      <Text>                   </Text>
                    </Body>
                    <Right>
                      <TouchableOpacity>
                        <Button transparent>
                          <Text onPress={()=>{this.viewProifle(value)}}>View</Text>
                        </Button>
                      </TouchableOpacity>
                        {!contracts &&
                        <Button primary>
                          <Text onPress={()=>{this.sendRequest(value)}}>Request</Text>
                        </Button>
                        }
                        {contracts && 
                        contracts.map((value2,index2)=>{
                          const reqCheck = value2.receiver === value.uid && value2.status === "pending";
                          const allCheck = reqCheck || (disableReqButtonUid===value.uid && disableReqButton);
                        if(allCheck && !alreadyRendered){
                          alreadyRendered = true
                          return(
                            <TouchableOpacity>
                              <Button disabled>
                                <Text>Requested</Text>
                              </Button>
                           </TouchableOpacity>
                          )
                        }
                        if(!allCheck && index2 === contracts.length-1 && !alreadyRendered){
                          return(
                            <Button primary>
                              <Text onPress={()=>{this.sendRequest(value)}}>Request</Text>
                            </Button>
                          )
                        }
                        })
                        }
                      
                    </Right>
                  </ListItem>
                )
              })
            }
          </List>
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
