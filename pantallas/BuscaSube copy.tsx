import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchSubestaciones } from './services/database.service';
import debounce from 'lodash/debounce';
import { RadioButton } from 'react-native-paper';

const BuscaSube = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation = useNavigation();

  const handleSearchTextChange = async (text) => {
    setSearchText(text);
    setSearching(true);
    setShowResults(true);
    try {
      const results = await searchSubestaciones(text);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Error al buscar subestaciones:", error);
      Alert.alert("Error", "Ocurrió un error al buscar subestaciones. Por favor, inténtelo de nuevo.");
    }
    setSearching(false);
  };

  const handleSearchButtonPress = () => {
    handleSearchTextChange(searchText);
  };

  const debouncedSearch = debounce(handleSearchTextChange, 300);

  const loadMoreResults = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setSearchResults(prevResults => [...prevResults, { direccion: 'Additional Result 1' }, { direccion: 'Additional Result 2' }]);
        setPage(prevPage => prevPage + 1);
        setLoadingMore(false);
      }, 1000);
    }
  };

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
            data={searchResults}
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
            ListFooterComponent={loadingMore && <ActivityIndicator size="small" color="#0000ff" />}
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
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginRight: 10,
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
  },
});

export default BuscaSube;
