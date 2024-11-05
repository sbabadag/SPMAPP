import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogoContainer: {
    width: screenWidth,  // Set width to screen width
    height: screenWidth * 0.1,  // Adjust height to make the banner smaller (e.g., 10% of screen width)
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactLogo: {
    width: '100%',  // Ensure the image fits within its container
    height: '100%',
    resizeMode: 'contain', // Ensure the image maintains its aspect ratio
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  table: {
    marginTop: 20,
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
  },
});

export default styles;