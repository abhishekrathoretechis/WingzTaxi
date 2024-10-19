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
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

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
        style={{flex: showModal ? 0.68 : 1}}
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
                <Text style={styles.nameText}>{ride.userId}</Text>
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

          <View style={styles.detailsWrapper}>
            <View style={styles.detailContainer}>
              <Text style={styles.labelText}>Name:</Text>
              <Text style={styles.infoText}>{selectedRide?.userId}</Text>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.labelText}>Drop Location:</Text>
              <Text style={styles.infoText}>{selectedRide?.dropLocation}</Text>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.labelText}>Total Fare:</Text>
              <Text style={styles.fareText}>${selectedRide?.totalFair}</Text>
            </View>
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
              <Text style={styles.buttonText}>Accept</Text>
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
              <Text style={styles.buttonText}>Reject</Text>
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
    flex: 0.35,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(1),
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#00BFFF',
  },
  detailsWrapper: {
    // marginVertical: 5,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveScreenHeight(0.8),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#555',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#333',
  },
  fareText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#32CD32',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsiveScreenHeight(0.5),
  },
  acceptButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 3,
  },
  rejectButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
});
