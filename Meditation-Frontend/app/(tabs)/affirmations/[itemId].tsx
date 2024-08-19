import { AntDesign, Ionicons } from "@expo/vector-icons";
import { GalleryPreviewData } from "@/constants/models/AffirmationCategory";
import { router, useLocalSearchParams } from "expo-router";
import {
    View,
    Text,
    ImageBackground,
    Pressable,
    ScrollView,
} from "react-native";
import AFFIRMATION_GALLERY from "@/constants/Affirmation-Gallery";
import AppGradient from "@/components/AppGradient";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const AffirmationPractice = () => {
    const { itemId } = useLocalSearchParams();

    const [affirmation, setAffirmation] = useState<GalleryPreviewData>();
    const [sentences, setSentences] = useState<string[]>([]);

    useEffect(() => {
        for (let idx = 0; idx < AFFIRMATION_GALLERY.length; idx++) {
            const affirmationData = AFFIRMATION_GALLERY[idx].data;

            const affirmationToStart = affirmationData.find(
                (a) => a.id === Number(itemId)
            );

            if (affirmationToStart) {
                setAffirmation(affirmationToStart);

                const affirmationsArray = affirmationToStart.text.split(".");

                // Remove the last element if it's an empty string
                if (affirmationsArray[affirmationsArray.length - 1] === "") {
                    affirmationsArray.pop();
                }

                setSentences(affirmationsArray);
                return;
            }
        }
    }, []);

    return (
        <ProtectedRoute>
        <View className="flex-1">
            <ImageBackground
                source={affirmation?.image}
                resizeMode="cover"
                className="flex-1"
            >
                <AppGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}>
                    <Pressable
                        onPress={() => router.back()}
                        className="absolute top-10 left-5 z-10"
                    >
                        <Ionicons name="arrow-back-circle-outline" size={40} color="white" />
                    </Pressable>

                    <ScrollView
                        className="mt-20"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="h-full border-white justify-center">
                            <View className="h-4/5 justify-center">
                                {sentences.map((sentence, idx) => (
                                    <Text
                                        className="text-white text-3xl mb-12 font-bold text-center"
                                        key={idx}
                                    >
                                        {sentence}.
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </AppGradient>
            </ImageBackground>
        </View>
        </ProtectedRoute>
    );
};

export default AffirmationPractice;