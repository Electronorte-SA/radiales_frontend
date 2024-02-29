import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchSubestaciones, searchSubestacionById } from './services/database.service';

const BuscaSube = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const page = 0;
  const navigation = useNavigation();
  const [rowCount, setRowCount] = useState(0);
  const pageSize = 50

  const handleSearchTextChange = async (text:string) => {
    if (!loading) {
      setSearchText(text); 
      try {
        if (text.length >= 3) {
          setLoading(true);
        const {count, results} = await searchSubestaciones(text, page, pageSize);
        setLoading(false);
        setRowCount(count);
        //const uniqueResults = results.filter(result => !searchResults.some(existingResult => existingResult.id === result.id));
        setSearchResults(results);
         }
         else{
          setRowCount(0)
          setSearchResults([])
         }
      } catch (error) {
        setLoading(false);
                Alert.alert("Error", error);
      }
      
       
    }
    
  };

  const handleGoButtonClick = async (id) => {
    try {
      const results = await searchSubestacionById(id);
      navigation.navigate('Verdetaller', { id: id });
    } catch (error) {
      console.error('Error al buscar los datos:', error);
      Alert.alert('Error', 'Hubo un error al buscar los datos. Por favor, inténtalo de nuevo.');
    }
  };

  const renderHeader = () => (
    <View style={styles.resultItem}>
      <Text style={styles.itemText}>Distrito</Text>
      <Text style={styles.itemText}>Dirección</Text>
      <Text style={styles.itemText}>AMT</Text>
      <Text style={styles.itemText}>SED</Text>
      <Text style={styles.itemText}>Acción</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.itemText}>{item.distrito}</Text>
      <Text style={styles.itemText}>{item.direccion}</Text>
      <Text style={styles.itemText}>{item.amt}</Text>
      <Text style={styles.itemText}>{item.sed}</Text>
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
      
      <Text style={styles.resultsTitle}>Se encontraron {rowCount} coincidencias</Text>
        <FlatList
          data={searchResults.slice(0, 50)} // Limita la visualización a 5 resultados
          ListHeaderComponent={renderHeader} // Agrega el encabezado de la tabla
          renderItem={renderItem}
          keyExtractor={keyExtractor}
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

export default BuscaSube;
