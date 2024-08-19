import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { useExpoRouter } from "expo-router/build/global-state/router-store";


// Define the props type
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useExpoRouter();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async ()=>{
      const accessToken = await AsyncStorage.getItem("accessToken");
      setLoading(false);
      if (!accessToken) {
        router.push("/auth/login");
      }
    })();
  }, []);

  return (
    <>{
      loading 
      ? <ActivityIndicator /> 
      : children
    }</>
  );
};

export default ProtectedRoute;

