import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Logo = () => (
  <Image
    source={require('./assets/logo3.png')}
    style={{ width: '57%', height: 40 }}
  />
);

import Home from './pantallas/Home';
import Camara from './pantallas/Camara';
import BuscarId from './pantallas/BuscarId';

function App(): JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Dpto. Operaciones"
       component={Home}
          options={{
            // title: 'Home - 1',
            headerStyle: {
              backgroundColor: '#ffffff',  // Código para el color blanco
            },
            headerLeft: () => (
              <View style={{ flexDirection: 'row', marginLeft: '-4%' }}>
                <Logo />
              </View>
            ),
          }}
        />
        <Stack.Screen name="Camara" component={Camara} />
        <Stack.Screen name="QRGen" component={BuscarId} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
