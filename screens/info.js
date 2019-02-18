import React from 'react';
import { View , Button, Text, StyleSheet, Image, Platform} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Picker, Icon  } from 'native-base';
import { ImagePicker } from 'expo';
import firebase from '../config/firebase.js';
// import RNFetchBlob from 'react-native-fetch-blob'

// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob

export default class Info extends React.Component {
  constructor(props){
    super(props)
    this.state={
      image: null,
      selected2: undefined,
    }
    this.uploadImageAsync = this.uploadImageAsync.bind(this)
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
  
    // We're done with the blob, close and release it
    blob.close();
    console.log(snapshot.ref.getDownloadURL())
    return await snapshot.ref.getDownloadURL();
  }


  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      const uri = result.uri;
      const displayPicture = await this.uploadImageAsync(uri);
      const {userData} = await this.state;
      userData.displayPicture = await displayPicture
      await this.setState(displayPicture);
    }
  }


  render() {
    console.log(this.state.userData)
    let { image } = this.state;
    return (
      <View style={{flex: 1}}>
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
          <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />}
        <Button
          title="Upload Your Picture"
          onPress={this._pickImage}
        />
      </View>
            </Item>
          </Form>
        </Content>
      </Container>
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
});