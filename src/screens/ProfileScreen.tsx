import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

export const ProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6 name="user" size={80} color="#FF6B6B" />
        <Text style={styles.title}>Pokédex App</Text>
        <Text style={styles.subtitle}>React Native Challenge</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.infoItem}>
          <FontAwesome6 name="code" size={20} color="#666" iconStyle='solid'/>
          <Text style={styles.infoText}>Built with React Native & TypeScript</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome6 name="database" size={20} color="#666" iconStyle='solid'/>
          <Text style={styles.infoText}>Data from PokeAPI</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome6 name="heart" size={20} color="#666" iconStyle='solid'/>
          <Text style={styles.infoText}>Favorites with AsyncStorage</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});