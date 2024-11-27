import { View, StyleSheet, TouchableOpacity, Text, FlatList, Modal, Alert, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { BottomSheet } from '@rneui/themed';
import FloatingAddButton from './components/FloatingAddButton';

const dataCategories = [
  { id: 0, name: 'Tous' },
  { id: 1, name: 'Non payé' },
  { id: 2, name: 'Partiellement payé' },
  { id: 3, name: 'Payé' },
];
const API_URL = 'https://students.aic.cm/api/v1/formations';
export default function Index() {
  const { formationId, formationName } = useLocalSearchParams(); 

  const [selectedCategory, setSelectedCategory] = useState(0); 
  const [filteredItems, setFilteredItems] = useState([]);
  const [students, setStudents] = useState([]);  
  const [loading, setLoading] = useState(false); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [paidAmount, setPaidAmount] = useState(''); 
  const [payments, setPayments] = useState([]); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formations, setFormations] = useState([]); 
  const [selectedFormation, setSelectedFormation] = useState(null); 
  const [refreshing, setRefreshing] = useState(false); // Pour le refresh

    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [grade, setGrade] = useState('');
    const [phone, setPhone] = useState('');
  
    const onRefresh = async () => {
      setRefreshing(true); // Activer l'animation de rafraîchissement
      try {
        // Récupérer à nouveau les étudiants et les formations
        await fetchStudents();
      } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error);
      } finally {
        setRefreshing(false); // Désactiver l'animation de rafraîchissement
      }
    };
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

  const handleAddPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      const response = await axios.post(
        `https://students.aic.cm/api/v1/students/${selectedStudent.id}/payments`,
        {
          formation_id: selectedFormation.value,
          paid_amount: parseFloat(paidAmount),
        },
        config
      );
  
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du paiement:', error);
      throw error;
    }
  };

  const handleValidatePayment = async () => {
    if (!selectedFormation) {
      Alert.alert('Erreur', 'Veuillez sélectionner une formation.');
      return;
    }
  
    if (!paidAmount || isNaN(parseFloat(paidAmount))) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
      return;
    }
  
    try {
      await handleAddPayment();
      Alert.alert('Succès', 'Paiement ajouté avec succès.');
      closeModal();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du paiement.');
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setPaidAmount('');
  };

  const fetchStudents = async () => {
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
   setLoading(true);
      // Utilisez formationId pour récupérer les étudiants de la formation spécifique
      const API_URL = `https://students.aic.cm/api/v1/students?formation_id=${formationId}`;

      const response = await axios.get(API_URL, config);
  
      if (response.status === 200 && response.data && response.data.data) {
        const studentsData = response.data.data;
        setStudents(studentsData);
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer les étudiants. Format de réponse inattendu.');
      }
    } catch (error) {
      Alert.alert('Erreur', `Une erreur est survenue lors de la récupération des étudiants: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchStudents();
  }, []);
  

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
      };
      await axios.put(`https://students.aic.cm/api/v1/students/${selectedStudent.id}`, updatedStudent, config);
      Alert.alert('Succès', `Étudiant modifié avec succès.`);
      setStudents(students.map(student => student.id === selectedStudent.id ? { ...student, ...updatedStudent } : student));
      closeBottomSheet();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification.');
    }
  };



// Filtrer les étudiants par formation
// const filteredItems = students.data.filter(item => item.formation_id === formationId);
const filterItems = () => {
  if (selectedCategory === 0) {
    // Tous les étudiants
    setFilteredItems(students.data);
  } else {
    // Mapper les catégories avec les statuts
    const statusMap = {
      1: null,
      2: 'PARTIALLY_PAID',
      3: 'PAID',
    };
    const selectedStatus = statusMap[selectedCategory];

    // Filtrer les étudiants selon le statut
    const filteredData = students.data?.filter(item =>
      selectedStatus === null
        ? item.payment_status === null
        : item.payment_status === selectedStatus
    );

    setFilteredItems(filteredData);
  }
};

useEffect(() => {
  filterItems();
}, [selectedCategory, students]);


  // const fetchPayments = async (studentId) => {
  //   try {
  //     const token = await AsyncStorage.getItem('access_token');
  //     const config = {
  //       headers: { Authorization: `Bearer ${token}` }
  //     };
  //     const response = await axios.get(`https://students.aic.cm/api/v1/students/${studentId}/payments`, config);
  //     setPayments(response.data); // Mettre à jour la liste des paiements
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des paiements:', error);
  //   }
  // };
  
  const renderMenu = () => (
    <View style={{ alignItems: 'center' }}>
      <FlatList
        data={dataCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 8,
              paddingHorizontal: 16,
              backgroundColor: selectedCategory === item.id ? 'blue' : COLORS.gray20,
              borderRadius: 20,
              alignItems: 'center',
              marginHorizontal: 4,
            }}
            onPress={() => setSelectedCategory(item.id)} // Mettre à jour la catégorie sélectionnée
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: selectedCategory === item.id ? 'white' : 'black' }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
  
  
  // Fonction principale de rendu
function renderItems() {
  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;
  }

  if (students.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Aucun étudiant trouvé</Text>;
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString); 
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} à ${hours}:${minutes}`;
  };

  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: "/InfoUser",
              params: { studentData: JSON.stringify(item) }
            })}
          >
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemName}>{`${item.student.lastname} ${item.student.firstname}`}</Text>
                <Text style={styles.itemSubText}>{item.student.grade}</Text>
                <Text style={styles.itemSubTextSemiBold}>{`${item.student.gender_tr} | ${item.student.address}`}</Text>
                {item.paid_amount && <Text style={styles.itemAmount}>{`${item.paid_amount} FCFA`}</Text>}
                <Text>{formatDateTime(item.created_at)}</Text>
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
    </>
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
      <View style={{ flexDirection: 'row', marginTop: 64, marginBottom: 10, backgroundColor: COLORS.white }}>
        <View style={styles.backButton}>
          <Ionicons name='arrow-back-outline' size={24} color={COLORS.primary} onPress={() => router.back()} />
        </View>
          <Text style={[styles.header, { top: -8 }]}>
            {formationName || "Nom non disponible"}
          </Text>
        
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
    <Text style={styles.sheetTitle}>Détails du candidat</Text>

    {/* Si l'utilisateur est en mode édition, afficher les champs de modification */}
    {isEditing ? (
      <>
        <EditableInfoItem
          icon="accessibility-outline"
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
        {/* Si non en édition, afficher les détails */}
        
        <InfoItem icon="accessibility-outline" label="Nom Etudiant" value={lastname} />
        <InfoItem icon="person-outline" label="Prenom Etudiant" value={firstname} />
        <InfoItem icon="male-female-outline" label="Sexe Etudiant" value={gender} />
        <InfoItem icon="location-outline" label="Adresse Etudiant" value={address} />
        <InfoItem icon="school-outline" label="Niveau d'etude" value={grade} />

      </>
    )}

    <View style={styles.buttonContainer}>
      {/* Bouton pour supprimer l'étudiant */}
      <TouchableOpacity style={styles.buttonDelete} onPress={handleDeleteStudent}>
        <Text style={styles.buttonText}>Supprimer</Text>
      </TouchableOpacity>

      {/* Afficher le bouton "Ajouter un paiement" uniquement si on n'est pas en mode édition */}
      {!isEditing && (
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Text style={styles.buttonText}>Ajouter un paiement</Text>
        </TouchableOpacity>
      )}

      {/* Bouton pour activer le mode édition ou annuler l'édition */}
      <TouchableOpacity style={styles.button} onPress={() => setIsEditing(!isEditing)}>
        <Text style={styles.buttonText}>{isEditing ? 'Annuler' : 'Modifier'}</Text>
      </TouchableOpacity>

      {/* Bouton pour enregistrer les modifications */}
      {isEditing && (
        <TouchableOpacity style={styles.button} onPress={handleUpdateStudent}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
</BottomSheet>



    </View>
    <Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={closeModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Ajouter un paiement</Text>

      {/* Sélection de la formation */}
      <Text style={styles.label}>Sélectionnez une formation :</Text>

      <View style={styles.dropdownContainer}>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdownMenuContainer}
          placeholderStyle={styles.placeholderStyle}
          data={formations}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Sélectionnez une formation"
          value={selectedFormation} // Utiliser selectedFormation ici
          onChange={(item) => {
            setSelectedFormation(item); // Mettre à jour selectedFormation avec l'objet sélectionné
          }}
        />
      </View>

      {/* Entrée du montant payé */}
      <Text style={styles.label}>Montant payé :</Text>
      <TextInput
        style={styles.input}
        value={paidAmount}
        onChangeText={setPaidAmount}
        placeholder="Montant payé"
        keyboardType="numeric"
      />

      <View style={styles.modalButtonsContainer}>
        <TouchableOpacity style={styles.buttonCancel} onPress={closeModal}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
         
        <TouchableOpacity style={styles.button} onPress={handleValidatePayment}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
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
      <Text style={styles.infoLabele}>{label}</Text>
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

  dropdownContainer: {
    width: '100%', // Le Dropdown occupe 100% de la largeur du modal
    marginBottom: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%', // Prendre toute la largeur disponible
    backgroundColor: '#f9f9f9',
  },
  dropdownMenuContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    width: '80%', // Prendre toute la largeur disponible
  },
  placeholderStyle: {
    color: 'gray',
  },

  errorText: {
    fontSize: 12,
    color: "red"
  },


  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + 80,
    borderRadius: 25,
    top: -16,
    marginHorizontal: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: COLORS.lightGray,
  },
  editableInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -14,

    paddingBottom: 8,
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
    padding: 6 
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
    textAlign: 'center',
     color: 'white', 
     fontWeight: 'bold' 
    },




    infoContainer: {
      marginBottom: 20,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
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
    infoLabele: {
      fontSize: 14,
      color: COLORS.gray60,
      marginBottom: -8,
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

    addPaymentContainer: {
      marginBottom: 16,
    },
    paymentTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    paymentListContainer: {
      marginTop: 16,
    },
    paymentItem: {
      padding: 12,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      marginBottom: 8,
    },


    containerrr: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
   
   
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: '100%',
    },
    modalContent: {
      width: '90%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    buttonCancel: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 8,
      marginLeft: 10,
      alignItems: 'center',
    },
});

