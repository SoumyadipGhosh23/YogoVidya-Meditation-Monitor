import AppGradient from "@/components/AppGradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import CustomButton from "@/components/CustomButton";

import MEDITATION_IMAGES from "@/constants/Meditation-Images";
import { TimerContext } from "@/context/TimerContext";
import { MEDITATION_DATA, AUDIO_FILES } from "@/constants/Meditation-Data";
import ProtectedRoute from "@/components/ProtectedRoute";

const Page = () => {
    const { id } = useLocalSearchParams();

    const { duration: secondsRemaining, setDuration } = useContext(TimerContext);

    const [isMeditating, setMeditating] = useState(false);
    const [audioSound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlayingAudio, setPlayingAudio] = useState(false);

    useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (secondsRemaining === 0) {
            if (isPlayingAudio && audioSound) audioSound.pauseAsync().catch(console.error);
            setMeditating(false);
            setPlayingAudio(false);
            return;
        }

        if (isMeditating) {
            timerId = setTimeout(() => {
                setDuration(secondsRemaining - 1);
            }, 1000);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [secondsRemaining, isMeditating]);

    useEffect(() => {
        return () => {
            setDuration(10);
            audioSound?.unloadAsync().catch(console.error);
        };
    }, [audioSound]);

    const initializeSound = async () => {
        try {
            const audioFileName = MEDITATION_DATA[Number(id) - 1]?.audio;
            console.log("Audio file name:", audioFileName);

            if (!audioFileName) {
                console.error("Audio file not found for meditation item with id", id);
                return null;
            }

            if (!AUDIO_FILES[audioFileName]) {
                console.error("Audio file not found in AUDIO_FILES object:", audioFileName);
                return null;
            }

            console.log("Loading audio file:", AUDIO_FILES[audioFileName]);

            const { sound } = await Audio.Sound.createAsync(AUDIO_FILES[audioFileName].uri);
            console.log("Audio file loaded:", sound);

            setSound(sound);
            return sound;
        } catch (error) {
            console.error("Failed to initialize sound:", error);
            return null;
        }
    };

    const togglePlayPause = async () => {
        const sound = audioSound ?? await initializeSound();

        if (sound) {
            const status = await sound.getStatusAsync();

            if (status.isLoaded && !isPlayingAudio) {
                await sound.playAsync().catch(console.error);
                setPlayingAudio(true);
            } else {
                await sound.pauseAsync().catch(console.error);
                setPlayingAudio(false);
            }
        }
    };

    async function toggleMeditationSessionStatus() {
        if (secondsRemaining === 0) setDuration(10);

        setMeditating(!isMeditating);

        await togglePlayPause();
    }

    const handleAdjustDuration = () => {
        if (isMeditating) toggleMeditationSessionStatus();

        router.push("/(modal)/adjust-meditation-duration");
    };

    const formattedTimeMinutes = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");
    const formattedTimeSeconds = String(secondsRemaining % 60).padStart(2, "0");

    return (
        <ProtectedRoute>
        <View className="flex-1">
            <ImageBackground
                source={MEDITATION_IMAGES[Number(id) - 1]}
                resizeMode="cover"
                className="flex-1"
            >
                <AppGradient colors={["transparent", "rgba(0,0,0,0.8)"]}>
                    <Pressable
                        onPress={() => router.back()}
                        className="absolute top-16 left-6 z-10"
                    >
                        <AntDesign name="leftcircleo" size={50} color="white" />
                    </Pressable>

                    <View className="flex-1 justify-center">
                        <View className="mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center">
                            <Text className="text-4xl text-blue-800 font-rmono">
                                {formattedTimeMinutes}.{formattedTimeSeconds}
                            </Text>
                        </View>
                    </View>

                    <View className="mb-5">
                        <CustomButton
                            title="Adjust duration"
                            onPress={handleAdjustDuration}
                        />
                        <CustomButton
                            title={isMeditating ? "Stop" : "Start Meditation"}
                            onPress={toggleMeditationSessionStatus}
                            containerStyles="mt-4"
                        />
                    </View>
                </AppGradient>
            </ImageBackground>
        </View>
        </ProtectedRoute>
    );
};

export default Page;
