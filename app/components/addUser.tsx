import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator, // Pour afficher des alertes
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { router, Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios'; // Assurez-vous d'avoir installé axios pour l'API POST
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddUser = () => {

const [lastname, setLastname] = useState('');
const [firstname, setFirstname] = useState('');
const [gender, setGender] = useState('');
const [address, setAddress] = useState('');
const [grade, setGrade] = useState('');
const [phone, setPhone] = useState('');
const [formation_id, setFormationId] = useState('');
const [paid_amount, setPaidAmount] = useState('');
const [loading, setLoading] = useState(false); 
const [showPaymentForm, setShowPaymentForm] = useState(false);  // État pour afficher les champs de paiement
const [formations, setFormations] = useState([]);  // Stocke les formations récupérées
const [errorMessage, setErrorMessage] = useState(''); // Pour gérer les erreurs de validation


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

 // Afficher le formulaire de paiement lorsqu'on clique sur "Ajouter paiement"
 const handleShowPaymentForm = () => {
  setShowPaymentForm(true);
}; 

const handleSubmit = async () => {
  // Validation des champs obligatoires
  if (!lastname || !firstname || !gender || !address || !grade) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
    return;
  }

  const userData = {
    lastname,
    firstname,
    gender,
    address,
    grade,
    phone,
    // Ajoutez formation_id et paid_amount seulement s'ils sont renseignés
    ...(formation_id && { formation_id: parseInt(formation_id) }),
    ...(paid_amount && { paid_amount: parseFloat(paid_amount) })
  };

  console.log('Données à envoyer:', userData);

  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter un étudiant.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post('https://students.aic.cm/api/v1/students', userData, config);
    
    if (response.status === 200) {
      Alert.alert('Succès', 'Étudiant enregistré avec succès.');
      router.push('/Enregistrement');
    } else {
      Alert.alert('Erreur', `Une erreur est survenue lors de l'enregistrement. Statut: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur détaillée:', error);
    if (error.response) {
      Alert.alert('Erreur', `Impossible d'enregistrer l'étudiant. Statut: ${error.response.status}, Message: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      Alert.alert('Erreur', 'Aucune réponse reçue du serveur. Vérifiez votre connexion Internet.');
    } else {
      Alert.alert('Erreur', `Erreur lors de la configuration de la requête: ${error.message}`);
    }
  } finally {
    setLoading(false);
  }
};

const genderOptions = [
  { label: 'Homme', value: 'MALE' },
  { label: 'Femme', value: 'FEMALE' },
];

useEffect(() => {
  fetchFormations();
}, []);

const validatePaidAmount = (value) => {
  const numericValue = parseFloat(value); 
  setPaidAmount(value);

  if (numericValue < 1000 || numericValue > 12500) {
    setErrorMessage('Le montant doit être entre 1000 et 12500 FCFA.');
  } else {
    setErrorMessage(''); 
};
}
  return (
    <SafeAreaView style={styles.containerTT}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { marginTop: 44 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle enregistrement</Text>
      </View>

      <ScrollView style={{ backgroundColor: COLORS.white }}>
        <View style={styles.imageContainer}>
          <Ionicons name="receipt-outline" size={100} color={COLORS.primary} />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.textinputs}>
          {/* <Text style={styles.label}>Votre Nom</Text> */}
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={lastname}
              onChangeText={setLastname}
            />
          </View>

          <View style={styles.textinputs}>
          {/* <Text style={styles.label}>Votre Prenom</Text> */}
            
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={firstname}
            onChangeText={setFirstname}
          />
          </View>
          <View style={styles.textinputs}>
          {/* <Text style={styles.label}>Votre Prenom</Text> */}
            
          <TextInput
            style={styles.input}
            placeholder="Numero telephone"
            value={phone}
            onChangeText={setPhone}
            keyboardType='numeric'
          />
          </View>

          <View style={styles.dropdownContainer}>
            {/* <Text style={styles.label}>Sexe</Text> */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={genderOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Sélectionner Genre"
              value={gender}
              onChange={(item) => {
                setGender(item.value);
              }}
            />
          </View>

          <View style={styles.textinputs}>
          {/* <Text style={styles.label}>Adresse de residence</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={address}
            onChangeText={setAddress}
          />
          </View>

          <View style={styles.textinputs}>
          {/* <Text style={styles.label}>Dernier Diplome</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Niveau d'étude"
            value={grade}
            onChangeText={setGrade}
          />
          </View>

        {/* Bouton pour afficher les champs de paiement */}
        <View style={styles.statutContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={handleShowPaymentForm} >
              <Text style={styles.checkboxLabel}>Ajouter paiement</Text>
            </TouchableOpacity>
          </View>

          {showPaymentForm && (
      <>
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
            value={formation_id}
            onChange={(item) => {
              setFormationId(item.value);
            }}
          />
        </View>
        <View style={styles.textinputs}>
          <TextInput
            style={styles.input}
            placeholder="Montant payé"
            value={paid_amount}
            onChangeText={validatePaidAmount} 
            keyboardType="numeric"
          />
        </View>
      </>
    )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerTT: {
    backgroundColor: 'white',
    flex: 1,
  },
  inputContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.gray10,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    color: 'gray',
  },
  statutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statutLabel: {
    marginRight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkbox: {
    // marginRight: 5,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: COLORS.primary2
  },
  checkboxInner: {
    color: COLORS.primary,
  },
  checkboxLabel: {
   // fontSize: 16,
    padding: 8
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textinputs: {
    padding: 1,
  },
  label: {
    margin: 4
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: COLORS.gray10,
    borderRadius: 10,
    padding: 10,
  },
  placeholderStyle: {
    color: 'gray',
  },
  selectedTextStyle: {
    color: 'black',
  },
});

export default AddUser;
