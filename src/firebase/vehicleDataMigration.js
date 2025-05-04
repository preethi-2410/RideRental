import { db } from './config';
import { collection, getDocs, query, where, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore';
import carsData from '../data/clean_cars_dataset.json';
import bikesData from '../data/clean_bikes_dataset.json';

// Test Firebase connection
const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    const testRef = collection(db, 'test');
    const testDoc = await addDoc(testRef, {
      test: 'connection',
      timestamp: new Date().toISOString()
    });
    console.log('Firebase connection test successful. Test document ID:', testDoc.id);
    
    // Clean up test document
    await deleteDoc(doc(db, 'test', testDoc.id));
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

export const migrateVehicleData = async () => {
  try {
    // Test Firebase connection first
    const isConnected = await testFirebaseConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Firebase');
    }

    console.log('Starting vehicle data migration...');
    console.log('Number of cars to migrate:', carsData.length);
    console.log('Number of bikes to migrate:', bikesData.length);

    // Clear existing data first
    await clearExistingData();
    
    // Add cars data
    console.log('Adding cars data...');
    const carPromises = carsData.map(async (car, index) => {
      try {
        // Generate the custom ID
        const carId = `car-${index + 1}`;
        const carData = {
          ...car,
          id: carId, // Optionally store the ID within the document too
          type: 'car',
          availability: true, // Assuming default availability
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        console.log(`Adding car ${carId}:`, carData.name);
        // Use setDoc with the custom ID
        const vehicleRef = doc(db, 'vehicles', carId);
        await setDoc(vehicleRef, carData);
        console.log(`Car ${carId} added successfully.`);
        return carId;
      } catch (error) {
        console.error('Error adding car:', car.name, error);
        throw error; // Re-throw to allow Promise.all to catch it
      }
    });

    // Add bikes data
    console.log('Adding bikes data...');
    const bikePromises = bikesData.map(async (bike, index) => {
      try {
        // Generate the custom ID
        const bikeId = `bike-${index + 1}`;
        const bikeData = {
          ...bike,
          id: bikeId, // Optionally store the ID within the document too
          type: 'bike',
          availability: true, // Assuming default availability
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        console.log(`Adding bike ${bikeId}:`, bikeData.name);
        // Use setDoc with the custom ID
        const vehicleRef = doc(db, 'vehicles', bikeId);
        await setDoc(vehicleRef, bikeData);
        console.log(`Bike ${bikeId} added successfully.`);
        return bikeId;
      } catch (error) {
        console.error('Error adding bike:', bike.name, error);
        throw error; // Re-throw to allow Promise.all to catch it
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all([...carPromises, ...bikePromises]);
    console.log('All vehicles added successfully. Total documents:', results.length);

    // Verify the data was added
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef);
    const querySnapshot = await getDocs(q);
    console.log('Verification - Total documents in vehicles collection:', querySnapshot.size);
    
    // Log all document IDs and names
    querySnapshot.forEach((doc) => {
      console.log('Document ID:', doc.id, 'Name:', doc.data().name);
    });

    return true;
  } catch (error) {
    console.error('Error in migrateVehicleData:', error);
    return false;
  }
};

const clearExistingData = async () => {
  try {
    console.log('Clearing existing data...');
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef);
    const querySnapshot = await getDocs(q);
    
    console.log('Number of existing documents to delete:', querySnapshot.size);
    
    if (querySnapshot.size > 0) {
      const deletePromises = querySnapshot.docs.map(doc => {
        console.log('Deleting document:', doc.id, 'Name:', doc.data().name);
        return deleteDoc(doc.ref);
      });

      await Promise.all(deletePromises);
      console.log('Existing vehicle data cleared successfully');
    } else {
      console.log('No existing documents to delete');
    }
  } catch (error) {
    console.error('Error in clearExistingData:', error);
    throw error;
  }
};

export const checkAndMigrateData = async () => {
  try {
    console.log('Starting migration with custom IDs...');
    const success = await migrateVehicleData();
    if (success) {
        console.log('Migration with custom IDs completed successfully.');
    } else {
        console.error('Migration with custom IDs failed.');
    }
    return success;
  } catch (error) {
    console.error('Error in checkAndMigrateData:', error);
    return false;
  }
}; 