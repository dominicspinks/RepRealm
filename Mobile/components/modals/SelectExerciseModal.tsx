import { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { theme } from "../../theme";
import { ExerciseFull } from "../../db/schema";
import { getExercisesFull } from "../../services/exercisesService";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";
import PlusIcon from "../icons/PlusIcon";

interface SelectExerciseModalProps {
    visible: boolean;
    onClose: () => void;
    category: { id: string; name: string } | null;
    onSelectExercise: (exercise: ExerciseFull) => void;
    onAddExercise: () => void;
}

export default function SelectExerciseModal({ visible, onClose, category, onSelectExercise, onAddExercise }: SelectExerciseModalProps) {
    const [exercises, setExercises] = useState<ExerciseFull[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch exercises when modal opens
    useEffect(() => {
        async function fetchExercises() {
            if (!category) return;
            const result = await getExercisesFull();
            const filtered = result.filter((exercise) => exercise.categoryId === category.id);
            setExercises(filtered.sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (visible) fetchExercises();
    }, [visible, category]);

    // Filter exercises based on search query
    const filteredExercises = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <ModalHeader
                        leftElement={<BackIcon action={onClose} />}
                        centreElement={<ModalHeaderTitle title="Select Exercise" />}
                        rightElement={<PlusIcon action={onAddExercise} />}
                    />

                    {/* Search Bar */}
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    {/* Exercise List */}
                    <FlatList
                        data={filteredExercises}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.exerciseItem} onPress={() => onSelectExercise(item)}>
                                <Text style={styles.exerciseText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
}

// **Styles**
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        width: "85%",
        borderRadius: 10,
        elevation: 5,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
        borderRadius: 8,
        padding: theme.spacing.medium,
        marginVertical: theme.spacing.medium,
    },
    exerciseItem: {
        paddingVertical: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.inputBorder,
    },
    exerciseText: {
        fontSize: 16,
        color: theme.colors.text,
    },
});
