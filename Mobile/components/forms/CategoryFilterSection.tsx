import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { Category } from "../../db/schema";
import FilterTypeHeader from "../headers/FilterTypeHeader";
import { useColourTheme } from "../../contexts/ThemeContext";
import Checkbox from "./Checkbox";

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
        <View>
            <FilterTypeHeader label="Categories" isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />

            {isExpanded && (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Checkbox checked={tempSelected.includes(item.id)} onPress={() => toggleCategory(item.id)} text={item.name} />
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
        maxHeight: 300
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    categoryText: {
        fontSize: 16,
        marginLeft: 10,
        color: colors.text.primary,
    },
});
