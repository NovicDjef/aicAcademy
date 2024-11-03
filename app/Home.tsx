import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import Header from './Header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Stack, useRouter } from 'expo-router';
import FloatingAddButton from './components/FloatingAddButton';

// URL de l'API
const API_URL = 'https://students.aic.cm/api/v1/formations';

const Home = () => {
  // State pour stocker les données de formation
  const [formations, setFormations] = useState([]);
  //const router = useRouter(); // Initialise le router

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté pour récupérer les formations.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(API_URL, config);

      if (response.status === 200 && response.data && response.data.data) {
        const formationsData = response.data.data;
        setFormations(formationsData);
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer les formations. Format de réponse inattendu.');
      }
    } catch (error) {
      Alert.alert('Erreur', `Une erreur est survenue lors de la récupération des formations: ${error.message}`);
    }
  };

  // Couleurs de fond pour les cards, utilisées de manière cyclique
  const backgroundColors = ['#3AAFFF40', '#FFA50040', "#3AAFFF", '#D3444E40', "#fffAAA", "#D3444E", '#fffAAA40'];

  return (
    <SafeAreaView style={styles.areaStyle}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.center}>
          {/* Affichage des formations récupérées */}
          {formations.map((formation, index) => (
             <Link  
             key={formation.id}
             href={{
               pathname: `/Enregistrement`,
               params: { formationId: formation.id, formationName: formation.name },
             }} 
             asChild
             style={[styles.box, { backgroundColor: backgroundColors[index % backgroundColors.length] } ]}
           >
              <TouchableOpacity
                //onPress={() => {router.push(`/Enregistrement/`)}}
               
                // style={[
                //   styles.box,
                //   { backgroundColor: backgroundColors[index % backgroundColors.length] }
                // ]}
              >
                <Text style={[styles.boxText, { color: COLORS.black, fontSize: 17, fontWeight: "bold" }]}>{formation.name}</Text>
                <Text style={styles.boxText}>Prix: {formation.price} Frs</Text>
                <Text style={styles.boxText}>Adresse: {formation.address}</Text>
                <Text style={styles.boxText}>Total encaissé: {formation.total_collected}</Text>
              </TouchableOpacity>
              </Link>
          ))}
        </View>
      </ScrollView>
      <FloatingAddButton />
      <View>
        <Text style={{ textAlign: 'center', color: COLORS.gray30 }}>version 1.0.0,  @aic Sarl</Text>
        <Text style={{ textAlign: 'center', color: COLORS.gray30 }}>RCCM :CM-DLA-01-2024-B12-00217</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  areaStyle: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Add some padding at the bottom
  },
  center: {
    alignItems: 'center',
    padding: 16,
  },
  subTitle: {
    marginVertical: 22,
    top: 15,
  },
  box: {
    width: 350,
    paddingVertical: 18,
    marginVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  boxText: {
    textAlign: 'center',
    color: COLORS.black,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    width: 300,
    paddingVertical: SIZES.padding * 2,
    borderRadius: 12,
  },
  btnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Home;



