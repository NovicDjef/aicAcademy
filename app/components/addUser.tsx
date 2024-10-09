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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous d'avoir installé expo-vector-icons
import { router, Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';

const AddUser = () => {
  const [sexe, setSexe] = useState('');
  const [statut, setStatut] = useState('');

  return (
    <SafeAreaView style={styles.containerTT}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, {marginTop: 44,}]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvelle enregistrement</Text>
        </View>
      <ScrollView style={{  backgroundColor: COLORS.white }}>
       

       <View style={styles.imageContainer}>
        <Ionicons name="receipt-outline" size={100} color={COLORS.primary} />
       </View>

       <View style={styles.inputContainer}>
       <View style={styles.textinputs}>
        <TextInput style={styles.input} placeholder="Nom" />
       </View>
       <View style={styles.textinputs}>
        <TextInput style={styles.input} placeholder="Prenoms" />
       </View>
        
        <TouchableOpacity style={styles.input}>
          <Text style={styles.inputText}>Sexe</Text>
          <Ionicons name="chevron-down" size={24} color="gray" />
        </TouchableOpacity>
        <View style={styles.textinputs}>
         <TextInput style={styles.input} placeholder="Adresse" />
        </View>
        <View style={styles.textinputs}>
          <TextInput style={styles.input} placeholder="Dernier Diplome" />
        </View>
        <View style={styles.textinputs}>
          <TextInput style={styles.input} placeholder="Specialite" />
        </View>
        <View style={styles.textinputs}>
          <TextInput style={styles.input} placeholder="Montant" />
        </View>
        <View style={styles.statutContainer}>
          <Text style={styles.statutLabel}>Statut</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setStatut('payee')}
            >
              {statut === 'payee' && <Ionicons name="checkmark" size={16} style={styles.checkboxInner}  />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Payée</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setStatut('impayee')}
            >
              {statut === 'impayee' && <Ionicons name="checkmark" size={16} style={styles.checkboxInner}  />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>impayée</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setStatut('avance')}
            >
              {statut === 'avancé' &&  <Ionicons name="checkmark" size={16} style={styles.checkboxInner}  />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Avancé</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
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
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
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
    width: 16,
    height: 16,
    textAlign: 'center',
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
    padding: 1
  }
});

export default AddUser;