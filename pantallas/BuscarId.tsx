import React, { useEffect,useRef  , useState } from 'react';
import { ScrollView, View,Keyboard , Text, TextInput, Button, StyleSheet } from 'react-native';
import FormDataScreen from './FormData';
import { useNavigation } from '@react-navigation/native';


import {
  getRadialById
} from "./services/database.service";
interface QRGenProps {
  navigation: any;
}

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

const BuscarId: React.FC<QRGenProps> = ({ navigation }) => {
  // const [showScanDataScreen, setShowScanDataScreen] = useState(false);
  const [inputID, setInputID] = useState("I200783");
  
  const [scanned, setScanned] = useState<boolean>(false);
  // const [formData, setFormData] = useState<any>(/* Define la estructura de formData según tus necesidades */);
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    se: '',
    amt: '',
    marca: '',
    modelo_de_rele: '',
    nombre_de_radial: '',
    nivel_de_tension_kv: '',
    tipo: '',
    propietario: '',
    latitud: '',
    longitud: '',
    fec_instala: '',
    estado: '',
    fec_camb_bateria: '',
  });


  const [showScanDataScreen, setShowScanDataScreen] = React.useState(false);
  const handleSearchButton = async () => {
    try {
      let registro = await getRadialById(inputID);
      console.log('registro', registro);
      if (registro && registro.codigo) {
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
      } else {
        // ID no encontrado
        setShowScanDataScreen(true);
        setFormData(null); // Puedes ajustar esto según la estructura de tu FormData
      }
    } catch (ex) {
      console.error(ex);
    }
  };
  const inputRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // Cuando se muestra el teclado, enfoca en el TextInput
        inputRef.current.focus();
      }
    );

    return () => {
      // Limpia el listener cuando el componente se desmonta
      keyboardDidShowListener.remove();
    };
  }, []);

  const navigationl = useNavigation();

  const handleScanAgain = () => {
    setScanned(false);
    navigationl.navigate('Home');
  };
  
  return (
    <ScrollView contentContainerStyle={styles.containeru}>
    <View>
      {!showScanDataScreen ? (
        <View style={styles.centeredContent}>
          <Text style={styles.titlem}>Buscar por ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Introduce un ID"
            onChangeText={(text) => setInputID(text)}
            value={inputID}
          />
          <Button title="Buscar" onPress={handleSearchButton} />
        </View>
      ) : formData ? (
        <FormDataScreen formData={formData} setShowScanDataScreen={setShowScanDataScreen} />
      ) : (
        <View style={styles.centeredContent}>
          <Text style={styles.titlem}>ID no encontrado</Text>
          {/* Puedes agregar más contenido o mensajes si es necesario */}
          
      <Button title="BUSQUEDA NUEVA" onPress={handleScanAgain} />
        </View>
      )}
    </View>
  </ScrollView>
);
};
const styles = StyleSheet.create({
  containeru: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centeredContent: {
    alignItems: 'center',
  },
  titlem: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%', // Puedes ajustar el ancho según tus necesidades
  },
});

export default BuscarId;
