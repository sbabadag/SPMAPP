import React, { useState, useEffect } from 'react';
import { Image, View, FlatList, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles';
import { database } from '../firebase'; // Import your Firebase configuration
import { ref, onValue } from 'firebase/database';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [selectedProject, setSelectedProject] = useState('-OASNZGcsqAoUw2DTIXV');
  const [records, setRecords] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const projectsRef = ref(database, 'projects');
    onValue(projectsRef, (snapshot) => {
      const value = snapshot.val();
      setProjects(Object.entries(value).map(([id, project]) => ({ id, ...project })));
    });
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const dataRef = ref(database, `projects/${selectedProject}/records`);
      onValue(dataRef, (snapshot) => {
        const value = snapshot.val();
        setRecords(value || []);
      });
    }
  }, [selectedProject]);

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.POSNO}</Text>
      <Text style={styles.tableCell}>{item.Profile}</Text>
      <Text style={styles.tableCell}>{item.Quantity}</Text>
      <Text style={styles.tableCell}>{item.QuantityDone}</Text>
      <Text style={styles.tableCell}>{item.QuantitySent}</Text>
      <Text style={styles.tableCell}>{item.Weight}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.reactLogoContainer}>
        <Image
          source={require('@/assets/images/avmlogo.jpg')}
          style={styles.reactLogo}
        />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Select Project</ThemedText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedProject}
              onValueChange={(itemValue) => setSelectedProject(itemValue)}
              style={styles.picker}
            >
              {projects.map((project) => (
                <Picker.Item key={project.id} label={project.projectName} value={project.id} />
              ))}
            </Picker>
          </View>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Project Records</ThemedText>
          <View style={{ flex: 1 }}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>POSNO</Text>
              <Text style={styles.tableHeaderCell}>Profile</Text>
              <Text style={styles.tableHeaderCell}>Quantity</Text>
              <Text style={styles.tableHeaderCell}>QuantityDone</Text>
              <Text style={styles.tableHeaderCell}>QuantitySent</Text>
              <Text style={styles.tableHeaderCell}>Weight</Text>
            </View>
            <FlatList
              data={records}
              renderItem={renderItem}
              keyExtractor={(item) => item.POSNO}
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ flex: 1 }}
            />
          </View>
        </ThemedView>
      </ScrollView>
    </View>
  );
}