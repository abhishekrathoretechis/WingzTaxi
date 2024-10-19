import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {useDispatch, useSelector} from 'react-redux';
import {
  setDriverLocation,
  setNearbyRides,
  selectRide,
  updateRideStatus,
} from '../redux/rideSlice';
import {generateDummyRides} from '../utils/dummyData';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBNi9uhlK41L-wwLOntegDgKkfxMjjvvGc'; // Replace with your actual Google Maps API key

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const driverLocation = useSelector(state => state.rides.driverLocation);
  const nearbyRides = useSelector(state => state.rides.nearbyRides);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Set initial driver location (mock location)
    const mockDriverLocation = {latitude: 37.7712, longitude: -122.4112};
    dispatch(setDriverLocation(mockDriverLocation));

    // Fetch nearby ride requests (dummy data for now)
    const rides = generateDummyRides().map(ride => ({
      ...ride,
      pickupTime: ride.pickupTime.toISOString(), // Convert Date to ISO string
      timestamp: ride.timestamp.toISOString(), // Convert Date to ISO string
    }));
    dispatch(setNearbyRides(rides));
  }, [dispatch]);

  // Function to handle ride selection
  const handleRideSelect = ride => {
    setSelectedRide(ride);
    dispatch(selectRide(ride));
    // navigation.navigate('RideDetailsScreen');
    setShowModal(true);
  };

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: showModal ? 0.7 : 1}}
        region={{
          latitude: driverLocation?.latitude || 37.7749,
          longitude: driverLocation?.longitude || -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {/* Blue dot for the current driver's location */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Your Location"
            pinColor="blue" // Set the color of the marker to blue
          />
        )}

        {/* Markers for nearby rides with labels */}
        {nearbyRides.map(ride => (
          <Marker key={ride.id} coordinate={ride.pickupLocation}>
            <Callout onPress={() => handleRideSelect(ride)}>
              <View>
                <Text>{ride.userId}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {selectedRide && driverLocation && (
          <MapViewDirections
            origin={driverLocation}
            destination={selectedRide.pickupLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="blue"
            onError={errorMessage => {
              Alert.alert(
                'Error',
                'Unable to fetch directions. Please try again.',
              );
              console.log('Directions API Error:', errorMessage);
            }}
          />
        )}
      </MapView>
      {showModal ? (
        <View style={styles.modalContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={selectedRide.profilePic}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.labelText}>Name: </Text>
            <Text style={styles.infoText}>{selectedRide?.userId}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.labelText}>Drop Location: </Text>
            <Text style={styles.dropText}>{selectedRide?.dropLocation}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.labelText}>Total Fare: </Text>
            <Text style={styles.fareText}>${selectedRide?.totalFair}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                dispatch(
                  updateRideStatus({
                    rideId: selectedRide.id,
                    status: 'Accepted',
                  }),
                );
                setShowModal(false);
                navigation.navigate('RideDetailsScreen');
              }}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => {
                dispatch(
                  updateRideStatus({
                    rideId: selectedRide.id,
                    status: 'Rejected',
                  }),
                );
                setShowModal(false);
              }}>
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 0.3,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: 'darkslategray',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: 'black',
  },
  dropText: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: 'gray',
  },
  fareText: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: '#32CD32', // Green color for fare
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: '#32CD32', // Green button
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  rejectButton: {
    backgroundColor: '#FF6347', // Red button
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  acceptText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  rejectText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
});
