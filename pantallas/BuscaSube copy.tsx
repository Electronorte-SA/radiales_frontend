import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchSubestaciones } from './services/database.service';
import debounce from 'lodash/debounce';

const BuscaSube = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const navigation = useNavigation();

  useEffect(() => {
    if (searchText !== '') {
      handleSearchTextChange(searchText);
    }
  }, [pagination]); // Trigger search when pagination changes

  const handleSearchTextChange = async (text) => {
    setSearching(true);
    try {
      const results = await searchSubestaciones(text, pagination.page, pagination.pageSize);
      setSearchResults(prevResults => pagination.page === 1 ? results : [...prevResults, ...results]);
    } catch (error) {
      console.error("Error al buscar subestaciones:", error);
      Alert.alert("Error", "Ocurrió un error al buscar subestaciones. Por favor, inténtelo de nuevo.");
    }
    setSearching(false);
  };

  const handleSearchButtonPress = () => {
    setPagination({ ...pagination, page: 1 });
  };

  const debouncedSearch = debounce(handleSearchTextChange, 300);

  const loadMoreResults = async () => {
    if (!loadingMore) {
      setLoadingMore(true);
      try {
        const nextPageResults = await searchSubestaciones(searchText, pagination.page + 1, pagination.pageSize);
        if (nextPageResults && nextPageResults.length > 0) {
          setSearchResults(prevResults => [...prevResults, ...nextPageResults]);
          setPagination(prevPagination => ({ ...prevPagination, page: prevPagination.page + 1 }));
        } else {
          // No hay más resultados disponibles
          console.log('No hay más resultados disponibles.');
        }
      } catch (error) {
        console.error("Error al cargar más resultados:", error);
        Alert.alert("Error", "Ocurrió un error al cargar más resultados. Por favor, inténtelo de nuevo.");
      }
      setLoadingMore(false);
    }
  };

  const paginatedResults = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return searchResults.slice(start, end);
  }, [pagination, searchResults]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Buscar Subestaciones</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el término de búsqueda"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              debouncedSearch(text);
            }}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchButtonPress}
          >
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
        {searching && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
      {searchResults && searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Resultados de la búsqueda:</Text>
          <View style={styles.resultHeader}>
            <Text style={styles.headerText}>Distrito</Text>
            <Text style={styles.headerText}>Dirección</Text>
            <Text style={styles.headerText}>AMT</Text>
            <Text style={styles.headerText}>SED</Text>
          </View>
          <FlatList
            data={paginatedResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <Text style={styles.itemText}>{item.distrito}</Text>
                <Text style={styles.itemText}>{item.direccion}</Text>
                <Text style={styles.itemText}>{item.amt}</Text>
                <Text style={styles.itemText}>{item.sed}</Text>
              </View>
            )}
            onEndReached={loadMoreResults}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => (
              <View>
                {loadingMore && <ActivityIndicator size="small" color="#0000ff" />}
              </View>
            )}
          />
        </View>
      )}
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
    color: 'black', // Color negro para el título
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'black', // Color negro para el texto ingresado
  },
  searchButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black', // Color negro para el título de los resultados
  },
  resultHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black', // Color negro para el texto del encabezado
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
    fontWeight: 'bold', // Texto en negrita para los datos de la tabla
    color: 'black', // Color negro para el texto de los datos
  },
});


export default BuscaSube;
