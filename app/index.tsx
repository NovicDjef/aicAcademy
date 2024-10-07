import { View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, router, Link } from 'expo-router'
import { COLORS } from '@/constants/theme';


export default function Index() {
  
  return (
   <View style={styles.container}>
        <View style={{ flexDirection: 'row', marginTop: 44, backgroundColor: COLORS.white }}>
            {/* <TouchableOpacity
                onPress={() => router.back()}
                style={[styles.backbotton, { backgroundColor: COLORS.primary + '80', left: 10 }]}>
                <Ionicons name="arrow-back" size={24} color={COLORS.black} />
            </TouchableOpacity> */}
            <Text style={[styles.header, { top: -8,  }]}>Enregistrements</Text>
        </View>
   </View>
  )
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
        textAlign: 'center',
        marginRight: 32
      },
      backbotton: {
        width: 40,
        height: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 26,
      },
  
  });