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
      db.transaction((tx) => {
        // tx.executeSql(
        //   'DROP TABLE parametrosqr'
        // );
        
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS parametrosqr (' +
            'NOMBRE TEXT,' +
            'VALOR TEXT' +
          ')'
        ); 

      tx.executeSql(
        'SELECT * FROM parametrosqr WHERE nombre=?',
        ['ULT_ACT'],
        (_, { rows }) => {
          console.log('las consultas de select de la fecha',rows)
          if (rows.length > 0) {
            tx.executeSql(
              'INSERT INTO parametrosqr (NOMBRE, VALOR) VALUES (?, ?)',
              ['ULT_ACT',''],
              (_, result) => {
                console.log('Registro insertado con éxito en la tabla parametrosqr');
              },
              (_, error) => {
                console.error('Error al insertar el registro en la tabla parametrosqr:', error);
              }
            );   
          }
          
        },
        (_, error) => {
          console.error('error', error)
        }
      );
      
      
    });
    


      tx.executeSql(
        'SELECT * FROM parametrosqr',
        [],
        (_, result) => {
          console.log('los datos de la consulta',result)
          const rows = result.rows;
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            console.log('Fila', i + 1, ':', item);
            console.log('NOMBRE:', item.NOMBRE, 'VALOR:', item.VALOR);
          }
        },
        (_, error) => {
          console.error('Error al obtener los datos de la tabla parametrosqr:', error);
        }
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

// ****************************************************************************************************


const selectFromParametrosqr = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM parametrosqr WHERE nombre=?',
        ['ULT_ACT'],
        (_, { rows }) => {
          console.log('las consultas de select de la fecha',rows)
          if (rows.length > 0) {
            const item = rows.item(0);
            resolve(item.VALOR);
          }else{
            resolve(null)
          }
          
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const fetchToken = () => {
  return new Promise((resolve, reject) => {
    axios.post(apiUrl, { "idapp": apiKey })
      .then((response) => {
        const generatedToken = response.data.token;
        console.log('los token',generatedToken)
        resolve(generatedToken);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const fetchDataFromOtherAPI = (generatedToken, fecha_busqueda) => {
  return new Promise((resolve, reject) => {
    const otherApiUrl = `http://10.112.47.55:5000/qr/radialesqr?fecha_busqueda=${fecha_busqueda}`;
    axios.get(otherApiUrl, {
      headers: {
        Authorization: `Bearer ${generatedToken}`,
      },
    })
    
    .then((otherApiResponse) => {
      const dataFromAPI = otherApiResponse.data;
      // console.log('LOS DATOS DE LA APIS:', dataFromAPI.radiales)
      resolve(otherApiResponse.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

const actualizarFechaEnParametrosQR = (fecha) => {
  return new Promise((resolve, reject) => {
    console.log('Fecha a actualizar:', fecha);
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE parametrosqr SET VALOR=? WHERE NOMBRE=?',
        [fecha, 'ULT_ACT'],
        (_, result) => {
          console.log('Resultado de la actualización:', result);
          console.log('Fecha actualizada con éxito en la tabla parametrosqr:', fecha);
          resolve('Éxito al actualizar la fecha');
        },
        (_, error) => {
          console.error('Error al actualizar la fecha en la tabla parametrosqr:', error);
          reject('Error al actualizar la fecha');
        }
      );
    });
  });
};
 
  //////////// PARA INSERARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR//////////////////////////////////////////////////////////////
  const insertRadiales= (data) => {
    // console.log('los datos de la funcion insert BatchIntoDB en inserta',data) //si lllega

    return new Promise((resolve, reject) => {
      const batchSize = 10;
      const batches = [];
      for (let i = 0; i < data.length; i += batchSize) {
        batches.push(data.slice(i, i + batchSize));
      }
      console.log('los datos en batche',batches) //si lllega

  
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
          }, (txError) => {
            reject(txError);
          }, () => {
            resolve(true);
          });
        });
      });
  
      Promise.all(insertPromises)
        .then(() => {
          resolve('Inserción de datos completa');
        })
        .catch((error) => {
          reject(`Error al insertar datos: ${error}`);
        });
    });
  };

////////////////// PARA ACTUALIZARRRRRRRRRRRRRRRRRRRRRRRR////////////////////////////////////////
  
const updateRadiales = (data) => {
  
  console.log('los datos de actualizar',data)
  return new Promise((resolve, reject) => {
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
          // console.log('los datos de actualizar',batches)
    const updatePromises = batches.map((batch) => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          batch.forEach((item) => {
            tx.executeSql(
              'UPDATE radialesQR SET Estado = ?, Tipo_de_red = ?, T_Nominal = ?, Nombre = ?, Alias = ?, Tipo_de_propietario = ?, Nombre_del_propietario = ?, Estilo_de_subcodigo = ?, Montaje = ?, Swit_Installation_Date = ?, Descripcion_Optimus = ?, UTMEste = ?, UTMNorte = ?, ID_de_circuito_ConcatSet = ?, Alias_ConcatSet = ?, Latitud = ?, Longitud = ?, Unionn = ? WHERE Id = ?',
              [
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
                parseInt(item.id, 10)
              ],
              (_, result) => {
                // Registro actualizado con ID
              },
              (txError) => {
                reject(txError);
              }
            );
          });
        }, (txError) => {
          reject(txError);
        }, () => {
          resolve();
        });
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        resolve('Actualización de datos completa');
      })
      .catch((error) => {
        reject(`Error al actualizar datos: ${error}`);
      });
  });
};


////////////////////////////////////////////////////
const handleSync = async () => {
    try{
      
      
      //  let exito_insertar = await insertBatchIntoDB(data);
      // let fecha_busqueda = await selectFromParametrosqr(); 
      // let fecha_busqueda = '2023-10-24 8:30:00';

      let fecha_busqueda = '';   
      // // const fecha_busqueda = null;     
      console.log('la fecha actualizada busqueda',fecha_busqueda)
      let generatedToken = await fetchToken();
      // console.log('vhbjnkl',generatedToken)
      let data = await fetchDataFromOtherAPI(generatedToken,fecha_busqueda);
      // // console.log('todos mm los datos data.radiales',data.radiales)
      if (data){
        console.log('paso 1')
        if (fecha_busqueda === '') {
          console.log('paso 2')
          if (data.radiales){
            console.log('paso 3')
          let exito_insertar = await insertRadiales(data.radiales);
          console.log('los datos mm de boton en insertado',exito_insertar)
  
          }  
        }else{ 
          if (data) { 
            console.log('paso 4')
            if(data.radiales){
              
            console.log('paso 5')
              let dataInsertar  = data.radiales.filter((item)=> item.accion = "insertar");
              
            console.log('paso 6')
              let dataActualizar  = data.radiales.filter((item)=> item.accion = "actualizar");
              
            console.log('paso 7')
            if (dataInsertar){
              let exito_insertar = await insertRadiales(dataInsertar)

              // console.log('datos isertados por la fecha',exito_insertar)
            }
            
            console.log('paso 8')
              if (dataActualizar){

                let exito_actualizar = await updateRadiales(dataActualizar);
                console.log('paso 9') 
                  console.log('datos autilizado por la fecha',exito_actualizar)
              } 
              

            }
          }
        } 
      }
      
      


      let fecha= data.fecha
  
      console.log('la fechas de la api',fecha)   
      if (fecha){
        let la_fecha_actualida = await actualizarFechaEnParametrosQR(fecha)
        console.log('la fecha fue actualiz a',la_fecha_actualida)
        
      }

      







    }
    catch(ex){
      console.error(ex);
    }
    // const fecha_busqueda = '2023-10-24 8:30:00'; 
    
};


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
        // console.log('ingreso aqui', rows.length)
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
