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
}

render() {
    const { contracts } = this.state;
    const { otherUsers } = this.state;
    const { uid } = this.state;
    return (
      <Container>
        <Header />
        <Content>
          <List>
            {
              otherUsers && otherUsers.map((value,index)=>{
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
                      <TouchableOpacity>
                        {contracts && contracts.map((value2)=>{
                        const reqCheck = value2.receiver === value.uid && value2.status === "pending";
                        return(
                        reqCheck ?
                        <Button disabled>
                          <Text>Requested</Text>
                        </Button>
                        :
                        <Button transparent>
                          <Text onPress={()=>{this.sendRequest(value)}}>Request</Text>
                        </Button>
                        
                        )
                        })
                        }  
                      </TouchableOpacity>
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
