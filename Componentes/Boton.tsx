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
  Dimensions
} from 'react-native';

function Boton({ navigation, text, onPress }): JSX.Element {

  return (

      <TouchableOpacity
        onPress={onPress}
        style={{ 
          borderWidth: 2, 
          borderColor: 'white', 
          padding: 15,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          width: 200,
          borderRadius: 35,
          margin: 15
          }}>
          <Text style={{
            color: 'white',
            fontSize: 25
          }}>{text}</Text>
      </TouchableOpacity>
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

export default Boton;
