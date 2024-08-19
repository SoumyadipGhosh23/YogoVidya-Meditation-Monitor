import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const initialState = {
  userName : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   setUserName : (state, {payload})=>{
     state.userName = payload;
   }
  },
});

export const { setUserName} =
  authSlice.actions;

export default authSlice.reducer;

