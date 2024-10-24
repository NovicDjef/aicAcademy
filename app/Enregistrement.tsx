import { View, StyleSheet, TouchableOpacity, Text, FlatList, Alert, ActivityIndicator, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BottomSheet } from '@rneui/themed';
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
  const [selectedStudent, setSelectedStudent] = useState(null); // Étudiant sélectionné
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Pour le mode modification


    // Champs de modification
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [grade, setGrade] = useState('');
    const [phone, setPhone] = useState('');
  
 

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
  
  const openBottomSheet = (student) => {
    setSelectedStudent(student);
    setLastname(student.lastname);
    setFirstname(student.firstname);
    setGender(student.gender);
    setAddress(student.address);
    setGrade(student.grade);
    setPhone(student.phone);
    setIsBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setSelectedStudent(null);
    setIsBottomSheetVisible(false);
  };

  const handleDeleteStudent = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`https://students.aic.cm/api/v1/students/${selectedStudent.id}`, config);
      Alert.alert('Succès', 'Étudiant supprimé avec succès.');
      setStudents(students.filter(student => student.id !== selectedStudent.id)); // Retirer de la liste locale
      closeBottomSheet();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression.');
    }
  };

  const handleUpdateStudent = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const updatedStudent = {
        lastname,
        firstname,
        gender,
        address,
        grade,
        phone,
      };
      await axios.put(`https://students.aic.cm/api/v1/students/${selectedStudent.id}`, updatedStudent, config);
      Alert.alert('Succès', 'Étudiant modifié avec succès.');
      setStudents(students.map(student => student.id === selectedStudent.id ? { ...student, ...updatedStudent } : student));
      closeBottomSheet();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification.');
    }
  };

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
                  borderRadius: 20,
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
          <TouchableOpacity onPress={() => openBottomSheet(item)}>
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
          </TouchableOpacity>
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

        <BottomSheet isVisible={isBottomSheetVisible} onBackdropPress={closeBottomSheet}>
          <View style={styles.bottomSheetContainer}>
            <Text style={styles.sheetTitle}>Détails de l'étudiant</Text>
            {/* <View
              style={[
                styles.statusContainer,
               { backgroundColor: getStatusColor(selectedStudent.payment_status) || null }, 
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                 { color: getStatusTextColor(selectedStudent.payment_status) || null }, // Utiliser la couleur appropriée
                ]}  
              >
                {selectedStudent.payment_status_tr || 'Non payé'}
              </Text>
            </View> */}

            {isEditing ? (
               <>
               <EditableInfoItem
                 icon="person-outline"
                 label="Nom Etudiant"
                 value={lastname}
                 onChangeText={setLastname}
                 placeholder="Nom"
               />
               <EditableInfoItem
                 icon="person-outline"
                 label="Prénom Etudiant"
                 value={firstname}
                 onChangeText={setFirstname}
                 placeholder="Prénom"
               />
               <EditableInfoItem
                 icon="male-female-outline"
                 label="Sexe Etudiant"
                 value={gender}
                 onChangeText={setGender}
                 placeholder="Genre"
               />
               <EditableInfoItem
                 icon="location-outline"
                 label="Adresse Etudiant"
                 value={address}
                 onChangeText={setAddress}
                 placeholder="Adresse"
               />
               <EditableInfoItem
                 icon="school-outline"
                 label="Niveau d'etude"
                 value={grade}
                 onChangeText={setGrade}
                 placeholder="Classe"
               />
             </>
            ) : (
              <>
                <InfoItem icon="accessibility-outline" label="Nom Etudiant" value={lastname} />
                <InfoItem icon="person-outline" label="Prenom Etudiant" value={firstname} />
                <InfoItem icon="male-female-outline" label="Sexe Etudiant" value={gender} />
                <InfoItem icon="location-outline" label="Adresse Etudiant" value={address} />
                <InfoItem icon="school-outline" label="Niveau d'etude" value={grade} />
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonDelete} onPress={handleDeleteStudent}>
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setIsEditing(!isEditing)}>
                <Text style={styles.buttonText}>{isEditing ? 'Annuler' : 'Modifier'}</Text>
              </TouchableOpacity>
              {isEditing && (
                <TouchableOpacity style={styles.button} onPress={handleUpdateStudent}>
                  <Text style={styles.buttonText}>Enregistrer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BottomSheet>
    </View>
   </>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={24} color={COLORS.primary} style={styles.infoIcon} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const EditableInfoItem = ({ icon, label, value, onChangeText, placeholder }) => (
  <View style={styles.editableInfoItem}>
    <Ionicons name={icon} size={24} color={COLORS.primary} style={styles.infoIcon} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  </View>
);

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
  editableInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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

  bottomSheetContainer: { 
    padding: 16, 
    backgroundColor: "white",
    borderTopEndRadius: 16, 
    borderTopStartRadius: 16
  },
  sheetTitle: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  input: {
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    marginBottom: 12, 
    padding: 8 
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16 
  },
  button: { 
    backgroundColor: COLORS.primary, 
    padding: 10, 
    borderRadius: 8 
  },
  buttonDelete: { 
    backgroundColor: COLORS.secondary, 
    padding: 10, 
    borderRadius: 8 
  },
  buttonText: {
     color: 'white', 
     fontWeight: 'bold' 
    },




    infoContainer: {
      marginBottom: 20,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      paddingBottom: 8,
    },
    infoIcon: {
      marginRight: 12,
    },
    infoTextContainer: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      color: '#666',
    },
    infoValue: {
      fontSize: 16,
      color: '#333',
      fontWeight: '500',
    },
    confirmButton: {
      backgroundColor: COLORS.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      //top: -40,
    },
    confirmButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    lottieContainer: {
      alignItems: 'center',
    },
    lottie: {
      width: 150,
      height: 150,
    },
    successText: {
      marginTop: 14,
      fontSize: 18,
      color: COLORS.primary,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    inputIcon: { 
      paddingHorizontal: 8, 
    }, 
    inputView: { 
      height: 50, 
      borderRadius: 10, 
      backgroundColor: '#f1f3f6', 
      marginTop: 10, 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
    }, 
});

