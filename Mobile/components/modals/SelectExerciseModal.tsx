import { useState, useEffect } from "react";
import { Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { theme } from "../../theme";
import { ExerciseFull } from "../../db/schema";
import { getExercisesFull } from "../../services/exercisesService";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";
import PlusIcon from "../icons/PlusIcon";
import ModalContainer from "./ModalContainer";
import React from "react";
import ModalSearchField from "../forms/ModalSearchField";
import SetExerciseModal from "./SetExerciseModal";
import EmptyListNotice from "../EmptyListNotice";

interface SelectExerciseModalProps {
    visible: boolean;
    onClose: () => void;
    category: { id: string; name: string } | null;
    onSelectExercise: (exercise: ExerciseFull) => void;
}

export default function SelectExerciseModal({ visible, onClose, category, onSelectExercise }: SelectExerciseModalProps) {
    const [exercises, setExercises] = useState<ExerciseFull[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

    // Fetch exercises when modal opens
    useEffect(() => {
        if (visible) fetchExercises();
    }, [visible, category]);

    async function fetchExercises() {
        if (!category) return;
        const result = await getExercisesFull();
        const filtered = result.filter((exercise) => exercise.categoryId === category.id);
        setExercises(filtered.sort((a, b) => a.name.localeCompare(b.name)));
    }

    // Filter exercises based on search query
    const filteredExercises = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function handleCloseExerciseModal() {
        setExerciseModalVisible(false);
        fetchExercises();
    }

    function onAddExercise() {
        setExerciseModalVisible(true);
        fetchExercises();
    }

    return (
        <ModalContainer
            visible={visible}
            header={
                <ModalHeader
                    leftElement={<BackIcon action={onClose} />}
                    centreElement={<ModalHeaderTitle title="Select Exercise" />}
                    rightElement={<PlusIcon action={onAddExercise} />}
                />
            }
            onClose={onClose}
            scrollable={false}
            content={
                <>
                    <ModalSearchField placeholder="Search Exercises..." value={searchQuery} handleSearch={setSearchQuery} />

                    {/* Exercise List */}
                    <FlatList
                        data={filteredExercises}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.exerciseItem} onPress={() => onSelectExercise(item)}>
                                <Text style={styles.exerciseText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={<EmptyListNotice text="No exercises found" />}
                    />
                </>
            }
            modals={
                <>
                    {/* Set Exercise Modal */}
                    <SetExerciseModal
                        visible={exerciseModalVisible}
                        onClose={handleCloseExerciseModal}
                        activeCategoryId={category?.id}
                    />
                </>
            }
        />
    );
}

// **Styles**
const styles = StyleSheet.create({
    exerciseItem: {
        paddingVertical: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.inputBorder,
        paddingHorizontal: theme.spacing.medium,
    },
    exerciseText: {
        fontSize: 16,
        color: theme.colors.text,
    },
});
