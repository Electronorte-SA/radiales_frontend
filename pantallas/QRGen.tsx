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
  TextInput,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';

import Boton from '../Componentes/Boton';

import QRCode from 'react-native-qrcode-svg';

import { useEffect, useState } from 'react';

function QRGen(): JSX.Element {

    const [texto, setTexto] = useState("");
    const [mostrarImagen, setMostrarImagen] = useState(false);

    const mostrandoImagen = () =>{
        if (mostrarImagen && texto) {
            return (
            <QRCode
                value={texto}
            />
            )
        } else {
            return null;
        }
    }

  return (
    <SafeAreaView style={{
      backgroundColor: 'black',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width
    }}>
      <Text style={{
        backgroundColor: 'blue',
        color: 'white',
        fontSize: 25
      }}>Coloque el texto a Codificar:</Text>
      <TextInput 
        onChangeText={setTexto}
        style={{
        backgroundColor: 'blue',
        color: 'white',
        fontSize: 45
      }}></TextInput>

        <Boton text="CREAR QR" onPress={() => setMostrarImagen(true)}></Boton>

        {mostrandoImagen()}
      
    </SafeAreaView>
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

export default QRGen;
