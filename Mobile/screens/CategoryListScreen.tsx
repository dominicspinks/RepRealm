import { useState, useEffect, useCallback } from "react";
import { FlatList, Text, StyleSheet, Pressable } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import SetCategoryModal from "../components/modals/SetCategoryModal";
import { getCategories } from "../services/categoriesService";
import { theme } from "../theme";
import { CategoryWithColour } from "../db/schema";
import CategoryCard from "../components/cards/CategoryCard";
import { useFocusEffect } from "@react-navigation/native";

export default function CategoryListScreen() {
    const [categories, setCategories] = useState<CategoryWithColour[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithColour | null>(null);

    // **Fetch categories when screen loads**
    useEffect(() => {
        async function fetchCategories() {
            const result = await getCategories();
            setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
        }

        fetchCategories();
    }, [modalVisible]);

    // **Close menu when switching tabs**
    useFocusEffect(
        useCallback(() => {
            setOpenMenuId(null);
        }, [])
    );

    function openAddCategory() {
        setSelectedCategory(null);
        setModalVisible(true);
    }

    function openEditCategory(category: CategoryWithColour) {
        setSelectedCategory(category);
        setModalVisible(true);
    }

    function openDeleteCategory(category: CategoryWithColour) {
        console.log("Delete category", category);
    }

    function closeModal() {
        console.log("Close modal");
        setSelectedCategory(null);
        setModalVisible(false);
    }

    return (
        <Pressable style={{ flex: 1 }} onPress={() => setOpenMenuId(null)} >
            {/* Header */}
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Categories" />}
                rightElement={<PlusIcon action={openAddCategory} />}
            />

            {/* Category List */}
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CategoryCard
                        item={item}
                        isOpen={openMenuId === item.id}
                        onEdit={openEditCategory}
                        onDelete={openDeleteCategory}
                        setOpenMenuId={setOpenMenuId} />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No categories found.</Text>}
            />

            {/* Set Category Modal */}
            <SetCategoryModal
                visible={modalVisible}
                onClose={closeModal}
                category={selectedCategory}
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
});
