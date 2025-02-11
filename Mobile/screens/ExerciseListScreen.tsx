import { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import FilterIcon from "../components/icons/FilterIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import SetExerciseModal from "../components/modals/SetExerciseModal";
import { getCategories } from "../services/categoriesService";
import { theme } from "../theme";
import { Category, Exercise } from "../db/schema";
import { useFocusEffect } from "@react-navigation/native";

export default function ExerciseListScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    // **Fetch categories when screen loads**
    useEffect(() => {
        async function fetchCategories() {
            const result = await getCategories();
            setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
        }

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
    function openEditExercise(exercise: Exercise) {
        setSelectedExercise(exercise);
        setModalVisible(true);
    }

    function openFilter() {
        console.log("Open filter modal");
    }

    return (
        <Pressable style={{ flex: 1 }}>
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

            {/* TODO: Add Exercise List Here */}

            {/* Set Exercise Modal */}
            <SetExerciseModal
                visible={modalVisible}
                onClose={closeModal}
                categories={categories}
                exercise={selectedExercise}
            />
        </Pressable>
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
        gap: 10,
    }
});