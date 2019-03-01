import React from 'react';
import {  View } from 'react-native';
import {  createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import Login from '../screens/login'
import Info from '../screens/info'
import Profile from '../screens/profile'
import Handymans from '../screens/handymans'
import Messages from '../screens/messages'
import Contracts from '../screens/contracts'
import Maps from '../component/maps'

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
  Profile: {
    screen: Profile,
  },
  Handymans: {
    screen: Handymans,
  },
  Messages: {
    screen: Messages,
  },
  Contracts: {
    screen: Contracts,
  },
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
  },
  Maps:{
    screen : Maps
  },
});

const Navigation =  createAppContainer(AppNavigator);

export default Navigator;