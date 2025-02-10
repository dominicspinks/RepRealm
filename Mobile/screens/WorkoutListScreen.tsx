import { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";

import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/ScreenHeader";
import ScreenHeaderTitle from "../components/ScreenHeaderTitle";
import WorkoutCard from "../components/WorkoutCard";

import { getColours } from "../services/coloursService";

export default function WorkoutListScreen() {
    const [colours, setColours] = useState<{ id: string; hex: string }[]>([]);

    useEffect(() => {
        async function fetchColours() {
            const data = await getColours();
            setColours(data);
        }

        fetchColours();
    }, []);


    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Workouts" />}
                rightElement={<PlusIcon action={() => console.log("Open create page")} />}
            />

            {colours.map((colour) => (
                <Text key={colour.id} style={{ color: colour.hex }}>
                    {colour.id} - {colour.hex}
                </Text>
            ))}
        </View>
    );
}