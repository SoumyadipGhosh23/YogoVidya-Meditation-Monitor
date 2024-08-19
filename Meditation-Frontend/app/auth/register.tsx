import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { registerUser } from "../(services)/api/api";
import { ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppGradient from "@/components/AppGradient";
import { StatusBar } from "expo-status-bar";
import beachImage from "@/assets/meditation-images/beach.webp";

const RegisterSchema = Yup.object().shape({
  userName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Required"),
});

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("")

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

  return (
    <View className="flex-1">
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
            <Text className="text-center text-white font-bold text-4xl mb-8">Register</Text>
            <Formik
              initialValues={{
                userName: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values) => {
                const data = {
                  userName: values.userName,
                  email: values.email,
                  password: values.password,
                };
                setError("");
                showToastMessage("Logging in...", "info");
                try {
                  const response = await registerUser(data);
                  showToastMessage("Registered Successfully", "success");
                  setTimeout(() => {
                    if (response) {
                      router.push("/auth/login");
                    }
                  }, 3000);
                } catch (error) {
                  console.log(error);
                  showToastMessage("Something went wrong", "error");
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
              }) => (
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="User Name"
                    onChangeText={handleChange("userName")}
                    onBlur={handleBlur("userName")}
                    value={values.userName}
                  />
                  {errors.userName && touched.userName ? (
                    <Text style={styles.errorText}>{errors.userName}</Text>
                  ) : null}
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
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    secureTextEntry
                  />
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  ) : null}
                  {error && <Text className="text-red-500">{error}</Text>}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.buttonText}>Register</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
            >
              <Text className="text-center text-white font-regular text-sm mt-7">
                Already have an account?
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </AppGradient>
      </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
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
  successText: {
    color: "green",
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
