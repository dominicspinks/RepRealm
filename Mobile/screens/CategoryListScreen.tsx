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
import LoadingIndicator from "../components/LoadingIndicator";
import { useColourTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../theme";

export default function CategoryListScreen() {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [categories, setCategories] = useState<CategoryWithColour[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithColour | null>(null);
    const [loading, setLoading] = useState(true);

    // **Fetch categories when screen loads**
    useEffect(() => {
        setLoading(true);
        fetchCategories();
        setLoading(false);
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
        <View style={styles.page} >
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Categories" />}
                rightElement={<PlusIcon action={openAddCategory} />}
            />
            {loading && <LoadingIndicator />}

            {!loading &&
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
                />}

            <SetCategoryModal
                visible={modalVisible}
                onClose={closeModal}
                category={selectedCategory}
            />
        </View>
    );
}


const createStyles = (colors: ThemeColors) => StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.background.screen,
    },
});