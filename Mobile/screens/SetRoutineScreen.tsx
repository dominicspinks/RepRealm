import { StackNavigationProp } from "@react-navigation/stack";
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { addWorkoutToRoutine, deleteRoutineById, deleteWorkoutFromRoutine, getRoutineWorkoutsByRoutineId, updateRoutineNameById } from "../services/routinesService";
import { RoutineWorkoutWithWorkout, WorkoutWithExercises } from "../db/schema";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import AcceptIcon from "../components/icons/AcceptIcon";
import BackIcon from "../components/icons/BackIcon";
import CloseIcon from "../components/icons/CloseIcon";
import EditIcon from "../components/icons/EditIcon";
import PlusIcon from "../components/icons/PlusIcon";
import { theme, ThemeColors } from "../theme";
import SelectWorkoutModal from "../components/modals/SelectWorkoutModal";
import WorkoutCard from "../components/cards/WorkoutCard";
import { useColourTheme } from "../contexts/ThemeContext";
import EmptyListNotice from "../components/EmptyListNotice";

type SetRoutineScreenNavigationProp = StackNavigationProp<RootStackParamList, "SetRoutine">;
type SetRoutineScreenRouteProp = RouteProp<RootStackParamList, "SetRoutine">;

export default function SetRoutineScreen() {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const navigation = useNavigation<SetRoutineScreenNavigationProp>();
    const route = useRoute<SetRoutineScreenRouteProp>();
    const routine = route.params.routine;

    const [name, setName] = useState(routine.name);
    const [tempName, setTempName] = useState(name);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [routineWorkouts, setRoutineWorkouts] = useState<RoutineWorkoutWithWorkout[]>([]);
    const [workoutModalOpen, setWorkoutModalOpen] = useState(false);

    useEffect(() => {
        fetchRoutineWorkouts();
    }, [routine]);

    async function fetchRoutineWorkouts() {
        if (!routine) return;
        const result = await getRoutineWorkoutsByRoutineId(routine.id);
        setRoutineWorkouts(result);
    }

    function handleBackButton() {
        if (routineWorkouts.length === 0) {
            Alert.alert(
                "Delete Workout?",
                "This workout has no exercises and will be deleted if you go back. Do you want to continue?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete", style: "destructive", onPress: async () => {
                            await deleteRoutineById(routine.id);
                            navigation.goBack();
                        }
                    },
                ]
            );
            return;
        }
        navigation.goBack();
    }

    function handleCancelEditName() {
        setIsEditingTitle(false);
    }

    async function handleSaveName() {
        await updateRoutineNameById(routine.id, tempName);
        setName(tempName);
        setIsEditingTitle(false);
    }

    function handleEditName() {
        setTempName(name);
        setIsEditingTitle(true);
    }

    async function handleSelectWorkout(workout: WorkoutWithExercises) {
        // Check if workout is already in routine
        const routineWorkout = routineWorkouts.find(rw => rw.workout.id === workout.id);
        if (routineWorkout) {
            Alert.alert("Workout already in routine");
            return;
        }

        const response = await addWorkoutToRoutine({
            routineId: routine.id,
            workoutId: workout.id,
            order: routineWorkouts.length + 1,
        });

        fetchRoutineWorkouts();
        setWorkoutModalOpen(false);
    }

    async function handleDeleteWorkout(workoutId: string) {
        await deleteWorkoutFromRoutine(routine.id, workoutId);
        fetchRoutineWorkouts();
    }

    return (
        <View style={styles.page}>
            <ScreenHeader
                leftElement={<BackIcon action={handleBackButton} />}
                centreElement={
                    <View style={styles.titleContainer}>
                        {isEditingTitle ? (
                            <TextInput
                                style={styles.input}
                                value={tempName}
                                onChangeText={setTempName}
                                autoFocus
                            />
                        ) : (
                            <ScreenHeaderTitle title={name} />
                        )}
                        {isEditingTitle ? (
                            <View style={styles.editIcons}>
                                <AcceptIcon action={handleSaveName} />
                                <CloseIcon action={handleCancelEditName} />
                            </View>
                        ) : (
                            <EditIcon action={handleEditName} />
                        )}
                    </View>
                }
                rightElement={<PlusIcon action={() => { setWorkoutModalOpen(true) }} />}
            />

            <FlatList
                data={routineWorkouts}
                keyExtractor={(item) => item.workout.id}
                renderItem={({ item }) => (
                    <WorkoutCard workout={item.workout} collapsible={false} editable={false} onDelete={() => handleDeleteWorkout(item.workout.id)} />
                )}
                ListEmptyComponent={() => (<EmptyListNotice text="Add a workout to this routine" />)}
            />

            {/* Select Workout Modal */}
            <SelectWorkoutModal
                visible={workoutModalOpen}
                onClose={() => setWorkoutModalOpen(false)}
                onSelectWorkout={handleSelectWorkout}
                excludeWorkouts={routineWorkouts.map(rw => rw.workout.id)}
            />
        </View>
    )
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.background.screen,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        fontSize: 18,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderColor: colors.border.input,
        padding: 2,
        minWidth: 120,
        color: colors.text.primary,
    },
    editIcons: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
});