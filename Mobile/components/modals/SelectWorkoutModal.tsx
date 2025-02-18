import { useEffect, useState } from "react";
import { Modal, View, Text, FlatList, StyleSheet } from "react-native";
import { theme } from "../../theme";
import { Category, WorkoutWithExercises } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";
import FilterIcon from "../icons/FilterIcon";
import { getWorkoutsWithExercises } from "../../services/workoutsService";
import WorkoutCard from "../cards/WorkoutCard";
import ModalSearchField from "../forms/ModalSearchField";
import FilterModal from "./FilterModal";
import { getCategories } from "../../services/categoriesService";
import ModalContainer from "./ModalContainer";
import React from "react";

interface SelectWorkoutModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectWorkout: (workout: WorkoutWithExercises) => void;
    excludeWorkouts?: string[];
}

export default function SelectWorkoutModal({ visible, onClose, onSelectWorkout, excludeWorkouts = [] }: SelectWorkoutModalProps) {
    const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutWithExercises[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (visible) {
            fetchWorkouts();
            fetchCategories();
        }
    }, [visible]);

    async function fetchWorkouts() {
        const result = await getWorkoutsWithExercises();
        const sortedWorkouts = result.sort((a, b) => a.name.localeCompare(b.name));
        setWorkouts(sortedWorkouts);
        applyFilters(sortedWorkouts, searchQuery, selectedCategories);
    }

    async function fetchCategories() {
        const result = await getCategories();
        setCategories(result.sort((a, b) => a.name.localeCompare(b.name)));
    }

    function handleSearch(text: string) {
        setSearchQuery(text);
        applyFilters(workouts, text, selectedCategories);
    }

    function handleFilterUpdate(newSelectedCategories: string[]) {
        setSelectedCategories(newSelectedCategories);
        applyFilters(workouts, searchQuery, newSelectedCategories);
    }

    function applyFilters(allWorkouts: WorkoutWithExercises[], searchText: string, categoryFilter: string[]) {
        const filtered = allWorkouts.filter(workout => {
            const matchesSearch = workout.name.toLowerCase().includes(searchText.toLowerCase());
            const matchesCategory = categoryFilter.length === 0 || workout.exercises.some(ex => categoryFilter.includes(ex.categoryId));
            const excludes = excludeWorkouts.includes(workout.id);
            return matchesSearch && matchesCategory && !excludes;
        });
        setFilteredWorkouts(filtered);
    }

    return (
        <ModalContainer
            visible={visible}
            header={
                <ModalHeader
                    leftElement={<BackIcon action={onClose} />}
                    centreElement={<ModalHeaderTitle title="Select Workout" />}
                    rightElement={<FilterIcon action={() => setFilterModalOpen(true)} />}
                />
            }
            scrollable={false}
            content={
                <>
                    {/* Search Bar */}
                    <ModalSearchField
                        placeholder="Search workouts..."
                        value={searchQuery}
                        handleSearch={handleSearch}
                    />

                    {/* Workouts List */}
                    <FlatList
                        data={filteredWorkouts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <WorkoutCard workout={item} collapsible={false} selectable onSelect={() => onSelectWorkout(item)} editable={false} deletable={false} variant={"embedded"} />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No workouts found.</Text>}
                    />

                </>
            }
            modals={
                <>
                    <FilterModal
                        visible={filterModalOpen}
                        onClose={() => setFilterModalOpen(false)}
                        categories={categories}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={handleFilterUpdate}
                    />
                </>
            }
        />
    );
}

// **Styles**
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        paddingVertical: 20,
        width: "85%",
        borderRadius: 10,
        elevation: 5,
        maxHeight: "80%",
    },
    searchBar: {
        backgroundColor: theme.colors.inputBackgroundDark,
        padding: 10,
        borderRadius: 0,
        marginVertical: 10,
        fontSize: 16,
    },
    emptyText: {
        textAlign: "center",
        marginTop: theme.spacing.large,
        color: theme.colors.mutedText,
    },
});
