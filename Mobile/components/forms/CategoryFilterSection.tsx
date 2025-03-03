import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { Category } from "../../db/schema";
import { Ionicons } from "@expo/vector-icons";
import FilterTypeHeader from "../headers/FilterTypeHeader";
import { useColourTheme } from "../../contexts/ThemeContext";

interface CategoryFilterSectionProps {
    categories: Category[];
    toggleCategory: (categoryId: string) => void;
    tempSelected: string[];
    expanded?: boolean;
}

export default function CategoryFilterSection({ categories, toggleCategory, tempSelected, expanded = true }: CategoryFilterSectionProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [isExpanded, setIsExpanded] = useState(expanded);

    return (
        <View key={"categoryFilter"}>
            <FilterTypeHeader label="Categories" isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />

            {isExpanded && (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.categoryItem} onPress={() => toggleCategory(item.id)}>
                            <Ionicons
                                name={tempSelected.includes(item.id) ? "checkbox" : "square-outline"}
                                size={24}
                                color={colors.primary}
                            />
                            <Text style={styles.categoryText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.categoryList}
                />
            )}
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    categoryList: {
        paddingHorizontal: 20,
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
});
