import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import Geolocation from 'react-native-get-location';

const GPSRutas = ({ route }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message: 'Necesitamos acceder a tu ubicación para mostrar la ruta.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Permiso de ubicación denegado');
        }

        const location = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });

        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      } catch (error) {
        console.error('Error al obtener la ubicación del usuario:', error);
        setError(error.message);
      }
    };

    fetchUserLocation();
  }, []);

  const destinationCoordinates = route.params.coordinates; // Suponiendo que recibes las coordenadas como parámetro

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={MapView.PROVIDER_GOOGLE} // Usar proveedor de Google Maps
        >
          {destinationCoordinates && (
            <Polyline
              coordinates={[
                { latitude: userLocation.latitude, longitude: userLocation.longitude },
                { latitude: destinationCoordinates.latitude, longitude: destinationCoordinates.longitude },
              ]}
              strokeColor="#000" // color de la línea
              strokeWidth={2} // ancho de la línea
            />
          )}
        </MapView>
      ) : (
        <Text style={styles.errorText}>{error || 'Obteniendo ubicación...'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GPSRutas;
