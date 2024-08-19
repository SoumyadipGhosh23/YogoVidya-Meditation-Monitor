import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Function to load user from AsyncStorage
// const loadAccessTokenFromStorage = async () => {
//   console.log("Loading access token from AsyncStorage...");
  
//   try {
//     const accessToken = await AsyncStorage.getItem("accessToken");
//     const refreshToken = await AsyncStorage.getItem("refreshToken");
//     if (accessToken && refreshToken) {
//       console.log("Access token and refresh token loaded from AsyncStorage.");
//       return { accessToken, refreshToken };
//     }
//     if (refreshToken) {
//       console.log("Only refresh token loaded from AsyncStorage.");
//       const API_URI = process.env.EXPO_PUBLIC_API_URL;
//       const response = await axios.post(`${API_URI}/api/v1/auth/refresh-token`, { refreshToken });
//       await AsyncStorage.setItem("accessToken", response.data.accessToken);
//       await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
//       return response.data;
//     }
//     console.log("No access token or refresh token found in AsyncStorage.");   
//     return null;
//   } catch (error) {
//     console.error("Failed to refresh token", error);
//     await AsyncStorage.removeItem("accessToken");
//     await AsyncStorage.removeItem("refreshToken");
//     return null;
//   }
// };

const initialState = {
  userName : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   
  },
});

export const { } =
  authSlice.actions;

export default authSlice.reducer;

