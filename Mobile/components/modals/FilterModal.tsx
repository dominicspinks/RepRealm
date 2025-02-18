import React, { useState } from "react";
import { Text, TouchableOpacity, FlatList, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../buttons/Button";
import { theme } from "../../theme";
import { Category } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import BackIcon from "../icons/BackIcon";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import ModalContainer from "./ModalContainer";

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
        <ModalContainer
            visible={visible}
            header={
                <ModalHeader
                    leftElement={<BackIcon action={onClose} />}
                    centreElement={<ModalHeaderTitle title="Filter" />}
                />
            }
            onClose={onClose}
            scrollable={false}
            content={
                <View style={styles.categoryList}>
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
                </View>
            }
            button1={<Button title="Reset" variant="secondary" onPress={resetFilter} style={styles.button} />}
            button2={<Button title="Apply" onPress={applyFilter} style={styles.button} />}
        />
    );
}

// **Styles**
const styles = StyleSheet.create({
    categoryList: {
        paddingHorizontal: 20,
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
    button: {
        padding: 10,
        width: "48%",
    },
});
