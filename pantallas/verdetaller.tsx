import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { searchSubestacionById } from './services/database.service';

const Verdetaller = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleGoToGPSRutas = (coordenadas) => {
    navigation.navigate('GPSRutas', { coordenadas });
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
