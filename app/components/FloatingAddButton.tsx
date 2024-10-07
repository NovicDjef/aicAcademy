import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import { useSelector } from 'react-redux';
import { COLORS, FONTS } from '@/constants/theme';

const FloatingAddButton = () => {
    const router = useRouter();

    const handlePress = () => {
     
        router.push("/components/addUser");
     
    };
    

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons name="add" size={24} color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -12,
    top: -13,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FloatingAddButton;