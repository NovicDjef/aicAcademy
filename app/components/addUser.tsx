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
  const [nom, setNom] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [sexe, setSexe] = useState(''); // Sexe sélectionné (Homme ou Femme)
  const [adresse, setAdresse] = useState('');
  const [diplome, setDiplome] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [montant, setMontant] = useState('');
  const [statut, setStatut] = useState('');

  const handleSubmit = async () => {
    // Vérification si tous les champs sont remplis
    if (!nom || !prenoms || !sexe || !adresse || !diplome || !specialite || !montant || !statut) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

  
    // Construction des données à envoyer
    const userData = {
      nom,
      prenoms,
      sexe,
      adresse,
      diplome,
      specialite,
      montant,
      statut,
    };

    try {
      // Envoi des données avec axios
      const response = await axios.post('https://votre-api.com/enregistrement', userData);
      if (response.status === 200) {
        Alert.alert('Succès', 'Utilisateur enregistré avec succès.');
        router.push('/Enregistrement');
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer l\'utilisateur.');
    }
  };
  const sexeOptions = [
    { label: 'Homme', value: 'Homme' },
    { label: 'Femme', value: 'Femme' },
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
          <Text style={styles.label}>Votre Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={nom}
              onChangeText={setNom}
            />
          </View>

          <View style={styles.textinputs}>
          <Text style={styles.label}>Votre Prenom</Text>
            <TextInput
              style={styles.input}
              placeholder="Prenoms"
              value={prenoms}
              onChangeText={setPrenoms}
            />
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Sexe</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={sexeOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Sélectionner Sexe"
              value={sexe}
              onChange={(item) => {
                setSexe(item.value);
              }}
            />
          </View>

          <View style={styles.textinputs}>
          <Text style={styles.label}>Adresse de residence</Text>
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              value={adresse}
              onChangeText={setAdresse}
            />
          </View>

          <View style={styles.textinputs}>
          <Text style={styles.label}>Dernier Diplome</Text>
            <TextInput
              style={styles.input}
              placeholder="Dernier Diplome"
              value={diplome}
              onChangeText={setDiplome}
            />
          </View>

          <View style={styles.textinputs}>
          <Text style={styles.label}>Votre Specialite</Text>
            <TextInput
              style={styles.input}
              placeholder="Specialite"
              value={specialite}
              onChangeText={setSpecialite}
            />
          </View>

          <View style={styles.textinputs}>
          <Text style={styles.label}>Montant</Text>
            <TextInput
              style={styles.input}
              placeholder="Montant"
              value={montant}
              onChangeText={setMontant}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statutContainer}>
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
          </View>

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
