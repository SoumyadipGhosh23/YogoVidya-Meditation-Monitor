import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../(services)/api/api";
import beachImage from "@/assets/meditation-images/beach.webp";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import AppGradient from "@/components/AppGradient";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExpoRouter } from "expo-router/build/global-state/router-store";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
});

export default function Login() {
  const router = useExpoRouter();
  const [error, setError] = useState<string | null>("")
  const [loading, setLoading] = useState(true)

  const showToastMessage = (message: string, type: string) => {
    if (type === "success") {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };

  useEffect(() => {
    (async () => {
      const isAccessTokenPresent = await AsyncStorage.getItem("accessToken");
      setLoading(false)
      if (isAccessTokenPresent) {
        router.replace("/nature-meditate");
      }
    })();
  }, []);

  return (
    <>
     {loading ? <ActivityIndicator/> : <View className="flex-1">
      <StatusBar style="light" />
      <ImageBackground
        source={beachImage}
        resizeMode="cover"
        className="flex-1"
      >
        <AppGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
        >
          <SafeAreaView className="flex flex-1 px-1 justify-center">
            <Text className="text-center text-white font-bold text-4xl mb-8">
              Login
            </Text>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setError("");
                setSubmitting(true);
                showToastMessage("Logging in...", "info");
                try {
                  const response = await loginUser(values);
                  
                  await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
                  await AsyncStorage.setItem("refreshToken", response.data.data.refreshToken);
                  showToastMessage("Logged In", "success");
                  router.replace("/nature-meditate");
                } catch (err) {
                  showToastMessage("Login Failed", "error");
                  setError("Login Failed");
                  console.error(err);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  {errors.email && touched.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                  />
                  {errors.password && touched.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  ) : null}

                  {error && <Text className="text-red-500">{error}</Text>}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <TouchableOpacity
              onPress={() => router.push("/auth/register")}
            >
              <Text className="text-center text-white font-regular text-sm mt-7">
                Don't have an account? Click here
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </AppGradient>
      </ImageBackground>
    </View>}</>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
