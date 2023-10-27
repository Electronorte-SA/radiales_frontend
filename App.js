import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';


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
  
  const [token, setToken] = useState(null);
  const db = SQLite.openDatabase('dbradiales.db');

  const apiUrl = 'http://10.112.47.55:5000/qr/token';
  const apiKey = "mama"// Código a enviar en el cuerpo de la solicitud

  //CAMARAAAAAAAAAAA
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
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
      
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS parametrosqr (' +
          'ultima_actualizacion DATETIME' +
        ')'
      );

      contar();    

  
    });

  }, []);

  const contar = ()=>{
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) AS count FROM radialesQR',
        [],
        (_, result) => {
          const rowCount = result.rows.item(0).count;
          console.log('Cantidad de uuuuuuuuu datos insertados en la tabla radialesQR:', rowCount);
        },
        (_, error) => {
          console.error('Error al realizar la consulta:', error);
        }
      );
    });

  }

// const handleSync = () => {
//   const timestamp = new Date().toLocaleString();
//   console.log('Marca de tiempo al hacer clic en el botón:', timestamp);

//   axios.post(apiUrl, { "idapp": apiKey })
//     .then((response) => {
//       const generatedToken = response.data.token;
//       console.log('los token', generatedToken)

//       const otherApiUrl = 'http://10.112.47.55:5000/qr/radialesqr';
//       axios.get(otherApiUrl, {
//         headers: {
//           Authorization: `Bearer ${generatedToken}`,
//         },
//       })
      
//         .then((otherApiResponse) => {
//           const dataToInsert = otherApiResponse.data.datos;
//           const batchSize = 10;
//           const batches = [];
//           for (let i = 0; i < dataToInsert.length; i += batchSize) {
//             batches.push(dataToInsert.slice(i, i + batchSize));
//           }
            
//           let dataCount = 0;

//           const insertPromises = batches.map((batch) => {
//             return new Promise((resolve, reject) => {
//               db.transaction((tx) => {
//                 batch.forEach((item) => {
//                   tx.executeSql(
//                     'INSERT INTO radialesQR (Id, Estado, Tipo_de_red, T_Nominal, Nombre, Alias, Tipo_de_propietario, Nombre_del_propietario, Estilo_de_subcodigo, Montaje, Swit_Installation_Date, Descripcion_Optimus, UTMEste, UTMNorte, ID_de_circuito_ConcatSet, Alias_ConcatSet, Latitud, Longitud, Unionn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//                     [
//                       parseInt(item.id, 10),
//                       item.estado,
//                       item.tipo_de_red,
//                       item.t_Nominal,
//                       item.nombre,
//                       item.alias,
//                       item.tipo_de_propietario,
//                       item.nombre_del_propietario,
//                       item.estilo_de_subcodigo,
//                       item.montaje,
//                       item.swit_Installation_Date,
//                       item.descripcion_Optimus,
//                       item.utmEste,
//                       item.utmNorte,
//                       item.iD_de_circuito_ConcatSet,
//                       item.alias_ConcatSet,
//                       item.latitud,
//                       item.longitud,
//                       item.unionn,
//                     ],
//                     (_, result) => {
//                     }
//                   );
//                 });
//               },
//               (txError) => {
//                 reject(txError);
//               },
//               () => {
//                 resolve();
//               });
//             });
//           });
//           Promise.all(insertPromises)
//             .then(() => {
//               console.log('Inserción de datos completa');
//             })
//             .catch((error) => {
//               console.error('Error al insertar datos:', error);
//             });
//           contar();
//         })
//         .catch((error) => {
//           console.error('Error al obtener datos de la otra API:', error);
//         });
//     })
//     .catch((error) => {
//       console.error('Error al obtener el token:', error);
//     });
// }

////////////////////////////////////////////////////

const handleSync = () => {
  const timestamp = new Date().toLocaleString();
  console.log('Marca de tiempo al hacer clic en el botón:', timestamp);

  axios.post(apiUrl, { "idapp": apiKey })
    .then((response) => {
      const generatedToken = response.data.token;
      console.log('los token', generatedToken)

      const otherApiUrl = 'http://10.112.47.55:5000/qr/radialesqr';
      axios.get(otherApiUrl, {
        headers: {
          Authorization: `Bearer ${generatedToken}`,
        },
      })
      
        .then((otherApiResponse) => {
          const dataToInsert = otherApiResponse.data.datos;
          const batchSize = 10;
          const batches = [];
          for (let i = 0; i < dataToInsert.length; i += batchSize) {
            batches.push(dataToInsert.slice(i, i + batchSize));
          }
            
          let dataCount = 0;

          const insertPromises = batches.map((batch) => {
            return new Promise((resolve, reject) => {
              db.transaction((tx) => {
                batch.forEach((item) => {
                  tx.executeSql(
                    'INSERT INTO radialesQR (Id, Estado, Tipo_de_red, T_Nominal, Nombre, Alias, Tipo_de_propietario, Nombre_del_propietario, Estilo_de_subcodigo, Montaje, Swit_Installation_Date, Descripcion_Optimus, UTMEste, UTMNorte, ID_de_circuito_ConcatSet, Alias_ConcatSet, Latitud, Longitud, Unionn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                      parseInt(item.id, 10),
                      item.estado,
                      item.tipo_de_red,
                      item.t_Nominal,
                      item.nombre,
                      item.alias,
                      item.tipo_de_propietario,
                      item.nombre_del_propietario,
                      item.estilo_de_subcodigo,
                      item.montaje,
                      item.swit_Installation_Date,
                      item.descripcion_Optimus,
                      item.utmEste,
                      item.utmNorte,
                      item.iD_de_circuito_ConcatSet,
                      item.alias_ConcatSet,
                      item.latitud,
                      item.longitud,
                      item.unionn,
                    ],
                    (_, result) => {
                    }
                  );
                });
              },
              (txError) => {
                reject(txError);
              },
              () => {
                resolve();
              });
            });
          });
          Promise.all(insertPromises)
            .then(() => {
              console.log('Inserción de datos completa');
            })
            .catch((error) => {
              console.error('Error al insertar datos:', error);
            });
          contar();
        })
        .catch((error) => {
          console.error('Error al obtener datos de la otra API:', error);
        });
    })
    .catch((error) => {
      console.error('Error al obtener el token:', error);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////


const handleDelete = ()=>{
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM radialesQR',
          [],
          (_, result) => {
            console.log('Datos eliminados con éxito de la tabla radialesQR.');
          },
          (_, error) => {
            console.error('Error al eliminar los datos de la tabla radialesQR:', error);
          }
        );
      });

      contar();
  
}

const handleBarCodeScanned = ({ type, data }) => {
  
  setScanned(true);
  setScannedData(data);
  console.log('los dtos en scanner',data)
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM radialesQR",
      [],
      (_, { rows }) => {
        console.log('ingreso aqui', rows.length)
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
        <Button title="Sincronizar" onPress={handleSync} />
        <Button title="Limpiar" onPress={handleDelete} />
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
      {/* {formData.Alias ? (
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
      )} */}
      {formData.Alias ? (
  <>
    <Text style={{ textAlign: 'left' }}>ID: {scannedData.data}</Text>
    <Text style={{ textAlign: 'left' }}>Estado: {formData.Estado}</Text>
    <Text style={{ textAlign: 'left' }}>Tipo de red: {formData.Tipo_de_red}</Text>
    <Text style={{ textAlign: 'left' }}>T_Nominal: {formData.T_Nominal}</Text>
    <Text style={{ textAlign: 'left' }}>Alias: {formData.Alias}</Text>
    <Text style={{ textAlign: 'left' }}>Nombre del propietario: {formData.Nombre_del_propietario}</Text>
    <Text style={{ textAlign: 'left' }}>Estilo de subcódigo: {formData.Estilo_de_subcodigo}</Text>
    {formData.Latitud && (
      <Text style={{ textAlign: 'left' }}>Latitud: {formData.Latitud.toString()}</Text>
    )}
    {formData.Longitud && (
      <Text style={{ textAlign: 'left' }}>Longitud: {formData.Longitud.toString()}</Text>
    )}
  </>
) : (
  <Text style={{ textAlign: 'left' }}>ID no encontrado</Text>
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
