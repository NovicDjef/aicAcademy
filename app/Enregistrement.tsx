import { View, StyleSheet, TouchableOpacity, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FloatingAddButton from './components/FloatingAddButton';

const dataCategories = [
  { id: 0, name: 'Tous' },
  { id: 1, name: 'Non payé' },
  { id: 2, name: 'Partiellement payé' },
  { id: 3, name: 'Payé' },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState(0); // Default to 'Tous'
  const [filteredItems, setFilteredItems] = useState([]);
  const [students, setStudents] = useState([]);  // Pour stocker les étudiants récupérés
  const [loading, setLoading] = useState(false); // Pour gérer l'indicateur de chargement
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 

  useEffect(() => {
    filterItems();
  }, [selectedCategory, students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté pour récupérer les étudiants.');
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.get('https://students.aic.cm/api/v1/students', config);
      if (response.status === 200 && response.data && response.data.data && response.data.data.data) {
        setStudents(response.data.data.data);  // Correction ici
        console.log("Étudiants récupérés:", response.data.data.data);
      } else {
        console.log("Réponse inattendue:", response.data);
        Alert.alert('Erreur', 'Format de données inattendu lors de la récupération des étudiants.');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants:", error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des étudiants.');
    } finally {
      setLoading(false);
    }
  };
  
  // Assurez-vous que cette fonction est appelée dans un useEffect
  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Ajoutez ceci pour déboguer
  useEffect(() => {
    console.log("État actuel des étudiants:", students);
  }, [students]);

  const filterItems = () => {
    if (selectedCategory === 0) {
      setFilteredItems(students);
    } else {
      const statusMap = {
        1: null,
        2: 'PARTIALLY_PAID',
        3: 'PAID'
      };
      const selectedStatus = statusMap[selectedCategory];
      const filteredData = students.filter(student => 
        selectedStatus === null 
          ? student.payment_status === null 
          : student.payment_status === selectedStatus
      );
      setFilteredItems(filteredData);
    }
    console.log("Éléments filtrés:", filteredItems);
  };
  
  useEffect(() => {
    filterItems();
  }, [selectedCategory, students]);

  const handleLogout = async () => {
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
    if (loading) {
      return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;
    }
  
    if (filteredItems.length === 0) {
      return <Text style={{ textAlign: 'center', marginTop: 50 }}>Aucun étudiant trouvé</Text>;
    }
  
    return (
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{`${item.lastname} ${item.firstname}`}</Text>
              <Text style={styles.itemSubText}>{item.grade}</Text>
              <Text style={styles.itemSubTextSemiBold}>{`${item.gender_tr} | ${item.address}`}</Text>
              {item.paid_amount && <Text style={styles.itemAmount}>{`${item.paid_amount} FCFA`}</Text>}
            </View>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: getStatusColor(item.payment_status) },
              ]}
            >
              <Text style={[
                styles.statusText, 
                { color: getStatusTextColor(item.payment_status) }
              ]}>
                {item.payment_status_tr || 'Non payé'}
              </Text>
            </View>
          </View>
        )}
      />
    );
  }
const getStatusColor = (status) => {
  switch(status) {
    case 'PAID': return '#BCF5CB';
    case 'PARTIALLY_PAID': return '#FDD7AA';
    default: return '#D0E8FF';
  }
};

const getStatusTextColor = (status) => {
  switch(status) {
    case 'PAID': return '#18632e';
    case 'PARTIALLY_PAID': return '#f67419';
    default: return '#1a4bb3';
  }
};


  return (
   <>
     <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginTop: 64, backgroundColor: COLORS.white }}>
        <Text style={[styles.header, { top: -8 }]}>Enregistrement</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
});

