import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Pressable, View, FlatList, Text } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import FilterIcon from "../components/icons/FilterIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import SetExerciseModal from "../components/modals/SetExerciseModal";
import { getCategories } from "../services/categoriesService";
import { theme } from "../theme";
import { Category, Exercise, ExerciseFull } from "../db/schema";
import { getExercises, getExercisesFull } from "../services/exercisesService";
import ExerciseCard from "../components/cards/ExerciseCard";
import { useFocusEffect } from "@react-navigation/native";

export default function ExerciseListScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseFull | null>(null);
    const [exercises, setExercises] = useState<ExerciseFull[]>([]);

    // **Fetch categories when screen loads**
    useEffect(() => {
        async function fetchCategories() {
            const result = await getCategories();
            setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
        }

        async function fetchExercises() {
            const result = await getExercisesFull();
            setExercises(result.sort((a, b) => a.name.localeCompare(b.name)));
        }

        fetchExercises();
        fetchCategories();
    }, [modalVisible]);

    // **Close the modal and reset selected exercise**
    function closeModal() {
        setSelectedExercise(null);
        setModalVisible(false);
    }

    // **Open modal for adding a new exercise**
    function openAddExercise() {
        setSelectedExercise(null);
        setModalVisible(true);
    }

    // **Open modal for editing an existing exercise**
    function openEditExercise(exercise: ExerciseFull) {
        setSelectedExercise(exercise);
        setModalVisible(true);
    }

    function openDeleteExercise(exercise: ExerciseFull) {
        console.log("Delete exercise", exercise);
    }

    function openFilter() {
        console.log("Open filter modal");
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
                data={exercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ExerciseCard
                        item={item}
                        onEdit={openEditExercise}
                        onDelete={openDeleteExercise}
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