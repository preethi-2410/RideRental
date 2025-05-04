// Import cleaned data
import carsData from './clean_cars_dataset.json';
import bikesData from './clean_bikes_dataset.json';
import { carImages, bikeImages } from './vehicleImages';

// Helper function to decode URL-encoded strings
function decodeVehicleName(name) {
    return decodeURIComponent(name);
}

// Helper function to get vehicle image
function getVehicleImage(name, type) {
    const decodedName = decodeVehicleName(name);
    const images = type === 'car' ? carImages : bikeImages;
    return images[decodedName] || images.default;
}

// Process cars data
export const cars = carsData.map((car, index) => ({
    id: `car-${index + 1}`,
    name: decodeVehicleName(car.name),
    type: 'car',
    image: getVehicleImage(car.name, 'car'),
    price: parseInt(car.price),
    rating: parseFloat(car.rating),
    seats: parseInt(car.seats),
    transmission: car.transmission,
    fuel: car.fuel,
    brand: car.brand,
    model: car.model,
    category: car.category,
    hourlyRate: parseInt(car.hourlyRate)
}));

// Process bikes data
export const bikes = bikesData.map((bike, index) => ({
    id: `bike-${index + 1}`,
    name: decodeVehicleName(bike.name),
    type: 'bike',
    image: getVehicleImage(bike.name, 'bike'),
    price: parseInt(bike.price),
    rating: parseFloat(bike.rating),
    brand: bike.brand,
    model: bike.model,
    category: bike.category,
    hourlyRate: parseInt(bike.hourlyRate),
    fuel: bike.fuel,
    availabilityStatus: bike.availabilityStatus === 'TRUE'
}));

export const getAllVehicles = () => {
    return [...cars, ...bikes];
};

export const getVehicleById = (id) => {
    return getAllVehicles().find(vehicle => vehicle.id === id);
};

export const getVehiclesByType = (type) => {
    return getAllVehicles().filter(vehicle => vehicle.type === type);
};

export const getFeaturedVehicles = (count = 6) => {
    const allVehicles = getAllVehicles();
    const shuffled = [...allVehicles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}; 