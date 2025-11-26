import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../hooks/useNetwork';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

export const NetworkStatus: React.FC = () => {
  const { isConnected } = useNetwork();

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <FontAwesome6 name="wifi" size={16} color="white" iconStyle='solid'/>
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6B6B',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
});