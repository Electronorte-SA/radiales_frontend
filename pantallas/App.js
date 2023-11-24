import React, { useState, useEffect } from "react";
import { View, Text,  Alert, StyleSheet, Button, ActivityIndicator  } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TextInput } from "react-native";
import {  ScrollView } from 'react-native';

import {
  initializeDatabase,
  handleSync,
  getRadialById,
  handleDelete,
} from "./services/database.service";
const Stack = createStackNavigator();

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const Tab = createBottomTabNavigator();
  const [showScanDataScreen, setShowScanDataScreen] = useState(false);

  const [inputID, setInputID] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    codigo: "",
    se: "",
    amt: "",
    marca: "",
    modelo_de_rele: "",
    nombre_de_radial: "",
    nivel_de_tension_kv: "",
    tipo: "",
    propietario: "",
    latitud: "",
    longitud: "",
    fec_instala: "",
    estado: "",
    fec_camb_bateria: "",
  });

  // useEffect(() => {
  //   // Pide permisos para la cámara y establece el estado de los permisos
  //   (async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  
  //   // Inicia la animación cuando el componente se monta
  //   setLoading(true);
  
  //   // Detiene la animación después de 10 segundos y ejecuta handleSync()
  //   const timeoutId = setInterval(() => {
  //     //alert('sync...')
  //     //setLoading(true);
  //     handleSync(); // Llama a handleSync() después de 10 segundos
  //     //setLoading(false);
  //   }, 10000);
  
  //   // Inicializa la base de datos
  //   initializeDatabase();
    
  //   (async () => {
  //      await handleSync();
  //   })();
    
  //   setLoading(false);
  //   // Limpia el temporizador y la animación al desmontar el componente
  //   return () => {
  //     clearInterval(timeoutId);
  //     setLoading(false);
  //   };
  // }, []);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  
    const checkServerStatus = async () => {
      try {
        // Realiza una solicitud a tu servidor para verificar su estado
        const response = await fetch('http://10.112.47.55:5000/qr');
        console.log('re spon', response)
        if (response.ok) {
          // Si la respuesta es exitosa, muestra una alerta indicando que el servidor está corriendo
          Alert.alert('Servidor Corriendo', 'El servidor está en línea.');
        } else {
          // Si la respuesta no es exitosa, muestra una alerta indicando que el servidor está caído
          Alert.alert('Servidor Caído', 'No se puede acceder al servidor en este momento.');
        }
      } catch (error) {
        // Si hay un error al realizar la solicitud, muestra una alerta indicando que el servidor está caído
        Alert.alert('Servidor  Caído', 'No se puede acceder al servidor en este momento.');
      }
    };
  
  
    // Llama a la función para verifica r el estado del servidor
    // Llama a la función para verifica ssr el estado del servidor
    checkServerStatus();
  
    // Inicia la animación cuando el componente se monta
    setLoading(true);
  
    // Detiene la animación después de 10 segundos y ejecuta handleSync()
    const timeoutId = setInterval(() => {
      handleSync(); // Llama a handleSync() después de 10 segundos
    }, 10000);
  
    // Inicializa la base de datos
    initializeDatabase();
  
    // Maneja la sincronización
    handleSync();
  
    // Limpia el temporizador y la animación al desmontar el componente
    return () => {
      clearInterval(timeoutId);
      setLoading(false);
    };
  }, []);
  

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    let registro = await getRadialById(data);
    console.log("los dtos en scanner", data);
    // Llena el formulario con los datos escaneados
    setFormData({
      codigo: registro.codigo,
      se: registro.se,
      amt: registro.amt,
      marca: registro.marca,
      modelo_de_rele: registro.modelo_de_rele,
      nombre_de_radial: registro.nombre_de_radial,
      nivel_de_tension_kv: registro.nivel_de_tension_kv,
      tipo: registro.tipo,
      propietario: registro.propietario,
      latitud: registro.latitud,
      longitud: registro.longitud,
      fec_instala: registro.fec_instala,
      estado: registro.estado,
      fec_camb_bateria: registro.fec_camb_bateria,
    });
  };
  const handleSearchButton = async () => {
    try {
      let registro = await getRadialById(inputID);
      console.log("registro", registro);
      if (registro.codigo) {
        setFormData({
          codigo: registro.codigo,
          se: registro.se,
          amt: registro.amt,
          marca: registro.marca,
          modelo_de_rele: registro.modelo_de_rele,
          nombre_de_radial: registro.nombre_de_radial,
          nivel_de_tension_kv: registro.nivel_de_tension_kv,
          tipo: registro.tipo,
          propietario: registro.propietario,
          latitud: registro.latitud,
          longitud: registro.longitud,
          fec_instala: registro.fec_instala,
          estado: registro.estado,
          fec_camb_bateria: registro.fec_camb_bateria,
        });

        setShowScanDataScreen(true);
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedData(null);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
     
      >
        <Tab.Screen name="RaptorQR" component={HomeScreen} />
        <Tab.Screen name="codigoQ" component={Codigo} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  function HomeScreen({ navigation }) {
    const [showScanDataScreen, setShowScanDataScreen] = useState(false);
    const [hideScanner, setHideScanner] = useState(false);
  
    useEffect(() => {
      if (scanned) {
        setShowScanDataScreen(true);
        setHideScanner(true); // Ocultar la cámara y los botones
      }
    }, [scanned]);
  
    // Si no está cargando, muestra la vista normal de HomeScreen
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.containerMENU}>
          {!hideScanner && (
            <>
              {/* <Button title="Sincronizar" onPress={handleSync} /> */}
              {/* <Button title="Limpiar" onPress={handleDelete} /> */}
              <Text style={styles.titleS}>Escanea un Código QR</Text>
              {hasPermission === null ? (
                <>
                  <Text>cargando datos ...</Text>
                  <ActivityIndicator size={100} color="#00ff00" />
                </>
              ) : hasPermission === false ? (
                <Text>Acceso a la cámara denegado.</Text>
              ) : (
                <View style={styles.scannerContainer}>
                  <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.scanner}
                  />
                  {scanned && (
                    <View style={styles.scanData}>
                      <Text>ID: {scannedData.codigo}</Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
          {showScanDataScreen && (
            <ScanDataScreen
              formData={formData}
              setShowScanDataScreen={setShowScanDataScreen}
            />
          )}
        </View>
      </ScrollView>
    );
  }
  
  function Codigo({ navigation }) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.containeru}>
          {!showScanDataScreen ? (
            <View>
              <Text style={styles.titlem}>Buscar por ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Introduce un ID"
                onChangeText={(text) => setInputID(text)}
                value={inputID}
              />
              <Button title="Buscar" onPress={handleSearchButton} />
            </View>
          ) : (
            <ScanDataScreen
              formData={formData}
              setShowScanDataScreen={setShowScanDataScreen}
            />
          )}
        </View>
      </ScrollView>
    );
  }
  
  function ScanDataScreen({ navigation }) {
    const handleScanAgain = () => {
      resetScanner();
      setFormData({
        codigo: "",
        se: "",
        amt: "",
        marca: "",
        modelo_de_rele: "",
        nombre_de_radial: "",
        nivel_de_tension_kv: "",
        tipo: "",
        propietario: "",
        latitud: "",
        longitud: "",
        fec_instala: "",
        estado: "",
        fec_camb_bateria: "",
      });
      setShowScanDataScreen(false);
    };
  
    return (
      <ScrollView contentContainerStyle={{ flex: 1, padding: 20 }}>
        <Text style={styles.title}>{formData.nombre_de_radial}</Text>
        <Text style={styles.titlep}>{formData.tipo}</Text>
  
        {formData.codigo ? (
          <>
            <Text style={styles.label}>Código: {formData.codigo}</Text>
            {/* Resto de tus elementos */}
            <Text style={styles.label}>SE: {formData.se}</Text>
            <Text style={styles.label}>AMT: {formData.amt}</Text>
            <Text style={styles.label}>Marca: {formData.marca}</Text>
            <Text style={styles.label}>Modelo de Rele: {formData.modelo_de_rele}</Text>
            {/* <Text style={styles.label}>Nombre de Radial: {formData.nombre_de_radial}</Text> */}
            <Text style={styles.label}>Nivel de Tensión (kV): {formData.nivel_de_tension_kv}</Text>
            {/* <Text style={styles.label}>Tipo: {formData.tipo}</Text> */}
            <Text style={styles.label}>Propietario: {formData.propietario}</Text>
            {formData.latitud && (
              <Text style={styles.label}>Latitud: {formData.latitud}</Text>
            )}
            {formData.longitud && (
              <Text style={styles.label}>Longitud: {formData.longitud}</Text>
            )}
            <Text style={styles.label}>Fecha de Instalación: {formData.fec_instala}</Text>
            <Text style={styles.label}>Estado: {formData.estado}</Text>
            <Text style={styles.label}>Fecha Cambio de Batería: {formData.fec_camb_bateria}</Text>
  
          </>
        ) : (
          <Text style={styles.label}>ID no encontrado</Text>
        )}
  
        <Button title="BUSQUEDA NUEVA" onPress={handleScanAgain} />
      </ScrollView>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    
    textAlign: "center",
  },
  containerMENU: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  titlep: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: -8,  // Ajusta el valor de marginTop según tus necesidades

  },
  titleS: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: -8,  // Ajusta el valor de marginTop según tus necesidades

  },
  scannerContainer: {
    width: "100%",
    height: "80%",
    marginTop: 18,
    position: "relative",
  },
  scanner: {
    width: "100%",
    height: "100%",
  },
  scanData: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
  },
  dataContainer: {
    marginBottom: 20,
  },
  dataText: {
    textAlign: "left",
    marginBottom: 10,
  },

  containeru: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  titlem: {
    fontSize: 20,
    marginBottom: 20,
  },
  label: {
    textAlign: "left",
    marginBottom: 4,
  },

  labelt: {
    textAlign: "left",
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
