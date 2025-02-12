import { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import FilterIcon from "../components/icons/FilterIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import SetExerciseModal from "../components/modals/SetExerciseModal";
import FilterModal from "../components/modals/FilterModal";
import { getCategories } from "../services/categoriesService";
import { getExercisesFull } from "../services/exercisesService";
import { Category, ExerciseFull } from "../db/schema";
import ExerciseCard from "../components/cards/ExerciseCard";
import { theme } from "../theme";

export default function ExerciseListScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [exercises, setExercises] = useState<ExerciseFull[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<ExerciseFull[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseFull | null>(null);

    // **Fetch categories & exercises on load**
    useEffect(() => {
        async function fetchCategories() {
            const result = await getCategories();
            setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
        }

        async function fetchExercises() {
            const result = await getExercisesFull();
            setExercises(result.sort((a, b) => a.name.localeCompare(b.name)));
            setFilteredExercises(result);
        }

        fetchExercises();
        fetchCategories();
    }, [modalVisible]);

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

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
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

            {/* Exercise List */}
            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ExerciseCard
                        item={item}
                        onEdit={openEditExercise}
                        onDelete={() => console.log("Delete", item)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No exercises found.</Text>}
            />

            {/* Set Exercise Modal */}
            <SetExerciseModal
                visible={modalVisible}
                onClose={closeModal}
                categories={categories}
                exercise={selectedExercise}
            />

            {/* Filter Modal */}
            <FilterModal
                visible={filterModalVisible}
                onClose={closeFilterModal}
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
            />
        </View>
    );
}

// **Styles**
const styles = StyleSheet.create({
    emptyText: {
        textAlign: "center",
        marginTop: theme.spacing.large,
        color: theme.colors.mutedText,
    },
    icons: {
        flexDirection: "row",
        gap: 15,
    }
});
