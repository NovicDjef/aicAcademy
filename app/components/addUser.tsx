import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert, // Pour afficher des alertes
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { router, Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios'; // Assurez-vous d'avoir installé axios pour l'API POST

const AddUser = () => {


const [lastname, setLastname] = useState('');
const [firstname, setFirstname] = useState('');
const [gender, setGender] = useState('');
const [address, setAddress] = useState('');
const [grade, setGrade] = useState('');
const [formation_id, setFormationId] = useState('');
const [paid_amount, setPaidAmount] = useState('');


const handleSubmit = async () => {
  if (!lastname || !firstname || !gender || !address || !grade || !formation_id || !paid_amount) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
    return;
  }

  const userData = {
    lastname,
    firstname,
    gender,
    address,
    grade,
    formation_id: parseInt(formation_id),
    paid_amount: parseFloat(paid_amount)
  };

  try {
    const response = await axios.post('https://students.aic.cm/api/v1/students', userData);
    if (response.status === 201) {
      Alert.alert('Succès', 'Étudiant enregistré avec succès.');
      router.push('/Enregistrement');
    } else {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement.');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Erreur', 'Impossible d\'enregistrer l\'étudiant.');
  }
};

const genderOptions = [
  { label: 'Homme', value: 'MALE' },
  { label: 'Femme', value: 'FEMALE' },
];

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

          <View style={styles.textinputs}>
          {/* <Text style={styles.label}>Votre Specialite</Text> */}
          <TextInput
            style={styles.input}
            placeholder="ID de formation"
            value={formation_id}
            onChangeText={setFormationId}
            keyboardType="numeric"
          />
          </View>

          <View style={styles.textinputs}>
          {/* <Text style={styles.label}>Montant</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Montant payé"
            value={paid_amount}
            onChangeText={setPaidAmount}
            keyboardType="numeric"
          />
          </View>

          {/* <View style={styles.statutContainer}>
            <Text style={styles.statutLabel}>Statut</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setStatut('payee')}
              >
                {statut === 'payee' && <Ionicons name="checkmark" size={16} style={styles.checkboxInner} />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Payée</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setStatut('impayee')}
              >
                {statut === 'impayee' && <Ionicons name="checkmark" size={16} style={styles.checkboxInner} />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Impayée</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setStatut('avance')}
              >
                {statut === 'avance' && <Ionicons name="checkmark" size={16} style={styles.checkboxInner} />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Avancé</Text>
            </View>
          </View> */}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enregistrer</Text>
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
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  checkboxInner: {
    color: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 16,
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
