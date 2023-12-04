import React, {useState, useEffect } from 'react';
import {ScrollView, StyleSheet, Text, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const FormDataScreen: React.FC<ScanDataScreenProps> = ({navigation,  formData,
}) => {
  // const [inputID, setInputID] = useState('I200783');

  const [scanned, setScanned] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [showScanDataScreen, setShowScanDataScreen] = useState<boolean>(false);
  const navigationl = useNavigation();

  const handleScanAgain = () => {
    navigationl.navigate('Home');
  };
  
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        padding: 40,
        marginTop: 20,
        backgroundColor: 'lightgray',
      }}>
      <Text style={styles.title}>{formData.nombre_de_radial}</Text>
      <Text style={styles.titlep}>{formData.tipo}</Text>

      {formData.codigo ? (
        <>
          <Text style={styles.label}>
            
          <Text style={{color: 'black'}}>código: </Text>
          <Text style={{color: 'gray'}}>{formData.codigo}</Text>
          </Text>
          {/* Resto de tus elementos */}
          <Text style={styles.label}>
            <Text style={{color: 'black'}}>SE: </Text>
            <Text style={{color: 'gray'}}>{formData.se}</Text>
          </Text>

          <Text style={styles.label}>
          <Text style={{color: 'black'}}>AMT:  </Text>
            
            <Text style={{color: 'gray'}}>{formData.amt}</Text>
            </Text>
          <Text style={styles.label}>
          <Text style={{color: 'black'}}>Marca: </Text>
          
          <Text style={{color: 'gray'}}>{formData.marca}</Text>
          
            
            </Text>
          <Text style={styles.label}>

          <Text style={{color: 'black'}}>Modelo de Rele: </Text>
          <Text style={{color: 'gray'}}>{formData.modelo_de_rele}</Text>
          
          </Text>
          {/* <Text style={styles.label}>Nombre de Radial: {formData.nombre_de_radial}</Text> */}
          <Text style={styles.label}>

          <Text style={{color: 'black'}}>Nivel de Tensión (kV): </Text>
          <Text style={{color: 'gray'}}>{formData.nivel_de_tension_kv}</Text>
       
          </Text>
          {/* <Text style={styles.label}>Tipo: {formData.tipo}</Text> */}
          <Text style={styles.label}>
          <Text style={{color: 'black'}}>propietario: </Text>
          <Text style={{color: 'gray'}}>{formData.propietario}</Text>
       </Text>
          {formData.latitud && (
            <Text style={styles.label}>Latitud: {formData.latitud}
            
          <Text style={{color: 'black'}}>Latitud: </Text>
          <Text style={{color: 'gray'}}>{formData.latitud}</Text>
            </Text>
          )}
          {formData.longitud && (
            <Text style={styles.label}>
          <Text style={{color: 'black'}}>Longitud: </Text>
          <Text style={{color: 'gray'}}>{formData.longitud}</Text>
            </Text>
          )}
          <Text style={styles.label}>
          
          <Text style={{color: 'black'}}>Fecha de Instalación: </Text>
          <Text style={{color: 'gray'}}>{formData.fec_instala}</Text>
          </Text>
          <Text style={styles.label}>
          <Text style={{color: 'black'}}>Estado: </Text>
          <Text style={{color: 'gray'}}>{formData.estado}</Text>
          </Text>
          <Text style={styles.label}>
          <Text style={{color: 'black'}}>Fecha Cambio de Batería: </Text>
          <Text style={{color: 'gray'}}>{formData.fec_camb_bateria}</Text>
          </Text>
        </>
      ) : (
        <Text style={styles.label}>ID no encontrado</Text>
      )}

      <Button title="BUSQUEDA NUEVA" onPress={handleScanAgain} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    marginTop: -70,
    textAlign: 'center',
  },
  containerMENU: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 26,
    textAlign: 'center',
    color: 'black',
    marginTop: -10, // Ajusta el valor de marginTop según tus necesidades
  },
  titlep: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: -8, // Ajusta el valor de marginTop según tus necesidades
  },
  titleS: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,

    textAlign: 'center',
    marginTop: -8, // Ajusta el valor de marginTop según tus necesidades
  },
  scannerContainer: {
    width: '100%',
    height: '80%',
    marginTop: 18,
    position: 'relative',
  },
  scanner: {
    width: '100%',
    height: '100%',
  },
  scanData: {
    position: 'absolute',
    bottom: 0,
    marginTop: -88,

    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
  },
  dataContainer: {
    marginBottom: 20,
  },
  dataText: {
    textAlign: 'left',
    marginBottom: 10,
  },

  containeru: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  titlem: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
    color: 'black',
  },

  labelt: {
    textAlign: 'left',
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FormDataScreen;
