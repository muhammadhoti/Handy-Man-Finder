import React from 'react';
import { View } from 'react-native';
import Navigator from './navigator/navigator.js';

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      
    }
  }

  render() {
    
    return (
      <View style={{flex: 1}}>
        <Navigator />
      </View>
    );
  }
}
