import { FlatList, Text, View } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/ScreenHeader";
import ScreenHeaderTitle from "../components/ScreenHeaderTitle";
import { useNavigation } from "@react-navigation/native";
import WorkoutCard from "../components/WorkoutCard";

export default function WorkoutListScreen() {
    const navigation = useNavigation();

    const mockWorkouts = [
        {
            id: "1",
            name: "Upper Body Strength",
            categories: [
                { id: "c1", name: "Chest", color: "#FF5733" },
                { id: "c2", name: "Arms", color: "#33FF57" },
            ],
            exercises: [
                { id: "e1", name: "Bench Press", categoryColor: "#FF5733" },
                { id: "e2", name: "Bicep Curls", categoryColor: "#33FF57" },
            ],
        },
        {
            id: "2",
            name: "Leg Day",
            categories: [{ id: "c3", name: "Legs", color: "#3357FF" }],
            exercises: [{ id: "e3", name: "Squats", categoryColor: "#3357FF" }],
        },
    ];

    return (
        <View style={{ flex: 1 }}>
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Workouts" />}
                rightElement={<PlusIcon action={() => console.log(`Open create page`)} />}
            />
            {/* List of Workouts */}
            <FlatList
                data={mockWorkouts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <WorkoutCard workout={item} onEdit={() => console.log("Edit", item.id)} />}
                ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No workouts found</Text>}
                contentContainerStyle={{ padding: 15 }}
            />
        </View>
    )
}