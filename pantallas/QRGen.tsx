import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ScanDataScreen from './ScanDataScreen';

interface QRGenProps {
  navigation: any;
}

const QRGen: React.FC<QRGenProps> = ({ navigation }) => {
  const [showScanDataScreen, setShowScanDataScreen] = useState(false);
  const [inputID, setInputID] = useState('');
  const [formData, setFormData] = useState<any>(/* Define la estructura de formData según tus necesidades */);

  const handleSearchButton = () => {
    // Lógica para buscar por ID
    // Puedes implementar esta lógica según tus necesidades
    // Por ejemplo, puedes hacer una llamada a la API para obtener datos basados en el ID ingresado
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
          <ScanDataScreen formData={formData} setShowScanDataScreen={setShowScanDataScreen} />
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

export default QRGen;
