import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from '../config/firebase.js';
import {AsyncStorage} from 'react-native';
// import { Button } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class Login extends React.Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

    async login() {
      const appId = '2219108611676444';
      const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs
      
      const {
        type,
        token,
      } = await Expo.Facebook.logInWithReadPermissionsAsync(
        appId,
        {permissions}
      );
    
      switch (type) {
        case 'success': {
          await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
          const credential = firebase.auth.FacebookAuthProvider.credential(token);
          const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential
          const userData = await facebookProfileData.user.providerData[0];
          await AsyncStorage.setItem('uid', userData.uid);
          await this.setState({
            userData : userData
          })
          
          await this.props.navigation.navigate("Info",userData)
          
          return Promise.resolve({type: 'success'});
        }
        case 'cancel': {
          
          return Promise.reject({type: 'cancel'});
        }
      }
    }

  render() {
    
    return (
      <View style={styles.container}>
        <Button
        onPress={
          ()=>{
            this.login()
          }
        }
        title ="Login With Facebook"
      />
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
