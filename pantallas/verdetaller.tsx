import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { searchSubestacionById } from './services/database.service';
import Geolocation from '@react-native-community/geolocation'; // Importar Geolocation desde '@react-native-community/geolocation'

const Verdetaller = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // Estado para almacenar la ubicación del usuario
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const id = route.params?.id;
        const results = await searchSubestacionById(id);
        setSearchResults(results);
      } catch (error) {
        console.error('Error al obtener los detalles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

  }, [route.params]);

  useEffect(() => {
    // Función para obtener la ubicación actual del usuario
    const fetchUserLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación del usuario:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    // Llamar a la función para obtener la ubicación actual del usuario
    fetchUserLocation();
  }, []); // Solo se ejecuta una vez al montar el componente

  const handleGoToGPSRutas = (coordenadas) => {
    if (userLocation) {
      // Obtener las coordenadas del usuario
      const { latitude: userLatitude, longitude: userLongitude } = userLocation;


      // Obtener las coordenadas del destino
      const [ destLatitude, destLongitude ] = coordenadas.split(",");


      // Generar la URL de Google Maps con las coordenadas del usuario y del destino
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${destLatitude},${destLongitude}`;

      // Abrir Google Maps con las coordenadas proporcionadas
      Linking.openURL(googleMapsUrl);
    } else {
      console.log('No se pudo obtener la ubicación del usuario.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultsTitle}>Detalles del dato:</Text>
      <View style={styles.resultsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <Text style={styles.label}>Provincia:</Text>
                <Text style={styles.text}>{item.provincia}</Text>

                <Text style={styles.label}>Distrito:</Text>
                <Text style={styles.text}>{item.distrito}</Text>

                <Text style={styles.label}>Dirección:</Text>
                <Text style={styles.text}>{item.direccion}</Text>

                <Text style={styles.label}>AMT:</Text>
                <Text style={styles.text}>{item.amt}</Text>

                <Text style={styles.label}>SED:</Text>
                <Text style={styles.text}>{item.sed}</Text>

                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.text}>{item.tipo}</Text>

                <Text style={styles.label}>Transformador:</Text>
                <Text style={styles.text}>{item.transformador}</Text>

                <Button
                  title="Ir"
                  onPress={() => handleGoToGPSRutas(item.coordenadas)}
                />
              </View>
            )}
          />
        )}
      </View>
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
});

export default Verdetaller;
