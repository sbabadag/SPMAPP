import React, { useState, useEffect } from 'react';
import { Image, View, FlatList, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles';
import { database } from '../firebase'; // Import your Firebase configuration
import { ref, onValue, update } from 'firebase/database';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  const [selectedProject, setSelectedProject] = useState('-OASNZGcsqAoUw2DTIXV');
  const [records, setRecords] = useState<Record[]>([]);
  const [projects, setProjects] = useState<{ id: string; projectName: string }[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const projectsRef = ref(database, 'projects');
    onValue(projectsRef, (snapshot) => {
      const value = snapshot.val();
      setProjects(Object.entries(value).map(([id, project]) => ({ id, projectName: (project as { projectName: string }).projectName })));
    });
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const dataRef = ref(database, `projects/${selectedProject}/records`);
      onValue(dataRef, (snapshot) => {
        const value = snapshot.val();
        setRecords(value || []);
        setFilteredRecords(value || []);
      });
    }
  }, [selectedProject]);

  interface Record {
    POSNO: string;
    Profile: string;
    Quantity: number;
    QuantityDone?: number;
    QuantitySent?: number;
    Weight: number;
  }

  interface Project {
    id: string;
    projectName: string;
  }

  const handleQuantityDoneChange = (index: number, value: string) => {
    const updatedRecords = [...records];
    updatedRecords[index].QuantityDone = parseInt(value, 10);
    setRecords(updatedRecords);

    // Save to database
    const recordRef = ref(database, `projects/${selectedProject}/records/${index}`);
    update(recordRef, { QuantityDone: parseInt(value, 10) });
  };

  const handleQuantitySentChange = (index: number, value: string) => {
    const updatedRecords: Record[] = [...records];
    updatedRecords[index].QuantitySent = parseInt(value, 10);
    setRecords(updatedRecords);

    // Save to database
    const recordRef = ref(database, `projects/${selectedProject}/records/${index}`);
    update(recordRef, { QuantitySent: parseInt(value, 10) });
  };

  const renderItem = ({ item, index }: { item: Record; index: number }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.POSNO}</Text>
      <Text style={styles.tableCell}>{item.Profile}</Text>
      <Text style={styles.tableCell}>{item.Quantity}</Text>
      <TextInput
        style={[
          styles.tableCellInput,
          item.QuantityDone === item.Quantity && styles.highlightedCell,
        ]}
        value={(item.QuantityDone || '').toString()}
        onChangeText={(value) => handleQuantityDoneChange(index, value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.tableCellInput}
        value={(item.QuantitySent || '').toString()}
        onChangeText={(value) => handleQuantitySentChange(index, value)}
        keyboardType="numeric"
      />
      <Text style={styles.tableCell}>{item.Weight}</Text>
    </View>
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectProject = (projectId: string) => {
    setSelectedProject(projectId);
    toggleModal();
  };

  const headerComponent = () => (
    <>
      <View style={styles.reactLogoContainer}>
        <Image
          source={require('@/assets/images/avmlogo.jpg')}
          style={styles.reactLogo}
        />
      </View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Select Project</ThemedText>
        <TouchableOpacity style={styles.pickerContainer} onPress={toggleModal}>
          <Text style={styles.pickerText}>
            {projects.find((project) => project.id === selectedProject)?.projectName || 'Select Project'}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={projects}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => selectProject(item.id)}>
                    <Text style={styles.modalItem}>{item.projectName}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </Modal>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Project Records</ThemedText>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>POSNO</Text>
          <Text style={styles.tableHeaderCell}>Profile</Text>
          <Text style={styles.tableHeaderCell}>Quantity</Text>
          <Text style={styles.tableHeaderCell}>QuantityDone</Text>
          <Text style={styles.tableHeaderCell}>QuantitySent</Text>
          <Text style={styles.tableHeaderCell}>Weight</Text>
        </View>
      </ThemedView>
    </>
  );

  return (
    <FlatList
      data={filteredRecords}
      renderItem={renderItem}
      keyExtractor={(item) => item.POSNO}
      ListHeaderComponent={headerComponent}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}