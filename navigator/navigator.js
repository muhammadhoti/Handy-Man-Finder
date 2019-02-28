import React from 'react';
import {  View } from 'react-native';
import {  createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import Login from '../screens/login'
import Info from '../screens/info'
import Profile from '../screens/profile'
import Handymans from '../screens/handymans'
import Messages from '../screens/messages'
import Contracts from '../screens/contracts'

class Navigator extends React.Component {
  render() {
    return (
        <View style={{flex: 1}}>
          <Navigation />
        </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator ({
  Profile: Profile,
  Handymans : Handymans,
  Messages : Messages,
  Contracts : Contracts,
});

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login
  },
  Info : {
    screen : Info
  },
  Home:{
    screen : TabNavigator
  },
  otherProfile :{
    screen : Profile
  }
});

const Navigation =  createAppContainer(AppNavigator);

export default Navigator;