import React from 'react';
import {View,
        Button,
        Text,
        StyleSheet,
        Image,
        Platform
       } from 'react-native';
import {Button as MyButton,
        Container,
        Header,
        Content,
        Form,
        Item,
        Input,
        Picker,
        Icon
       } from 'native-base';
import {ImagePicker,  
        Permissions,
        Constants,
        Location 
       } from 'expo';
import MapView from 'react-native-maps';
import firebase from '../config/firebase.js';

export default class Info extends React.Component {
  constructor(props){
    super(props)
    this.state={
      image: null,
      selected2: undefined,
      mapComponent : false,
      location: null,
      errorMessage: null,
      coordinates : {
        latitude : 24.8822,
        longitude: 67.0674,
      },
      mapConfirmation : false,
    }
    this.uploadImageAsync = this.uploadImageAsync.bind(this)
    this.showMap = this.showMap.bind(this)
    this._getLocationAsync = this._getLocationAsync.bind(this)
    this.updateCenter = this.updateCenter.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.sendData = this.sendData.bind(this)
  }

  componentDidMount(){
    this.setState({
    userData : this.props.navigation.state.params,
      })
      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        });
      }else {
        this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    const { coordinates } = this.state
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    const locationSerivceCheck = await Location.hasServicesEnabledAsync();
    if (status !== 'granted') {
      return  'Permission to access location was denied'
    }else if(locationSerivceCheck){
      let location = await Location.getCurrentPositionAsync();
      coordinates.longitude = location.coords.longitude
      coordinates.latitude = location.coords.latitude
      return this.setState(coordinates)
    }
  };

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
    return await snapshot.ref.getDownloadURL();
  }

  showMap(){
    this.setState({mapComponent : true})
  }

  updateCenter(coordinate){
    const {coordinates} = this.state
    coordinates.latitude = coordinate.latitude
    coordinates.longitude = coordinate.longitude
    this.setState(coordinates)
  }
  
  setLocation(){
    const {userData, coordinates} = this.state;
    userData.coordinates = coordinates;
    this.setState(userData);
    this.setState({
      mapComponent : false
    })
    this.setState({
      mapConfirmation : true
    })
  }

  sendData(){
    const {userData,mapConfirmation} = this.state;
    const database = firebase.database();
    const number = userData.number;
    const profession = userData.profession;
    const displayPicture = userData.displayPicture;
    const newUserRef = database.ref(`userInfo`).push();
    const userListRef = database.ref(`usersList`).push();
    const uid = userData.uid
    if(mapConfirmation && number && profession && displayPicture){
      newUserRef.set(userData)
      userListRef.set({uid})
      .then(
        ()=>{
          this.props.navigation.navigate("Home",uid)
        }
      )
    }else {
      alert("Please Enter All Information Correctly")
    }
    
  }

  render() {
    // console.log(this.state)
    const {coordinates,userData} = this.state;

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
                    {userData &&
                    <Input 
                      placeholder = "Enter Your Phone Number"
                      onChange={
                      (e)=>{
                        const {userData} = this.state
                        userData.number = e.nativeEvent.text
                        this.setState(userData)
                        }
                      }
                      value = {userData.number}
                      />
                    }
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
                </Form>
                <Content>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {!mapComponent &&
                      <Button
                        title="Set Your Location"
                        onPress={this.showMap}
                      />
                    }
                  </View>
                </Content>
                <Content>
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
                </Content>
                <MyButton block warning
                  onPress={this.sendData}
                >
                  <Text>SUBMIT</Text>
                </MyButton>
                </Content>
          </Container>
        }
        {mapComponent &&
          <View style={{
            flex: 1
            }}>
            <MapView 
              style={{
              flex: 1
              }}
              initialRegion={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.0072,
                longitudeDelta: 0.0051
              }}>
              <MapView.Marker
                draggable
                coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                }}
                onDragEnd={(e) => this.updateCenter(e.nativeEvent.coordinate)}
              >
              </MapView.Marker>
            </MapView>
            <Button style={{
              flex: 1
              }}title='Set' onPress={this.setLocation} 
            />
          </View>
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