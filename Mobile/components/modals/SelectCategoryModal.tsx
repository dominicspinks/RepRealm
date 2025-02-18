import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { theme } from "../../theme";
import { CategoryWithColour } from "../../db/schema";
import { getCategories } from "../../services/categoriesService";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";
import PlusIcon from "../icons/PlusIcon";
import ModalContainer from "./ModalContainer";
import ModalSearchField from "../forms/ModalSearchField";

interface SelectCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectCategory: (category: CategoryWithColour) => void;
    onAddCategory: () => void;
}

export default function SelectCategoryModal({ visible, onClose, onSelectCategory, onAddCategory }: SelectCategoryModalProps) {
    const [categories, setCategories] = useState<CategoryWithColour[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch categories when modal opens
    useEffect(() => {
        async function fetchCategories() {
            const result = await getCategories();
            setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (visible) fetchCategories();
    }, [visible]);

    // Filtered categories
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ModalContainer
            visible={visible}
            header={
                <ModalHeader
                    leftElement={<BackIcon action={onClose} />}
                    centreElement={<ModalHeaderTitle title="Select Category" />}
                    rightElement={<PlusIcon action={onAddCategory} />}
                />
            }
            scrollable={false}
            content={
                <>
                    {/* Search Bar */}
                    <ModalSearchField placeholder="Search categories..." value={searchQuery} handleSearch={setSearchQuery} />

                    {/* Category List */}
                    <FlatList
                        data={filteredCategories}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.categoryItem} onPress={() => onSelectCategory(item)}>
                                <View style={[styles.colourIndicator, { backgroundColor: item.colourHex }]} />
                                <Text style={styles.categoryText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </>
            }
        />
    );
}

// **Styles**
const styles = StyleSheet.create({
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.inputBorder,
        paddingHorizontal: theme.spacing.medium,
    },
    colourIndicator: {
        width: 15,
        height: 15,
        borderRadius: 4,
        marginRight: theme.spacing.small,
    },
    categoryText: {
        fontSize: 16,
        color: theme.colors.text,
    },
});
