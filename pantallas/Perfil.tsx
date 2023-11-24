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
  Dimensions
} from 'react-native';

function Perfil(): JSX.Element {

  return (
    <SafeAreaView style={{
      backgroundColor: 'red',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width
    }}>

      <Text style={{
        backgroundColor: 'blue',
        color: 'white',
        fontSize: 45
      }}>Hola Mundo!!</Text>
      
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

export default Perfil;
