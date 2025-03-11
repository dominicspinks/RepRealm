import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../buttons/Button";
import { Category, Routine } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import BackIcon from "../icons/BackIcon";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import ModalContainer from "./ModalContainer";
import { getCategories } from "../../services/categoriesService";
import CategoryFilterSection from "../forms/CategoryFilterSection";
import RoutineFilterSection from "../forms/RoutineFilterSection";
import { getRoutines } from "../../services/routinesService";
import { useColourTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../theme";

interface FilterProps<T> {
    selected: T;                        // Selected value(s)
    setSelected: (selected: T) => void; // Function to update selected value(s)
    position?: number;                   // Order in which filters appear
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    categoryFilter?: FilterProps<string[]> | null;
    routineFilter?: FilterProps<string | null>;
}

export default function FilterModal({
    visible,
    onClose,
    categoryFilter = null,
    routineFilter
}: FilterModalProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [tempSelectedCategory, setTempSelectedCategory] = useState<string[]>(categoryFilter?.selected ?? []);
    const [tempSelectedRoutine, setTempSelectedRoutine] = useState<string | null>(routineFilter?.selected ?? null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        if (!visible) return;
        if (categoryFilter) loadCategories();
        if (routineFilter) loadRoutines();
    }, [visible]);

    async function loadCategories() {
        const result = await getCategories();
        setCategories(result);
    }

    async function loadRoutines() {
        const result = await getRoutines();
        setRoutines(result);
    }

    function toggleCategory(categoryId: string) {
        setTempSelectedCategory(prev =>
            prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
        );
    }

    function applyFilter() {
        if (categoryFilter) categoryFilter.setSelected(tempSelectedCategory);
        if (routineFilter && tempSelectedRoutine) routineFilter.setSelected(tempSelectedRoutine);
        onClose();
    }

    function resetFilter() {
        if (categoryFilter) {
            setTempSelectedCategory([]);
            categoryFilter.setSelected([]);
        }
        if (routineFilter) {
            setTempSelectedRoutine(null);
            routineFilter.setSelected(null);
        }
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
                <View style={styles.filterList}>
                    {[
                        routineFilter && {
                            component: (
                                <RoutineFilterSection
                                    key="routineFilter"
                                    selectedValue={tempSelectedRoutine}
                                    setValue={setTempSelectedRoutine}
                                    routines={routines}
                                />
                            ),
                            position: routineFilter.position ?? 0,
                        },
                        categoryFilter && {
                            component: (
                                <CategoryFilterSection
                                    key="categoryFilter"
                                    categories={categories}
                                    toggleCategory={toggleCategory}
                                    tempSelected={tempSelectedCategory}
                                />
                            ),
                            position: categoryFilter.position ?? 0,
                        },
                    ]
                        .filter((item): item is { key: string; component: JSX.Element; position: number } => Boolean(item))
                        .sort((a, b) => a.position - b.position)
                        .map((item) => item.component)
                    }
                </View>
            }
            buttons={
                [
                    <Button title="Reset" variant="secondary" onPress={resetFilter} style={styles.button} />,
                    <Button title="Apply" onPress={applyFilter} style={styles.button} />
                ]}
        />
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    filterList: {
        flexDirection: "column",
        gap: 10,
    },
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
