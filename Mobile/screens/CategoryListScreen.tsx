import { useState, useEffect } from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import SetCategoryModal from "../components/modals/SetCategoryModal";
import { getCategories } from "../services/categoriesService";
import { theme } from "../theme";
import { CategoryWithColour } from "../db/schema";
import CategoryCard from "../components/cards/CategoryCard";

export default function CategoryListScreen() {
    const [categories, setCategories] = useState<CategoryWithColour[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithColour | null>(null);

    // **Fetch categories when screen loads**
    useEffect(() => {
        async function fetchCategories() {
            const result = await getCategories();
            setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
        }

        fetchCategories();
    }, [modalVisible]);

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
        <View style={{ flex: 1 }} >
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
                        onEdit={openEditCategory}
                        onDelete={openDeleteCategory}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No categories found.</Text>}
            />

            {/* Set Category Modal */}
            <SetCategoryModal
                visible={modalVisible}
                onClose={closeModal}
                category={selectedCategory}
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
});
