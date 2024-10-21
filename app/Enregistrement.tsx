import { View, StyleSheet, TouchableOpacity, Text, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingAddButton from './components/FloatingAddButton';

const dataCategories = [
  { id: 0, name: 'Tous' },
  { id: 1, name: 'Enregistrements' },
  { id: 2, name: 'Avancer' },
  { id: 3, name: 'Payée' },
];

const dataItems = [
  { id: 1, name: 'NGOKA Franck', status: 'Payée', amount: null },
  { id: 2, name: 'NGOKA Franck', status: 'Avancer', amount: '1000.XAF' },
  { id: 3, name: 'NGOKA Franck', status: 'Enregistrements', amount: null },
  { id: 4, name: 'NGOKA Franck', status: 'Payée', amount: null },
  { id: 5, name: 'NGOKA Franck', status: 'Payée', amount: null },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState(0); // Default to 'Tous'
  const [filteredItems, setFilteredItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    filterItems();
  }, [selectedCategory]);

  const filterItems = () => {
    if (selectedCategory === 0) {
      setFilteredItems(dataItems);
    } else {
      const selectedStatus = dataCategories.find(category => category.id === selectedCategory).name;
      const filteredData = dataItems.filter(item => item.status === selectedStatus);
      setFilteredItems(filteredData);
    }
  };
  const handleLogout = async () => {
    // Clear tokens from storage on logout
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    Alert.alert('Déconnexion réussie', 'Vous êtes maintenant déconnecté.');
    router.push('/'); 
  };
  function renderMenu() {
    return (
      <>
       
        <StatusBar style="dark" />
        <View style={{ alignItems: 'center' }}>
          <FlatList
            data={dataCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 8,
                  paddingHorizontal: 14,
                  backgroundColor: selectedCategory === item.id ? COLORS.primary : COLORS.gray10,
                  borderRadius: 22,
                  alignItems: 'center',
                  marginHorizontal: 4,
                }}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text style={{ fontSize: 16, color: selectedCategory === item.id ? COLORS.white : COLORS.black }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
       
      </>
    );
  }

  function renderItems() {
    return (
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSubText}>Licence génie logiciel</Text>
              <Text style={styles.itemSubTextSemiBold}>Masculin  |  Logbessou</Text>
              {item.amount && <Text style={styles.itemAmount}>{item.amount}</Text>}
            </View>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: item.status === 'Payée' ? '#BCF5CB' : item.status === 'Avancer' ? '#FDD7AA' : '#D0E8FF' },
              ]}
            >
              <Text style={[styles.statusText, 
                { color: item.status === 'Payée' ? '#18632e' : item.status === 'Avancer' ? '#f67419' : '#1a4bb3' }
              ]}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    );
  }

  return (
   <>
     <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container} >
      <View style={{ flexDirection: 'row', marginTop: 64, backgroundColor: COLORS.white }}>
        <Text style={[styles.header, { top: -8 }]}>Enregistrement</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            {/* <Text style={styles.loginButtonText}>Déconnexion</Text> */}
            <Ionicons name="log-out-outline" size={22} color={COLORS.white} style={{ left: 2 }} />
          </TouchableOpacity>
       
      </View>
      <View style={{ marginTop: -10, backgroundColor: COLORS.white }}>
        {renderMenu()}
      </View>
      <View style={styles.listContainer}>
        {renderItems()}
      </View>
      <FloatingAddButton />
    </View>
   </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    left: 10,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: COLORS.lightGray,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray2,
    marginVertical: 4,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemSubText: {
    color: COLORS.black,
    fontSize: 14,
  },
  itemSubTextSemiBold: {
    color: COLORS.gray60,
    fontSize: 12,
  },
  itemAmount: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 14,
    height: 30,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    top: -10,
    right: 10,
    backgroundColor: COLORS.secondary,
    width: 30,
    height: 30,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    left: -5,
  },
});
