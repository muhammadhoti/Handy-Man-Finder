import React from 'react';
import {  View } from 'react-native';
import {  createStackNavigator, createAppContainer } from "react-navigation";
import Login from '../screens/login'
import Info from '../screens/info'
import Home from '../screens/home'

class Navigator extends React.Component {
  render() {
    return (
        <View style={{flex: 1}}>
          <Navigation />
        </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login
  },
  Info : {
    screen : Info
  },
  Home:{
    screen : Home
  }
});

const Navigation =  createAppContainer(AppNavigator);

export default Navigator;