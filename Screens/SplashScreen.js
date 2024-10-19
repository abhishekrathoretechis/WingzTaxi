import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('HomeScreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require('../assets/images/i4.png')}
        style={styles.image4}
      />
      <Image
        source={require('../assets/images/i5.png')}
        style={styles.image5}
      />

      <Image
        source={require('../assets/images/i1.png')}
        style={styles.image1}
      />
      <Image source={require('../assets/images/Group.png')} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#2E82FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image4: {
    position: 'absolute',
    top: responsiveScreenHeight(15),
    left: responsiveScreenWidth(10),
  },
  image5: {
    position: 'absolute',
    top: responsiveScreenHeight(15),
    right: responsiveScreenWidth(10),
  },
  image1: {
    position: 'absolute',
    bottom: responsiveScreenHeight(10),
    right: responsiveScreenWidth(10),
  },
});
