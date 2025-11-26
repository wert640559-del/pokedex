import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../hooks/useNetwork';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useResponsive } from '../hooks/useResponsive';

export const NetworkStatus: React.FC = () => {
  const { isConnected } = useNetwork();
  const { moderateScale } = useResponsive();

  if (isConnected) return null;

  const styles = createStyles(moderateScale);

  return (
    <View style={styles.container}>
      <FontAwesome6 name="wifi" size={moderateScale(16)} color="white" iconStyle='solid'/>
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
};

const createStyles = (moderateScale: (size: number, factor?: number) => number) => 
  StyleSheet.create({
  container: {
    backgroundColor: '#DC0A2D',
    padding: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D2C5E',
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(4),
    elevation: 4,
  },
  text: {
    color: 'white',
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
});