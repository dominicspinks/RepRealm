import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../buttons/Button";
import { theme } from "../../theme";
import { Category } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import BackIcon from "../icons/BackIcon";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    categories: Category[];
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}

export default function FilterModal({
    visible,
    onClose,
    categories,
    selectedCategories,
    setSelectedCategories
}: FilterModalProps) {
    const [tempSelected, setTempSelected] = useState<string[]>(selectedCategories);

    function toggleCategory(categoryId: string) {
        setTempSelected(prev =>
            prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
        );
    }

    function applyFilter() {
        setSelectedCategories(tempSelected);
        onClose();
    }

    function resetFilter() {
        setTempSelected([]);
        setSelectedCategories([]);
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <ModalHeader
                        leftElement={<BackIcon action={onClose} />}
                        centreElement={<ModalHeaderTitle title="Filter" />}
                    />

                    {/* Category List */}
                    <Text style={styles.label}>Category</Text>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.categoryItem} onPress={() => toggleCategory(item.id)}>
                                <Ionicons
                                    name={tempSelected.includes(item.id) ? "checkbox" : "square-outline"}
                                    size={24}
                                    color={theme.colors.primary}
                                />
                                <Text style={styles.categoryText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <Button title="Reset" variant="secondary" onPress={resetFilter} style={styles.button} />
                        <Button title="Apply" onPress={applyFilter} style={styles.button} />
                    </View>
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
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    categoryText: {
        fontSize: 16,
        marginLeft: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        padding: 10,
        width: "48%",
    },
});
