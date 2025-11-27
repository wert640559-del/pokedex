// FILE: ./screens/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthService } from '../services/AuthService';
import { useResponsive } from '../hooks/useResponsive';
import { LoadingIndicator } from '../components/LoadingIndicator';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { moderateScale } = useResponsive();

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const success = await AuthService.login(email, password);
      
      if (success) {
        onLoginSuccess();
      } else {
        Alert.alert('Login Failed', 'Please check your credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(moderateScale);

  if (isLoading) {
    return <LoadingIndicator text="Logging in..." />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Pokédex App</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>
            Demo: Use any email and password
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (moderateScale: (size: number, factor?: number) => number) => 
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DC0A2D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(24),
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: moderateScale(8),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: '#FFFFFF',
    marginBottom: moderateScale(32),
    opacity: 0.9,
  },
  form: {
    width: '100%',
    maxWidth: moderateScale(400),
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(16),
    fontSize: moderateScale(16),
    color: '#333333',
    borderWidth: 2,
    borderColor: '#1D2C5E',
  },
  loginButton: {
    backgroundColor: '#1D2C5E',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: moderateScale(8),
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  demoInfo: {
    marginTop: moderateScale(32),
    padding: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(8),
  },
  demoText: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
});

export default LoginScreen;