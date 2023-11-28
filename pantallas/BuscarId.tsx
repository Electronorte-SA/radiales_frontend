import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import FormDataScreen from './FormData';


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
      let registro = await getRadialById(inputID); // Assuming getRadialById is defined
      console.log('registro', registro);
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
        ) : (
          <FormDataScreen formData={formData} setShowScanDataScreen={setShowScanDataScreen} />
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
