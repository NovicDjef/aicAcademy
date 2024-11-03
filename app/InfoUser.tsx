import { View, StyleSheet, TouchableOpacity, Text, FlatList, Modal, Alert, ActivityIndicator, TextInput, RefreshControl, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';

const dataCategories = [
  { id: 0, name: 'Informations' },
  { id: 1, name: 'Paiement' },
];
// const API_URL = 'https://students.aic.cm/api/v1/formations';
export default function Index() {

  const { studentData } = useLocalSearchParams(); 
  const studentDetails = typeof studentData === 'string' ? JSON.parse(studentData) : studentData;
  const formationId = studentDetails.formation_id;
  const studentId = studentDetails.student.id;
//  console.debug("studentDetails :", formationId)
  const [selectedCategory, setSelectedCategory] = useState(0); 
  const [filteredItems, setFilteredItems] = useState([]);
  const [students, setStudents] = useState(null);  
  const [loading, setLoading] = useState(false); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [payments, setPayments] = useState([]); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formations, setFormations] = useState([]); 
  const [selectedFormation, setSelectedFormation] = useState(null); 
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [price, setPrice] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [grade, setGrade] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('')
  const [school_name, setSchool_name] = useState('')
  const [activity_branch, setActivity_branch] = useState('');
  const [school_speciality, setSchool_speciality] = useState('');
  const [company, setCompany] = useState('')
  const [company_role, setCompany_role] = useState('');
  const [experience_years, setExperience_years] = useState('')
  const [refreshing, setRefreshing] = useState(false); // Pour le refresh
  // console.debug("studentDetails :", studentId) 
  // 
  useEffect(() => {
    if (studentDetails?.student) {
      setLastname(studentDetails.student.lastname || '');
      setFirstname(studentDetails.student.firstname || '');
      setGender(studentDetails.student.gender_tr || '');
      setAddress(studentDetails.student.address || '');
      setGrade(studentDetails.student.grade || '');
      setPaymentStatus(studentDetails.student.payment_status_tr || '');
      setPaidAmount(studentDetails.student.paid_amount_tr || '');
      setPrice(studentDetails.student.price || '');

      setType(studentDetails.student.type || '');
      setSchool_name(studentDetails.student.school_name || '');
      setActivity_branch(studentDetails.student.activity_branch || '');
      setSchool_speciality(studentDetails.student.school_speciality || '');
      setCompany(studentDetails.student.company || '');
      setCompany_role(studentDetails.student.company_role || '');
      setExperience_years(studentDetails.student.experience_years || '');
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true); // Activer l'animation de rafraîchissement
    try {
      // Récupérer à nouveau les étudiants et les formations
      await fetchPayments();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setRefreshing(false); // Désactiver l'animation de rafraîchissement
    }
  };

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
  
      const response = await axios.get('https://students.aic.cm/api/v1/formations', config);
  
      if (response.status === 200 && response.data && response.data.data) {
        const formationsData = response.data.data;
  
        if (Array.isArray(formationsData)) {
          const formattedFormations = formationsData.map(formation => ({
            label: formation.name + "   " + "  " + formation.price + " Frs"  || 'Nom inconnu',
            value: (formation.id || '').toString()
          }));
          setFormations(formattedFormations);
        } else {
          Alert.alert('Erreur', 'Le format des données de formations est invalide.');
        }
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer les formations. Format de réponse inattendu.');
      }
    } catch (error) {
      Alert.alert('Erreur', `Une erreur est survenue lors de la récupération des formations: ${error.message}`);
    }
  };

  const handleAddPayment = async () => {
    try {
      // Récupération du token d'accès
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token manquant');
      }
  
      // Configuration de l'authentification
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      setLoading(true);
      const response = await axios.post(
        `https://students.aic.cm/api/v1/students/${studentId}/payments`,
        {
          formation_id: formationId,  // Assurez-vous que selectedFormation.value contient bien l'ID de la formation
          paid_amount: parseFloat(paidAmount),    // Convertit le montant payé en nombre
        },
        config
      );
  
      console.debug("Réponse de l'API :", response.data); // Debug pour afficher la réponse API
  
      return response.data;
  
    } catch (error) {
      // Gestion de l'erreur pour aider au débogage
      if (error.response) {
        console.error('Erreur de l\'API :', error.response.data);
      } else {
        console.error('Erreur réseau ou autre :', error.message);
      }
  
      throw error;
    } finally{
      setLoading(false);
    }
  };
  
  // Fonction de validation du paiement avant de l'envoyer à l'API
  const handleValidatePayment = async () => {
    // Vérification que l'étudiant sélectionné est valide
    if (!studentId) {
      Alert.alert('Erreur', 'Aucun étudiant sélectionné. Veuillez sélectionner un étudiant.');
      return;
    }
  
    // Vérification que la formation est sélectionnée
    if (!selectedFormation) {
      Alert.alert('Erreur', 'Veuillez sélectionner une formation.');
      return;
    }
  
    // Vérification de la validité du montant payé
    if (!paidAmount || isNaN(parseFloat(paidAmount))) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
      return;
    }
  
    try {
      // Appel de la fonction pour ajouter le paiement
      await handleAddPayment();
      Alert.alert('Succès', 'Paiement ajouté avec succès.');
      closeModal();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du paiement.');
    }
  };


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
  };

  const handleDeleteStudent = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`https://students.aic.cm/api/v1/students/${studentId}`, config);
      Alert.alert('Succès', 'Étudiant supprimé avec succès.');
      setStudents(students.data.filter(student => student.id !== studentId)); // Retirer de la liste locale
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
        type,
      };
      await axios.put(`https://students.aic.cm/api/v1/students/${studentId}`, updatedStudent, config);
      Alert.alert('Succès', `Étudiant modifié avec succès.`);
      setStudents(students.data.map(student => student.id === studentId ? { ...student, ...updatedStudent } : student));
      closeBottomSheet();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification.');
    }
  };


    const filterItems = () => {
      if (selectedCategory === 0) {
        setFilteredItems(payments);
      } else if (selectedCategory === 1) {
        setFilteredItems(payments);
      }
    };
  
    useEffect(() => {
      filterItems();
    }, [selectedCategory, payments]);
  

    useEffect(() => {
      fetchFormations();
    }, []);
  const fetchPayments = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté pour récupérer les paiements.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const paymentResponse = await axios.get(`https://students.aic.cm/api/v1/students/${studentId}/payments`, config);

      // Extraire uniquement le tableau de paiements
      setPayments(paymentResponse.data.data || []);
    } catch (error) {
      console.error("Erreur de chargement des paiements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

 
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
              paddingHorizontal: 14,
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

  const renderPayments = () => (
    <FlatList
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
      data={payments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={[styles.paymentItem, { flexDirection: 'column', padding: 8, marginHorizontal: 8, borderBottomWidth: 1, borderColor: '#ccc' }]}>
          <Text style={{ fontWeight: 'bold' }}>Détails de paiement</Text>
          <Text style={styles.paymentLabel}>Montant : {item.amount_tr || `${item.amount} FCFA`}</Text>
          <Text style={styles.paymentLabel}>Date : {new Date(item.created_at).toLocaleDateString()}</Text>
          <Text style={styles.paymentLabel}>Status :<Text style={{ fontWeight: 'bold', color: item.deleted_at ? 'red' : 'green' }}> {item.deleted_at ? 'Annulé' : 'Actif'}</Text> </Text>
        </View>
      )}
      // Composant pour affichage quand la liste est vide
      ListEmptyComponent={() => (
        <View style={{ padding: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: 'grey' }}>Aucun paiement</Text>
        </View>
      )}
    />
  );
  

  const renderStudentInfo = () => {
    return (
      <>
        <View style={styles.bottomSheetContainer}>
     <Text style={styles.sheetTitle}>Détails de l'étudiant</Text>
 
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
             label="Niveau d'étude"
             value={grade}
             onChangeText={setGrade}
             placeholder="Classe"
           />
          <EditableInfoItem
             icon="male-female-outline"
             label="type personne"
             value={type}
             onChangeText={setType}
             placeholder="type"
           />
          
       </>
     ) : (
       <>        
        <ScrollView>
           <InfoItem icon="accessibility-outline" label="Nom Etudiant" value={studentDetails.student.lastname} />
           <InfoItem icon="person-outline" label="Prénom Etudiant" value={studentDetails.student.firstname} />
           <InfoItem icon="male-female-outline" label="Sexe Etudiant" value={studentDetails.student.gender_tr} />
           <InfoItem icon="location-outline" label="Adresse Etudiant" value={studentDetails.student.address} />
           <InfoItem icon="school-outline" label="Niveau d'étude" value={studentDetails.student.grade} />

           <InfoItem icon="male-female-outline" label="Sexe Etudiant" value={studentDetails.student.type} />

        </ScrollView>
       </>
     )}
     <View style={styles.buttonContainer}>
       <TouchableOpacity style={styles.buttonDelete} onPress={handleDeleteStudent}>
         <Text style={styles.buttonText}>Supprimer</Text>
       </TouchableOpacity>
 
       {!isEditing && (
         <TouchableOpacity style={styles.button} onPress={openModal}>
           <Text style={styles.buttonText}>Ajouter un paiement</Text>
         </TouchableOpacity>
       )}
 
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
      </>
     );
  }
  function renderItems() {
    if (loading) {
      return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;
    }
  
    return selectedCategory === 0 ? renderStudentInfo() : renderPayments();
  }


  return (
   <>
     <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginTop: 64, marginBottom: 10, backgroundColor: COLORS.white }}>
        <View style={styles.backButton}>
          <Ionicons name='arrow-back-outline' size={24} color={COLORS.primary} onPress={() => router.back()} />
        </View>
          <Text style={[styles.header, { top: -8 }]}>
          {lastname} {firstname}
          </Text>
    
      </View>
      <View style={{ marginTop: -10, backgroundColor: COLORS.white }}>
        {renderMenu()}
      </View>
      <View style={styles.listContainer}>
        {renderItems()}
      </View>

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
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={formations}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Sélectionnez une formation"
          value={selectedFormation}
          onChange={(item) => {
            setSelectedFormation(item.value);
          }}
        />
      </View>

      <Text style={styles.label}>Montant payé :</Text>
      <TextInput
        style={styles.input}
        value={paidAmount.toString()}
        onChangeText={setPaidAmount} 
        placeholder="Entrez le Montant que vous souahitez payé"
        keyboardType="numeric" 
      />


      <View style={styles.modalButtonsContainer}>
        <TouchableOpacity style={styles.buttonCancel} onPress={closeModal}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
         
        <TouchableOpacity style={styles.button} onPress={handleValidatePayment}>
          <Text style={styles.buttonText}>{loading ? <ActivityIndicator size="small" color="#fff" />  : "Valider "} </Text>
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
    width: '77%', // Prendre toute la largeur disponible
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
    color: COLORS.black,
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

    selectedTextStyle: {
      color: 'black',
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

