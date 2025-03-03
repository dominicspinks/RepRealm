import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import FilterIcon from "../components/icons/FilterIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import SetExerciseModal from "../components/modals/SetExerciseModal";
import FilterModal from "../components/modals/FilterModal";
import { getCategories } from "../services/categoriesService";
import { deleteExercise, getExercisesFull } from "../services/exercisesService";
import { Category, ExerciseFull } from "../db/schema";
import ExerciseCard from "../components/cards/ExerciseCard";
import EmptyListNotice from "../components/EmptyListNotice";
import LoadingIndicator from "../components/LoadingIndicator";
import { useColourTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../theme";

export default function ExerciseListScreen() {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [categories, setCategories] = useState<Category[]>([]);
    const [exercises, setExercises] = useState<ExerciseFull[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<ExerciseFull[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseFull | null>(null);

    const [loading, setLoading] = useState(true);

    // **Fetch categories & exercises on load**
    useEffect(() => {
        setLoading(true);
        fetchExercises();
        fetchCategories();
        setLoading(false);
    }, [modalVisible]);

    async function fetchCategories() {
        const result = await getCategories();
        setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
    }

    async function fetchExercises() {
        const result = await getExercisesFull();
        setExercises(result.sort((a, b) => a.name.localeCompare(b.name)));
        setFilteredExercises(result);
    }

    // **Filter Exercises based on Selected Categories**
    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredExercises(exercises);
        } else {
            setFilteredExercises(exercises.filter(ex => selectedCategories.includes(ex.categoryId)));
        }
    }, [selectedCategories, exercises]);

    // **Close the modals**
    function closeModal() {
        setSelectedExercise(null);
        setModalVisible(false);
    }

    function closeFilterModal() {
        setFilterModalVisible(false);
    }

    // **Open modals**
    function openAddExercise() {
        setSelectedExercise(null);
        setModalVisible(true);
    }

    function openEditExercise(exercise: ExerciseFull) {
        setSelectedExercise(exercise);
        setModalVisible(true);
    }

    function openFilter() {
        setFilterModalVisible(true);
    }

    async function handleDeleteExercise(id: string) {
        Alert.alert(
            "Delete Exercise",
            "Are you sure you want to delete this exercise? It will be removed from any saved workouts.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteExercise(id);
                        fetchExercises();
                    },
                },
            ]
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Exercises" />}
                rightElement={
                    <View style={styles.icons}>
                        <FilterIcon action={openFilter} />
                        <PlusIcon action={openAddExercise} />
                    </View>
                }
            />

            {loading && <LoadingIndicator />}

            {!loading &&
                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ExerciseCard
                            item={item}
                            onEdit={openEditExercise}
                            onDelete={() => handleDeleteExercise(item.id)}
                        />
                    )}
                    ListEmptyComponent={<EmptyListNotice text="No exercises found" />}
                />}

            <SetExerciseModal
                visible={modalVisible}
                onClose={closeModal}
                exercise={selectedExercise}
            />

            <FilterModal
                visible={filterModalVisible}
                onClose={closeFilterModal}
                categoryFilter={{ selected: selectedCategories, setSelected: setSelectedCategories }}
            />
        </View>
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    icons: {
        flexDirection: "row",
        gap: 15,
    }
});
