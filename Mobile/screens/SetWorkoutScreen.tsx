import { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Alert, FlatList } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import ScreenHeader from "../components/headers/ScreenHeader";
import BackIcon from "../components/icons/BackIcon";
import { RootStackParamList } from "../navigation/types";
import { theme } from "../theme";
import CloseIcon from "../components/icons/CloseIcon";
import AcceptIcon from "../components/icons/AcceptIcon";
import EditIcon from "../components/icons/EditIcon";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import PlusIcon from "../components/icons/PlusIcon";
import SelectCategoryModal from "../components/modals/SelectCategoryModal";
import { CategoryWithColour, ExerciseFull, NewWorkoutExerciseWithSets, WorkoutExerciseWithSets } from "../db/schema";
import SelectExerciseModal from "../components/modals/SelectExerciseModal";
import SetWorkoutExerciseModal from "../components/modals/SetWorkoutExerciseModal";
import { addWorkoutExercise, deleteWorkoutById, deleteWorkoutExerciseById, getWorkoutExercisesByWorkoutId, updateWorkoutExercise, updateWorkoutNameById } from "../services/workoutsService";
import WorkoutExerciseCard from "../components/cards/WorkoutExerciseCard";
import { getExerciseById } from "../services/exercisesService";

type SetWorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList, "SetWorkout">;
type SetWorkoutScreenRouteProp = RouteProp<RootStackParamList, "SetWorkout">;

export default function SetWorkoutScreen() {
    const navigation = useNavigation<SetWorkoutScreenNavigationProp>();
    const route = useRoute<SetWorkoutScreenRouteProp>();
    const workout = route.params.workout;

    const [name, setName] = useState(workout.name);

    const [tempName, setTempName] = useState(name);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithColour | null>(null);
    const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseFull | null>(null);
    const [workoutExerciseModalOpen, setWorkoutExerciseModalOpen] = useState(false);
    const [workoutExercise, setWorkoutExercise] = useState<WorkoutExerciseWithSets | null>(null);
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseWithSets[]>([]);

    useEffect(() => {
        fetchWorkoutExercises();
    }, [workout]);

    async function fetchWorkoutExercises() {
        if (!workout) return;
        const result = await getWorkoutExercisesByWorkoutId(workout.id);
        setWorkoutExercises(result);
    }

    function handleEditName() {
        setTempName(name);
        setIsEditingTitle(true);
    }

    function handleCancelEditName() {
        setIsEditingTitle(false);
    }

    async function handleSaveName() {
        await updateWorkoutNameById(workout.id, tempName);
        setName(tempName);
        setIsEditingTitle(false);
    }

    function handleSelectCategory(category: CategoryWithColour) {
        setSelectedCategory(category);
        setCategoryModalOpen(false);
        setExerciseModalOpen(true);
    }

    function handleSelectExercise(exercise: ExerciseFull) {
        setSelectedExercise(exercise);
        setWorkoutExercise(null);
        setExerciseModalOpen(false);
        setWorkoutExerciseModalOpen(true);
    }

    function handleCloseSelectExercise() {
        setSelectedCategory(null);
        setExerciseModalOpen(false);
        setCategoryModalOpen(true);
    }

    function handleAddCategory() {
        console.log("Open SetCategoryModal");
    }

    function handleAddExercise() {
        console.log("Open SetExerciseModal");
    }

    function handleCloseSetWorkoutExercise(closeAll: boolean) {
        setWorkoutExerciseModalOpen(false);
        setSelectedExercise(null);
        setWorkoutExercise(null);

        if (!closeAll) {
            setExerciseModalOpen(true);
        }
    }

    function handleBackButton() {
        if (workoutExercises.length === 0) {
            Alert.alert(
                "Delete Workout?",
                "This workout has no exercises and will be deleted if you go back. Do you want to continue?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete", style: "destructive", onPress: async () => {
                            await deleteWorkoutById(workout.id);
                            navigation.goBack();
                        }
                    },
                ]
            );
            return;
        }
        navigation.goBack();
    }

    async function handleSaveWorkoutExercise(workoutExercise: NewWorkoutExerciseWithSets) {
        if (workoutExercise.id) {
            // **Update existing workout exercise**
            await updateWorkoutExercise(workoutExercise);
        } else {
            // **Create a new workout exercise**
            await addWorkoutExercise(workout.id, workoutExercise.exerciseId, workoutExercise.sets ?? []);
        }
        setWorkoutExercise(null);
        fetchWorkoutExercises();

    }

    async function handleEditExercise(workoutExercise: WorkoutExerciseWithSets) {
        const exercise = await getExerciseById(workoutExercise.exerciseId);
        setSelectedExercise(exercise);
        setWorkoutExercise(workoutExercise);
        setWorkoutExerciseModalOpen(true);
    }

    async function handleDeleteExercise(workoutExercise: WorkoutExerciseWithSets) {
        Alert.alert(
            "Delete Exercise?", "",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: async () => {
                        await deleteWorkoutExerciseById(workoutExercise.id);
                        fetchWorkoutExercises();
                    }
                }
            ]
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
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
                                <CloseIcon action={handleCancelEditName} />
                                <AcceptIcon action={handleSaveName} />
                            </View>
                        ) : (
                            <EditIcon action={handleEditName} />
                        )}
                    </View>
                }
                rightElement={<PlusIcon action={() => { setCategoryModalOpen(true) }} />}
            />

            <FlatList
                data={workoutExercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <WorkoutExerciseCard item={item} onEdit={() => handleEditExercise(item)} onDelete={() => handleDeleteExercise(item)} />}
            />

            {/* Select Category Modal */}
            <SelectCategoryModal
                visible={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onSelectCategory={handleSelectCategory}
                onAddCategory={handleAddCategory}
            />

            <SelectExerciseModal
                visible={exerciseModalOpen}
                onClose={handleCloseSelectExercise}
                category={selectedCategory}
                onSelectExercise={handleSelectExercise}
                onAddExercise={handleAddExercise}
            />

            {selectedExercise && (
                <SetWorkoutExerciseModal
                    visible={workoutExerciseModalOpen}
                    workout={workout}
                    exercise={selectedExercise}
                    workoutExercise={workoutExercise}
                    onClose={handleCloseSetWorkoutExercise}
                    onSave={handleSaveWorkoutExercise}
                />
            )}
        </View>
    );
}

// **Styles**
const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        fontSize: 18,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderColor: theme.colors.inputBorder,
        padding: 2,
        minWidth: 120,
        color: theme.colors.text,
    },
    editIcons: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
});
