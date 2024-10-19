import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

const RideDetailsScreen = () => {
  const selectedRide = useSelector(state => state.rides.selectedRide);

  if (!selectedRide) return <Text>No ride selected</Text>;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingBox}>
        <Text style={styles.headingText}>You have accepted the ride</Text>
      </View>

      <Text style={styles.subHeadingText}>Customer Information</Text>

      <View style={styles.profileContainer}>
        <Image source={selectedRide?.profilePic} style={styles.profileImage} />
        <Text style={styles.nameText}>{selectedRide?.userId}</Text>
      </View>

      <View style={styles.detailSection}>
        <View style={styles.detailContainer}>
          <Text style={styles.labelText}>Pickup Location:</Text>
          <Text style={styles.infoText}>
            {selectedRide?.pickupLocationName}
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.labelText}>Drop Location:</Text>
          <Text style={styles.infoText}>{selectedRide?.dropLocation}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.labelText}>Status:</Text>
          <Text style={styles.infoText}>{selectedRide?.status}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.labelText}>Total Fare:</Text>
          <Text style={styles.fareText}>${selectedRide?.totalFair}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.buttonText}>START RIDE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RideDetailsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headingBox: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  headingText: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
  subHeadingText: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    textDecorationLine: 'underline',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#333',
  },
  detailSection: {
    marginBottom: 40,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  labelText: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: '#555',
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#777',
  },
  fareText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
  },
  startButton: {
    backgroundColor: '#5d76f4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
});
