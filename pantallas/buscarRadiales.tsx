import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchRadialesQR } from './services/database.service';
import { searchRadialById } from './services/database.service';
import {getWordCountRadiales } from './services/database.service';

const BuscarRadiales = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  const loadMoreResults = useCallback(async () => {
    if (!loading && hasMore) {
      setLoading(true);
      try {
        if (searchText.length >= 3) {
        const results = await searchRadialesQR(searchText, page, 10);
        const uniqueResults = results.filter(result => !searchResults.some(existingResult => existingResult.id === result.id));
        setSearchResults(prevResults => [...prevResults, ...uniqueResults]);
        setPage(prevPage => prevPage + 1);
        setHasMore(uniqueResults.length === 10);
        }
        
      } catch (error) {
        console.error("Error al cargar más resultados:", error);
        Alert.alert("Error", "Ocurrió un error al cargar más resultados. Por favor, inténtelo de nuevo.");
      }
      setLoading(false);
    }
  }, [loading, hasMore, page, searchText, searchResults]);

  useEffect(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    if (searchText.trim() !== '') {
      loadMoreResults();
    }
  }, [searchText]);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleGoButtonClick = async (id) => {
    try {
      const resultsRA = await searchRadialById(id);
      navigation.navigate('DetalleRadiales', { id: id });
    } catch (error) {
      console.error('Error al buscar los datos:', error);
      Alert.alert('Error', 'Hubo un error al buscar los datos. Por favor, inténtalo de nuevo.');
    }
  };

  const renderHeader = () => (
    <View style={styles.resultItem}>
      <Text style={styles.itemText}>Código</Text>
      <Text style={styles.itemText}>SE</Text>
      <Text style={styles.itemText}>AMT</Text>
      <Text style={styles.itemText}>Marca</Text>
      <Text style={styles.itemText}>Acción</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.itemText}>{item.codigo}</Text>
      <Text style={styles.itemText}>{item.se}</Text>
      <Text style={styles.itemText}>{item.amt}</Text>
      <Text style={styles.itemText}>{item.marca}</Text>
      <TouchableOpacity onPress={() => handleGoButtonClick(item.id)} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>VER MAS</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="small" color="#0000ff" />;
  };

  const keyExtractor = (item, index) => index.toString();

  return (
    <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Buscar Radiales</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el término de búsqueda"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>Resultados de la búsqueda: {getWordCountRadiales()} palabras encontradas</Text>
      <FlatList
        ListHeaderComponent={renderHeader} // Agrega la cabecera de la tabla
        data={searchResults.slice(0, 5)} // Limita la visualización a los primeros 5 resultados
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMoreResults}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  searchContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    color: 'black',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  buttonText: {
    color: 'blue',
  },
});

export default BuscarRadiales;
