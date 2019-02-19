import React from 'react';
import { View , Button, Text, StyleSheet, Image, Platform} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Picker, Icon, TouchableOpacity  } from 'native-base';
import { ImagePicker, MapView } from 'expo';
import firebase from '../config/firebase.js';

export default class Info extends React.Component {
  constructor(props){
    super(props)
    this.state={
      image: null,
      selected2: undefined,
      mapComponent : false,
    }
    this.uploadImageAsync = this.uploadImageAsync.bind(this)
    this.showMap = this.showMap.bind(this)
  }

  componentDidMount(){
      this.setState({
          userData : this.props.navigation.state.params,
      })
  }

  onValueChange2(value) {
    const {userData} = this.state
    userData.profession = value
    this.setState(userData);
    this.setState({selected2 : value})
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      const uri = result.uri;
      const {userData} = await this.state;
      const displayPicture = await this.uploadImageAsync(uri);
      userData.displayPicture = await displayPicture
      await this.setState(displayPicture);
    }
  }

   async uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child(new Date().toString());
    const snapshot = await  ref.put(blob);
  
    blob.close();
    console.log(snapshot.ref.getDownloadURL())
    return await snapshot.ref.getDownloadURL();
  }

  showMap(){
    this.setState({mapComponent : true})
  }

  render() {
    console.log(this.state.userData)
    let { image, mapComponent } = this.state;
    return (
      <View style={{flex: 1}}>
          {!mapComponent &&
            <Container>
            <Header />
            <Content>
              <Text style={styles.titleText}>Enter Your Information</Text>
              <Form>
              <Item floatingLabel>
                  <Input 
                  placeholder = "Enter Your Phone Number"
                  onChange={
                    (e)=>{
                      const {userData} = this.state
                      userData.number = e.nativeEvent.text
                      this.setState(userData)
                  }
                  }
                  />
                </Item>
                <Item picker>
                <Text style={styles.titleText2}>Select Any One</Text>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined }}
                    placeholder="Select your Profession"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.selected2}
                    onValueChange={this.onValueChange2.bind(this)}
                  >
                    <Picker.Item label="Electrician" value="Electrician" />
                    <Picker.Item label="Plumber" value="Plumber" />
                    <Picker.Item label="Carpenter" value="Carpenter" />
                    <Picker.Item label="Colorist" value="Colorist" />
                    <Picker.Item label="Welder" value="Welder" />
                    <Picker.Item label="Looking For Handy Man" value="Looking For Handy Man" />
                  </Picker>
                </Item>
                <Item>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  {image &&
                      <Image  source={{ uri: image }} style={{ width: 50, height: 50 }} />
                  }
                  {!image &&
                    <Button
                      title="Upload Your Picture"
                      onPress={this._pickImage}
                    />
                  }
                </View>
                </Item>
                <Item>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  {!mapComponent &&
                    <Button
                      title="Set Your Location"
                      onPress={this.showMap}
                    />
                  }
                </View>
                </Item>
              </Form>
            </Content>
          </Container>
          }
          {mapComponent &&
                    <MapView
                    style={{
                      flex: 1
                    }}
                    initialRegion={{
                      latitude: 24.8607,
                      longitude: 67.0011,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421
                    }}
                  />
                  }        
        </View>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleText2: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});