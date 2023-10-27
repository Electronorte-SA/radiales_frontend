import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SQLite from 'expo-sqlite';

const Stack = createStackNavigator();

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [formData, setFormData] = useState({
    Estado: "",
    Tipo_de_red: "",
    T_Nominal: "",
    Alias: "",
    Nombre_del_propietario: "",
    Estilo_de_subcodigo: "",
    Latitud: "",
    Longitud: "",
  })
  const db = SQLite.openDatabase('dbradiales.db');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS radialesQR (' +
        'Id INTEGER, ' +
        'Estado TEXT, ' +
        'Tipo_de_red TEXT, ' +
        'T_Nominal TEXT, ' +
        'Nombre TEXT, ' +
        'Alias TEXT, ' +
        'Tipo_de_propietario TEXT, ' +
        'Nombre_del_propietario TEXT, ' +
        'Estilo_de_subcodigo TEXT, ' +
        'Montaje TEXT, ' +
        'Swit_Installation_Date TEXT, ' +
        'Descripcion_Optimus TEXT, ' +
        'UTMEste TEXT, ' +
        'UTMNorte TEXT, ' +
        'ID_de_circuito_ConcatSet TEXT, ' +
        'Alias_ConcatSet TEXT, ' +
        'Latitud REAL, ' +
        'Longitud REAL, ' +
        'Unionn TEXT)'
    );
  });
  db.transaction((tx) => {
    // Insertar datos en la tabla
    tx.executeSql(
      'INSERT INTO radialesQR (Id, Estado, Tipo_de_red, T_Nominal, Nombre, Alias, Tipo_de_propietario, Nombre_del_propietario, Estilo_de_subcodigo, Montaje, Swit_Installation_Date, Descripcion_Optimus, UTMEste, UTMNorte, ID_de_circuito_ConcatSet, Alias_ConcatSet, Latitud, Longitud, Unionn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        4208763,
        'Existente',
        'MT',
        '22.9 KV',
        'I200977',
        'A2023-I200',
        'Municipalidad',
        'MUNICIPALIDAD DISTRITAL DE PIMENTEL',
        'Cut Out',
        'Aéreo',
        '24/10/2016 00:00',
        'FUNDO LAS PAMPAS SAN GREGORIO',
        '617690.853',
        '9245456.321',
        'A2023',
        'C-224',
        -6.825093894,
        -79.93490386,
        '-6.8250938939381,-79.9349038631954',
      ],
      (_, result) => {
        console.log('Registro insertado con ID: ', result.insertId);
      }
    );

    tx.executeSql(
      'INSERT INTO radialesQR (Id, Estado, Tipo_de_red, T_Nominal, Nombre, Alias, Tipo_de_propietario, Nombre_del_propietario, Estilo_de_subcodigo, Montaje, Swit_Installation_Date, Descripcion_Optimus, UTMEste, UTMNorte, ID_de_circuito_ConcatSet, Alias_ConcatSet, Latitud, Longitud, Unionn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        '4208767',
        'Existente',
        'MT',
        '10 KV', 
        'I200978',
        'A2053-I200',
        'Distribuidora',
        'Electronorte',
        'Cut Out',
        'Aéreo',
        '7/11/2016 00:00',
        'LA HUACA EL IMPERIA',
        '639278.565',
        '9338417.654',
        'A2053',
        'OLM101',
        -5.983882322,
        -79.74162679,
        '-5.98388232200952,-79.7416267861407',
      ],
      (_, result) => {
        console.log('Registro insertado con ID: ', result.insertId);
      }
    );
  });

const handleBarCodeScanned = ({ type, data }) => {
  setScanned(true);
  setScannedData({ type, data });
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM radialesQR WHERE Id = ?',
      [data],
      (_, { rows }) => {
        if (rows.length > 0) {
          // Si se encuentra el registro, muestra la información.
          const registro = rows.item(0);
          console.log('Registro encontrado:', registro); // Agrega este console.log

          // Llena el formulario con los datos escaneados
          setFormData({
            Estado: registro.Estado,
            Tipo_de_red: registro.Tipo_de_red,
            T_Nominal: registro.T_Nominal,
            Alias: registro.Alias,
            Nombre_del_propietario: registro.Nombre_del_propietario,
            Estilo_de_subcodigo: registro.Estilo_de_subcodigo,
            Latitud: registro.Latitud.toString(),
            Longitud: registro.Longitud.toString(),
          });
        } else {
          // Si no se encuentra el registro, muestra un mensaje.
          console.log('Registro no encontrado'); // Agrega este console.log
          setScannedData({ id: 'No encontrado' });
        }
      }
    );
  });
};
  
  

  const resetScanner = () => {
    setScanned(false);
    setScannedData(null);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ScanData" component={ScanDataScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  function HomeScreen({ navigation }) {
    useEffect(() => {
      if (scanned) {
        navigation.navigate('ScanData');
      }
    }, [scanned]);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Escanea un Código QR</Text>
        {hasPermission === null ? (
          <Text>Esperando permiso de cámara...</Text>
        ) : hasPermission === false ? (
          <Text>Acceso a la cámara denegado.</Text>
        ) : (
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined:handleBarCodeScanned }
              style={styles.scanner}
            />
            {scanned && (
              <View style={styles.scanData}>
                <Text>ID: {scannedData.id}</Text>
                {/* <Text>Datos: {scannedData.data}</Text> */}
              </View>
            )}
          </View>
        )}
      </View>
    );
  }

  function ScanDataScreen({ navigation }) {
    const handleScanAgain = () => {
      resetScanner();
      navigation.navigate('Home'); // Regresar a la pantalla de inicio para escanear de nuevo
    };

    return (
      <View style={styles.container}>
      <Text style={styles.title}>Datos Escaneados</Text>
      {/* scannedData.type && scannedData.type !== 'No encontrado' */}
      {formData.Alias ? (
        <>
          <Text>ID: {scannedData.data}</Text>
          <Text>Estado: {formData.Estado}</Text>
          <Text>Tipo de red: {formData.Tipo_de_red}</Text>
          <Text>T_Nominal: {formData.T_Nominal}</Text>
          <Text>Alias: {formData.Alias}</Text>
          <Text>Nombre del propietario: {formData.Nombre_del_propietario}</Text>
          <Text>Estilo de subcódigo: {formData.Estilo_de_subcodigo}</Text>
          {formData.Latitud && (
            <Text>Latitud: {formData.Latitud.toString()}</Text>
          )}
          {formData.Longitud && (
            <Text>Longitud: {formData.Longitud.toString()}</Text>
          )}
        </>
      ) : (
        <Text>ID no encontrado</Text>
      )}
      <Button title="Escanear de nuevo" onPress={handleScanAgain} />
    </View>
  //   <View style={styles.container}>
  //   <Text style={styles.title}>Datos Escaneados</Text>
  //   <Text>Tipo de Código: {scannedData.type}</Text>
  //   <Text>Datos: {scannedData.data}</Text>
  //   <Button title="Escanear de nuevo" onPress={handleScanAgain} />
  // </View>
    

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scannerContainer: {
    width: '100%',
    height: '50%',
    position: 'relative',
  },
  scanner: {
    width: '100%',
    height: '100%',
  },
  scanData: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
  },
});
