import React from 'react';
import {StyleSheet,
        View,
        Image
           } from 'react-native';
import {Container,
        Header,
        Content,
        Card,
        CardItem,
        Thumbnail,
        Text,
        Button,
        Icon,
        Left, 
        Body, 
        Right} from 'native-base';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';
import { dbRef } from '../constants/constants'

export default class Profile extends React.Component {
  constructor(props){
    super(props)
    this.state={
      loading: true,
    }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ loading: false });
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
      
      let user = {};
      const { uid } = this.state;
      for(let i in data2){
        if(data2[i].uid === uid){
          user = data2[i]
        }
       
      }
      this.setState({
        currentUser : user
      })
    })
  }  
}

render() {
  const {currentUser} = this.state;
  if (this.state.loading) {
    return <Expo.AppLoading />;
  }else{
    return (
    <Container>
      <Header />
      <Content>
        <Card style={{flex: 0}}>
          <CardItem>
            <Left>
            {currentUser && <Thumbnail source={{uri: currentUser.photoURL}} />}
              <Body>
                {currentUser && <Text>{currentUser.displayName}</Text>}
                {currentUser && <Text>{currentUser.number}</Text>}
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Right>
              <View style={styles.container}>
                <Body>
                  {currentUser && <Image source={{uri: currentUser.displayPicture}} style={{height: 220, width: 205, flex: 1}}/>}
                </Body>
              </View>
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent textStyle={{color: '#87838B'}}>
                <Icon name="md-construct" />
                {currentUser && <Text>{currentUser.profession}</Text>}
              </Button>
            </Left>
          </CardItem>
        </Card>
      </Content>
    </Container>
    );
  }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
