/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  PermissionsAndroid,
  Image
} from 'react-native';

import {launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import { useEffect, useState } from 'react';

import Boton from '../Componentes/Boton';

function Home({ navigation }): JSX.Element {

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message:"App needs access to your camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  })

  return (
    <View>
      <Image style={{
          height: 200,
          width: '100%',
          position: 'absolute'
        }} source={require('../assets/foto-fondo.jpg')}></Image>
        <Text style={{
          height: 200,
          width: '100%',
          textAlign: 'center',
          color: 'white',
          fontSize: 45,
          top: 50,
          textShadowColor:'black',
          textShadowOffset:{width: 0, height: 0},
          textShadowRadius:10,
          position: 'absolute'
        }}>La Mejor Apps</Text>
      <ScrollView style={{
        backgroundColor: 'transparent',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        alignContent: 'center',
      }}>
        
        <View style={{
          alignItems: 'center'
        }}>
          
          <View style={{
            height: 50,
            backgroundColor: 'transparent'
          }}>

          </View>

          <Image style={{
            height: 200,
            width: '100%',
          }} source={require('../assets/tope.png')}></Image>

          <View style={{
            backgroundColor: 'black',
            width: '100%',
            alignItems: 'center',
          }}>

          <Image style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: -50
          }} source={require('../assets/fondo-home.jpg')}></Image>

            <View style={{flexDirection: 'row'}}>
            <View style={{margin: 15,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',}}>
              <Image style={{
                height: 50,
                width: 50,
                tintColor: 'white',
                margin: 10
              }} source={require('../assets/video.png')}></Image>
              <Text style={{color:'white'}}>Videos</Text></View>

            <View style={{margin: 15,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',}}>
              <Image style={{
                height: 50,
                width: 50,
                tintColor: 'white',
                margin: 10
              }} source={require('../assets/mountain.png')}></Image>
              <Text style={{color:'white'}}>Montaña</Text></View>

            <View style={{margin: 15,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',}}>
              <Image style={{
                height: 50,
                width: 50,
                tintColor: 'white',
                margin: 10
              }} source={require('../assets/dish.png')}></Image>
              <Text style={{color:'white'}}>Comida</Text></View>
            </View>

          <Boton text="IR AL PERFIL" onPress={() => navigation.push("Perfil")}></Boton>
          <Boton text="TOMAR FOTO" onPress={() => {
            let options = {
              mediaType: 'photo'
            }
            launchCamera(options).then((result) => {
              console.log(result)
              const imageRef = storage()
                .ref("/")
                .child("fotos");

              imageRef
                .putFile(result.assets[0].uri)
                .then(() => {
                  return imageRef.getDownloadURL();
                })
                .then(url => {
                console.log(url);
                });
            })}}></Boton>
            <View style={{
            height: 600,
            backgroundColor: 'transparent'
          }}>
          <Boton text="CREAR QR" onPress={() => navigation.push("QRGen")}></Boton>
          <Boton text="LEER QR" onPress={() => {
            navigation.push("Camara")
            }}></Boton>
            <View style={{
            height: 600,
            backgroundColor: 'transparent'
          }}></View>
            
          </View>
            
          </View>
          
        </View>
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
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

export default Home;
