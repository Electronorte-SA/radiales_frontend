import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { searchRadialById } from './services/database.service';
import Geolocation from '@react-native-community/geolocation'; 
import { Alert } from 'react-native';

const DetalleRadiales = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const id = route.params?.id;
        const results = await searchRadialById(id);
        console.log('result', results)
        setSearchResults(results);
      } catch (error) {
        console.error('Error al obtener los detalles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    getUserLocation();

  }, [route.params]);

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error al obtener la ubicación del usuario:', error);
        setLocationError(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // const handleGoToGPSRutas = (coordenadas) => {
  //   console.log('coord', coordenadas)
  //   if (userLocation) {
  //       console.log('los codenadas de radiales',coordenadas)
  //     const { latitude: userLatitude, longitude: userLongitude } = userLocation;
  //     const [destLatitude, destLongitude] = coordenadas.split(",");
  //     const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${destLatitude},${destLongitude}`;
  //     Linking.openURL(googleMapsUrl);
  //   } else {
  //     console.log('No se pudo obtener la ubicación del usuario.');
  //   }
  // };

const handleGoToGPSRutas = (coordenadas) => {
  console.log('coord', coordenadas);
  
  if (coordenadas === 'null,null') {
    Alert.alert(
      'Ubicación no encontrada',
      'Falta ingresar la ubicación del radial.',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]
    );
    return; // Detener la ejecución de la función si las coordenadas son nulas
  }

  if (userLocation) {
    console.log('los codenadas de radiales', coordenadas);
    const { latitude: userLatitude, longitude: userLongitude } = userLocation;
    const [destLatitude, destLongitude] = coordenadas.split(",");
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${destLatitude},${destLongitude}`;
    Linking.openURL(googleMapsUrl);
  } else {
    console.log('No se pudo obtener la ubicación del usuario.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.resultsTitle}>Detalles del dato de radiales:</Text>
      <View style={styles.resultsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.resultItem}>
                  <Text style={styles.label}>Código:</Text>
                  <Text style={styles.text}>{item.codigo}</Text>
              
                  <Text style={styles.label}>SE:</Text>
                  <Text style={styles.text}>{item.se}</Text>
              
                  <Text style={styles.label}>AMT:</Text>
                  <Text style={styles.text}>{item.amt}</Text>
              
                  <Text style={styles.label}>Marca:</Text>
                  <Text style={styles.text}>{item.marca}</Text>
              
                  <Text style={styles.label}>Modelo de rele:</Text>
                  <Text style={styles.text}>{item.modelo_de_rele}</Text>
              
                  <Text style={styles.label}>Nombre de radial:</Text>
                  <Text style={styles.text}>{item.nombre_de_radial}</Text>
              
                  <Text style={styles.label}>Nivel de tensión (kV):</Text>
                  <Text style={styles.text}>{item.nivel_de_tension_kv}</Text>
              
                  <Text style={styles.label}>Tipo:</Text>
                  <Text style={styles.text}>{item.tipo}</Text>
              
                  {/* Agrega los campos adicionales que desees mostrar */}
                  <Button
                    title="Ir"
                    onPress={() => handleGoToGPSRutas(`${item.latitud},${item.longitud}`)}
                  />
                </View>
              )}
              
          />
        )}
      </View>
      {locationError && (
        <Text style={styles.errorText}>Error al obtener la ubicación: {locationError}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'blue',
  },
  resultItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
});

export default DetalleRadiales;
