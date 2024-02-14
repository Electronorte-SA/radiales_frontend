import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, FlatList, TouchableOpacity } from 'react-native'; // Importa TouchableOpacity
import { useNavigation } from '@react-navigation/native';
import { searchSubestaciones, searchSubestacionById } from './services/database.service';

const BuscaSube = () => {
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
        const results = await searchSubestaciones(searchText, page, 10); // Cargar 10 resultados por página
        const uniqueResults = results.filter(result => !searchResults.some(existingResult => existingResult.id === result.id));
        setSearchResults(prevResults => [...prevResults, ...uniqueResults]);
        setPage(prevPage => prevPage + 1);
        setHasMore(uniqueResults.length === 10); // Verificar si hay 10 resultados, si no, no hay más resultados disponibles
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
        const results = await searchSubestacionById(id);
        console.log('los resultadoo segun el id que seleccionado', results)
        // Navegar a la pantalla de detalles y pasar los resultados como parámetro
        navigation.navigate('Verdetaller', { id: id }); // Pasar el ID en lugar de los resultados

    } catch (error) {
        console.error('Error al buscar los datos:', error);
        Alert.alert('Error', 'Hubo un error al buscar los datos. Por favor, inténtalo de nuevo.');
    }
};

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.itemText}>{item.distrito}</Text>
      <Text style={styles.itemText}>{item.direccion}</Text>
      <Text style={styles.itemText}>{item.amt}</Text>
      <Text style={styles.itemText}>{item.sed}</Text>
      <TouchableOpacity onPress={() => handleGoButtonClick(item.id)} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Ir</Text>
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
        <Text style={styles.title}>Buscar Subestaciones</Text>
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
        <Text style={styles.resultsTitle}>Resultados de la búsqueda:</Text>
        <FlatList
          data={searchResults}
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
    color: 'blue', // Cambia el color del texto del botón
  },
});

export default BuscaSube;
