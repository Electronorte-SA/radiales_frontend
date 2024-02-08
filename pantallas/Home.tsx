/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  PermissionsAndroid,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {useEffect, useState} from 'react';
import {Grayscale} from 'react-native-image-filter-kit';

import Boton from '../Componentes/Boton';

import {initializeDatabase, handleSync, botonsubestaciones, handleSyncSub, fetchToken} from './services/database.service';
function Home({navigation}): JSX.Element {
  const [loadedImage, setLoadedImage] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState("")
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  let inicializaCompletado = false;
  let sincronizaCompletado = true;
  useEffect(() => {
    // Variable auxiliar para rastrear si las funciones han completado
    const inicio = async ()=>{
      await initializeDatabase(); 
      inicializaCompletado = true;

    }
    const sincroniza = async () => {
      try {
        const response = await fetch('https://radialesqr.azurewebsites.net');
        console.log('response', response);
        sincronizaCompletado = false
        if (response.ok) {
          let generatedToken = await fetchToken();
          setToken(generatedToken)
          setLoading(true);
          // Inicia la carga de las funciones
         
          await handleSync(generatedToken);
          sincronizaCompletado = true;
          setLoading(false); // Oculta  la animación después de que las funciones hayan terminado
        } else {
          sincronizaCompletado = true
          Alert.alert(
            'Servidor Caído',
            'No se puede acceder al servidor en este momento.',
          );
          setLoading(false);
        }
      } catch (error) {
        sincronizaCompletado = true
        Alert.alert(
          'Servidor Caído',
          'No se puede acceder al servidor en este momento.',
        );
        setLoading(false);
      }
    };
    inicio()

    
    const timeoutId = setInterval(() => {
      // Comprueba si las funciones han completado antes  de ejecutar handleSync
      if (inicializaCompletado && sincronizaCompletado) {
        sincroniza();
      }
    }, 10000);

    return () => {
      clearInterval(timeoutId);
      setLoading(false);
    };
  }, []);

  return (
    <View>
      <Image
        style={{
          height: 250,
          width: '100%',
          position: 'absolute',
        }}
        source={require('../assets/fondo6.jpeg')}></Image>
      <Text
        style={{
          height: 200,
          width: '100%',
          textAlign: 'right',
          color: 'white',
          fontSize: 30,
          top: 200,
          textShadowColor: 'black',
          textShadowOffset: {width: 0, height: 0},
          textShadowRadius: 40,
          position: 'absolute',
        }}>
        Raptor QR
      </Text>
      <ScrollView
        style={{
          backgroundColor: 'transparent',
          height: Dimensions.get('window').height,
          width: '100%',
          alignContent: 'center',
        }}
        nestedScrollEnabled={false} // Agrega esta línea para desactivar el desplazamiento
      >
        <View
          style={{
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 50,
              backgroundColor: 'transparent',
            }}></View>

          <Image
            style={{
              height: 200,
              width: '130%',
              top: 700,
            }}
            source={require('../assets/tope.png')}></Image>

          {/* /////////////////////////////////////////////////////////////////////// */}
          <View
            style={{
              backgroundColor: 'black',
              width: '110%',
              alignItems: 'center',
            }}>
            <Image
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                backgroundColor: 'rgba(255, 255, 255, 255)', // Opacidad del 50%
                // border: 2px solid #000; /* ancho, tipo y color del borde */
                // borderRadius: 50, /* radio de la esquina para redondear */

                top: -10,
              }}
              source={require('../assets/fondoradias.jpeg')}></Image>

            <View
              style={{
                height: 600,
                backgroundColor: 'transparent',
              }}>
              {/* <ActivityIndicator size={100} color="#00ff00" /> */}
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size={100} color="#00ff00" />
                </View>
              ) : (
                <View>
                  <Boton
                    text="SCAN QR"
                    onPress={() => {
                      navigation.push('Camara');
                    }}></Boton>
                  <Boton
                    text="BUSCAR ID"
                    onPress={() => navigation.push('QRGen')}
                    ></Boton>
                     <Boton
                    text="BUSCAR BUSE"
                    onPress={() => navigation.push('BuscaSube')}
                    ></Boton>

                      <Boton
                    text="eleminar"
                    onPress={() =>  botonsubestaciones(token)}>

                    </Boton>
                </View>
              )}

              <View
                style={{
                  height: 600,

                  width: '100%',
                  backgroundColor: 'transparent',
                }}></View>
            </View>
          </View>

          {/* /////////////////////////////////////////////////////////////////////// */}
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
  loadedImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginVertical: 10,
    // Otros estilos específicos para la imagen cargada...
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Otros estilos específicos para el contenedor de carga...
  },
});

export default Home;
