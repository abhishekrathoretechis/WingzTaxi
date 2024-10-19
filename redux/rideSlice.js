import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  driverLocation: null,
  nearbyRides: [],
  selectedRide: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const rideSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    setDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
    setNearbyRides: (state, action) => {
      state.nearbyRides = action.payload;
    },
    selectRide: (state, action) => {
      state.selectedRide = action.payload;
    },
    updateRideStatus: (state, action) => {
      const {rideId, status} = action.payload;

      const ride = state.allRides?.find(ride => ride.id === rideId);
      if (ride) {
        ride.status = status;
      }

      if (state.selectedRide?.id === rideId) {
        state.selectedRide.status = status;
      }
    },
  },
});

export const {setDriverLocation, setNearbyRides, selectRide, updateRideStatus} =
  rideSlice.actions;
export default rideSlice.reducer;
