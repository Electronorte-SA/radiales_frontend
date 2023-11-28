import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, Button } from 'react-native';


interface FormData {
    codigo: string;
    se: string;
    amt: string;
    marca: string;
    modelo_de_rele: string;
    nombre_de_radial: string;
    nivel_de_tension_kv: string;
    tipo: string;
    propietario: string;
    latitud: string;
    longitud: string;
    fec_instala: string;
    estado: string;
    fec_camb_bateria: string;
  }

interface ScanDataScreenProps {
  navigation: any; // replace 'any' with the actual type of navigation
}

const FormDataScreen: React.FC<ScanDataScreenProps> = ({ navigation, formData }) => {
    // const [inputID, setInputID] = useState('I200783');
    
  const [scanned, setScanned] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [showScanDataScreen, setShowScanDataScreen] = useState<boolean>(false);

  const resetScanner = () => {
    setScanned(false);
    setScannedData(null);
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

      {/* <Button title="BUSQUEDA NUEVA" onPress={handleScanAgain} /> */}
    </ScrollView>
  );
};
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
  
export default FormDataScreen;
