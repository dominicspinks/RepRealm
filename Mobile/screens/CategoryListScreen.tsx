import { useState, useEffect } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import SetCategoryModal from "../components/modals/SetCategoryModal";
import { deleteCategory, getCategories } from "../services/categoriesService";
import { CategoryWithColour } from "../db/schema";
import CategoryCard from "../components/cards/CategoryCard";
import EmptyListNotice from "../components/EmptyListNotice";

export default function CategoryListScreen() {
    const [categories, setCategories] = useState<CategoryWithColour[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithColour | null>(null);

    // **Fetch categories when screen loads**
    useEffect(() => {
        fetchCategories();
    }, [modalVisible]);

    async function fetchCategories() {
        const result = await getCategories();
        setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
    }

    function openAddCategory() {
        setSelectedCategory(null);
        setModalVisible(true);
    }

    function openEditCategory(category: CategoryWithColour) {
        setSelectedCategory(category);
        setModalVisible(true);
    }

    function closeModal() {
        setSelectedCategory(null);
        setModalVisible(false);
    }

    async function handleDeleteCategory(id: string) {
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category? It will also delete any exercises in this category.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteCategory(id);
                        fetchCategories();
                    },
                },
            ]
        )
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
                        onDelete={handleDeleteCategory}
                    />
                )}
                ListEmptyComponent={<EmptyListNotice text="No categories found" />}
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
});
