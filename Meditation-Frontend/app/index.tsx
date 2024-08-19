import { View, Text, Image, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import Animated, {
    FadeInDown,
} from "react-native-reanimated";

import beachImage from "@/assets/meditation-images/beach.webp";
import { useExpoRouter } from "expo-router/build/global-state/router-store";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
    const router = useExpoRouter();
    const [accessTokenPresent, setAccessTokenPresent] = useState(false);
    
    useEffect(() => {
        (async () => {
            const isAccessTokenPresent = await AsyncStorage.getItem("accessToken");
            if (isAccessTokenPresent) {
                setAccessTokenPresent(true)
            }
        })();

    }, [])


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
                    <SafeAreaView className="flex flex-1 px-1 justify-between">
                        <Animated.View
                            entering={FadeInDown.delay(300)
                                .mass(0.5)
                                .stiffness(80)
                                .springify(20)}
                        >
                            <Text className="text-center text-white font-bold text-4xl">
                                Simple Meditation
                            </Text>
                            <Text className="text-center text-white font-regular text-2xl mt-3">
                                Simplifying Meditation for Everyone
                            </Text>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInDown.delay(300)
                                .mass(0.5)
                                .stiffness(80)
                                .springify(20)}
                        >
                            <CustomButton
                                onPress={() => { accessTokenPresent ? router.push("/nature-meditate") : router.push("/auth/login") }}
                                title="Get Started"
                            />
                        </Animated.View>

                        <StatusBar style="light" />
                    </SafeAreaView>
                </AppGradient>
            </ImageBackground>
        </View>
    );
};

export default App;