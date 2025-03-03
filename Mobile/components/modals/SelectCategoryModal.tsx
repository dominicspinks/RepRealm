import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { CategoryWithColour } from "../../db/schema";
import { getCategories } from "../../services/categoriesService";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";
import PlusIcon from "../icons/PlusIcon";
import ModalContainer from "./ModalContainer";
import ModalSearchField from "../forms/ModalSearchField";
import SetCategoryModal from "./SetCategoryModal";
import EmptyListNotice from "../EmptyListNotice";
import { useColourTheme } from "../../contexts/ThemeContext";

interface SelectCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectCategory: (category: CategoryWithColour) => void;
}

export default function SelectCategoryModal({ visible, onClose, onSelectCategory }: SelectCategoryModalProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [categories, setCategories] = useState<CategoryWithColour[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);

    // Fetch categories when modal opens
    useEffect(() => {
        if (visible) fetchCategories();
    }, [visible]);

    async function fetchCategories() {
        const result = await getCategories();
        setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
    }

    // Filtered categories
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function handleCloseCategoryModal() {
        setCategoryModalVisible(false);
        fetchCategories();
    }

    function onAddCategory() {
        setCategoryModalVisible(true);
        fetchCategories();
    }

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
            onClose={onClose}
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
                        ListEmptyComponent={<EmptyListNotice text="No categories found." />}
                    />
                </>
            }
            modals={
                <>
                    {/* Set Category Modal */}
                    <SetCategoryModal
                        visible={categoryModalVisible}
                        onClose={handleCloseCategoryModal}
                    />
                </>
            }
        />
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
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
        color: colors.text,
    },
});
