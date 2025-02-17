import { FlatList, View } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { RoutineWithFullWorkouts, RoutineWithWorkouts } from "../db/schema";
import { getWorkoutsWithExercises } from "../services/workoutsService";
import { createRoutine, deleteRoutineById, getRoutinesWithWorkouts } from "../services/routinesService";
import RoutineCard from "../components/cards/RoutineCard";
import EmptyListNotice from "../components/EmptyListNotice";

type RoutineListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoutineList'>;

export default function RoutineListScreen() {
    const navigation = useNavigation<RoutineListScreenNavigationProp>();
    const [routines, setRoutines] = useState<RoutineWithFullWorkouts[]>([]);

    useFocusEffect(
        useCallback(() => {
            fetchRoutines();
        }, [])
    );

    async function fetchRoutines() {
        const result = await getRoutinesWithWorkouts();
        result.sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
            return dateB - dateA;
        });
        setRoutines(result);
    }

    async function openSetRoutineScreen() {
        const routine = await createRoutine("New Routine");
        navigation.navigate("SetRoutine", { routine });
    }

    async function handleDeleteRoutine(routineId: string) {
        await deleteRoutineById(routineId);
        fetchRoutines();
    }

    return (
        <View style={{ flex: 1 }}>
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Routines" />}
                rightElement={<PlusIcon action={openSetRoutineScreen} />}
            />

            <FlatList
                data={routines}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <RoutineCard
                        routine={item}
                        onEdit={() => navigation.navigate("SetRoutine", { routine: item })}
                        onDelete={() => handleDeleteRoutine(item.id)} />
                )}
                ListEmptyComponent={<EmptyListNotice text="No routines found" />}
            />
        </View>
    )
}