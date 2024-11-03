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
const [type, setType] = useState('')
const [school_name, setSchool_name] = useState('')
const [activity_branch, setActivity_branch] = useState('');
const [school_speciality, setSchool_speciality] = useState('');
const [company, setCompany] = useState('')
const [company_role, setCompany_role] = useState('');
const [experience_years, setExperience_years] = useState('')
const [selectedFormation, setSelectedFormation] = useState(null); 
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

const prepareFormData = (data) => {
  // Remplace les valeurs vides par null, et exclut les clés ayant null comme valeur
  return Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => [key, value === "" ? null : value])
      .filter(([_, value]) => value !== null) // Exclut les champs null
  );
}; 

// const replaceEmptyWithNull = (data) => {
//   return Object.fromEntries(
//     Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
//   );
// };
const handleSubmit = async () => {
  // Validation des champs obligatoires
  if (!lastname || !firstname || !gender || !address || !grade) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
    return;
  }

  // Validation du numéro de téléphone : doit contenir exactement 9 chiffres
  if (!/^\d{9}$/.test(phone)) {
    Alert.alert('Erreur', 'Le numéro de téléphone doit contenir exactement 9 chiffres.');
    return;
  }

  // Validation du montant payé : doit être entre 1000 et 12500 FCFA
  if (paid_amount && (paid_amount < 1000 || paid_amount > 125000)) {
    Alert.alert('Erreur', 'Le montant payé doit être compris entre 1000 FCFA et 12500 FCFA veyez saisir un montant correct SVP.');
    return;
  }

  let userData = {
    lastname,
    firstname,
    gender,
    address,
    grade,
    phone,
    school_name,
    type,
    activity_branch,
    school_speciality,
    company,
    company_role,
    experience_years,
    // Ajoutez formation_id et paid_amount seulement s'ils sont renseignés
    ...(formation_id && { formation_id: parseInt(formation_id) }),
    ...(paid_amount && { paid_amount: parseFloat(paid_amount) })
  };

  // userData = replaceEmptyWithNull(userData);
  userData = prepareFormData(userData);

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
    console.debug('Reponse:', response.data);
    if (response.status === 200) {
      Alert.alert('Succès', 'Étudiant enregistré avec succès.');
      router.push('/Enregistrement');
    } else {
      Alert.alert('Erreur', `Une erreur est survenue lors de l'enregistrement. Statut: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur détaillée:', error);
    if (error.response) {
      Alert.alert('Erreur', ` ${JSON.stringify(error.response.data.error)} `);
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
const typeOption = [
  {label: 'STUDENT', value: 'STUDENT'},
  {label: 'PROFESSIONAL', value: 'PROFESSIONAL'},
  {label: 'SANS EMPLOIE', value: 'UNEMPLOYEE'}
]

useEffect(() => {
  fetchFormations();
}, []);


const validatePhoneNumber = (value) => {
  const phoneNumber = value.replace(/\D/g, ''); 
  setPhone(phoneNumber); 

  if (phoneNumber.length !== 9) {
    setErrorMessage('Le numéro de téléphone doit contenir exactement 9 chiffres.');
  } else {
    setErrorMessage(''); 
  }
};

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
          <Ionicons name="receipt-outline" size={80} color={COLORS.primary} />
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
            onChangeText={validatePhoneNumber}
            keyboardType='numeric'
          />
           {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
          <View style={styles.dropdownContainer}>
            {/* <Text style={styles.label}>Sexe</Text> */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={typeOption}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Sélectionner le type"
              value={type}
              onChange={(item) => {
                setType(item.value);
              }}
            />
          </View>
         
          {type === 'STUDENT' && (
        <>
          <View style={styles.textinputs}>
            <TextInput
              style={styles.input}
              placeholder="Nom de votre école"
              value={school_name}
              onChangeText={setSchool_name}
            />
          </View>
          <View style={styles.textinputs}>
            <TextInput
              style={styles.input}
              placeholder="Votre spécialité"
              value={school_speciality}
              onChangeText={setSchool_speciality}
            />
          </View>
        </>
      )}

      {/* Champs pour PROFESSIONAL */}
      {type === 'PROFESSIONAL' && (
        <>
          <View style={styles.textinputs}>
            <TextInput
              style={styles.input}
              placeholder="Nom de l'entreprise"
              value={company}
              onChangeText={setCompany}
            />
          </View>
          <View style={styles.textinputs}>
            <TextInput
              style={styles.input}
              placeholder="Nombre d'années d'expérience"
              value={experience_years}
              onChangeText={setExperience_years}
            />
          </View>
          <View style={styles.textinputs}>
            <TextInput
              style={styles.input}
              placeholder="Rôle dans l'entreprise"
              value={company_role}
              onChangeText={setCompany_role}
            />
          </View>
        </>
      )}

      {/* Champs pour UNEMPLOYEE */}
      {type === 'UNEMPLOYEE' && (
        <View style={styles.textinputs}>
          <TextInput
            style={styles.input}
            placeholder="Secteur d'activité"
            value={activity_branch}
            onChangeText={setActivity_branch}
          />
        </View>
      )}
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
            onChangeText={setPaidAmount} 
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
  errorText: {
    fontSize: 12,
    color: "red"
  }
});

export default AddUser;
