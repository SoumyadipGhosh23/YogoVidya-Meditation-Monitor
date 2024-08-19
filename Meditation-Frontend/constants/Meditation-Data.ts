export interface MeditationType {
    id: number;
    title: string;
    image: string;
    audio: string;
}

interface Music {
    uri: string;
    // Add other properties if necessary
}



export const MEDITATION_DATA: MeditationType[] = [
    {
        id: 1,
        title: "Mountains",
        image: "trees.webp",
        audio: "trees.mp3",
    },
    {
        id: 2,
        title: "Rivers",
        image: "river.webp",
        audio: "river.mp3",
    },
    {
        id: 3,
        title: "Sunset",
        image: "meditate-under-tree.webp",
        audio: "meditate-under-tree.mp3",
    },
    {
        id: 4,
        title: "Beaches",
        image: "beach.webp",
        audio: "beach.mp3",
    },
    {
        id: 5,
        title: "Starry Night",
        image: "yosemite-stars.webp",
        audio: "yosemite-stars.mp3",
    },
    {
        id: 6,
        title: "Waterfall",
        image: "waterfall.webp",
        audio: "waterfall.mp3",
    },
];


import treesMp3 from "@/assets/audio/trees.mp3";
import riverMp3 from "@/assets/audio/river.mp3";
import meditateUnderTreeMp3 from "@/assets/audio/meditate-under-tree.mp3";
import beachMp3 from "@/assets/audio/beach.mp3";
import yosemiteStarsMp3 from "@/assets/audio/yosemite-stars.mp3";
import waterfallMp3 from "@/assets/audio/waterfall.mp3";

export const AUDIO_FILES: { [key: string]: Music } = {
  "trees.mp3": { uri: treesMp3 },
  "river.mp3": { uri: riverMp3 },
  "meditate-under-tree.mp3": { uri: meditateUnderTreeMp3 },
  "beach.mp3": { uri: beachMp3 },
  "yosemite-stars.mp3": { uri: yosemiteStarsMp3 },
  "waterfall.mp3": { uri: waterfallMp3 },
};
