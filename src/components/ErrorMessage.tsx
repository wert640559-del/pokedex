import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useResponsive } from '../hooks/useResponsive';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { moderateScale } = useResponsive();
  
  const styles = createStyles(moderateScale);
  
  return (
    <View style={styles.container}>
      <FontAwesome6 name="triangle-exclamation" size={moderateScale(48)} color="#DC0A2D" iconStyle='solid'/>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (moderateScale: (size: number, factor?: number) => number) => 
  StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  message: {
    fontSize: moderateScale(16),
    color: '#1D2C5E',
    textAlign: 'center',
    marginVertical: moderateScale(16),
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#DC0A2D',
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(25),
    shadowColor: '#1D2C5E',
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});