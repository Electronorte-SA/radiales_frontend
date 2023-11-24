/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  Alert
} from 'react-native';

import { useEffect, useState } from 'react';
import { CameraScreen } from 'react-native-camera-kit';
//import * as RNFS from 'react-native-fs';

function Camara({ navigation }): JSX.Element {

  useEffect(() => {
    
  }, []);

  const onBottomButtonPressed = (event) => {
    const captureImages = JSON.stringify(event.captureImages);
    console.log(event);
    console.log(captureImages);
    if(event.type == "capture"){

      var image = event.captureImages[event.captureImages.length - 1];
      console.log(image);

    }else if(event.type == "left"){
      navigation.pop();
    }else if(event.type == "right"){
      navigation.pop();
    }
  }

  return (
    <View>
      <CameraScreen
        actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
        onBottomButtonPressed={(event) => onBottomButtonPressed(event)}
        flashImages={{
          // optional, images for flash state
          on: require('../assets/camera/flashOn.png'),
          off: require('../assets/camera/flashOff.png'),
          auto: require('../assets/camera/flashAuto.png'),
        }}
        cameraFlipImage={require('../assets/camera/cameraFlipIcon.png')} // optional, image for flipping camera button
        captureButtonImage={require('../assets/camera/cameraButton.png')} // optional, image capture button
        torchOnImage={require('../assets/camera/flashOn.png')} // optional, image for toggling on flash light
        torchOffImage={require('../assets/camera/flashOff.png')} // optional, image for toggling off flash light
        hideControls={false} // (default false) optional, hides camera controls
        showCapturedImageCount={false} // (default false) optional, show count for photos taken during that capture session
        style={{
          backgroundColor: 'black',
          width: Dimensions.get('window').width,
          flex: 1
        }}

        // Barcode props
        scanBarcode={true}
        onReadCode={(event) => { alert(event.nativeEvent.codeStringValue); navigation.pop() }} // optional
        showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
        laserColor='red' // (default red) optional, color of laser in scanner frame
        frameColor='white' // (default white) optional, color of border of scanner frame
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#275a8a',
    padding: 10,
    marginTop: 25,
    borderRadius: 10,
    width: 75,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 250
  },
  mainContainer: {
    alignContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#bad2e8'
  },
  splashLogo: {
    height: 75,
    width: 75,
    marginTop: 100
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Camara;
