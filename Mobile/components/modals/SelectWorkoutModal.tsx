import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { theme } from "../../theme";
import { WorkoutWithExercises } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";
import FilterIcon from "../icons/FilterIcon";
import { getWorkoutsWithExercises } from "../../services/workoutsService";
import WorkoutCard from "../cards/WorkoutCard";
import ModalSearchField from "../forms/ModalSearchField";
import FilterModal from "./FilterModal";
import ModalContainer from "./ModalContainer";
import React from "react";
import { getRoutineWorkoutsByRoutineId } from "../../services/routinesService";
import EmptyListNotice from "../EmptyListNotice";

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
    const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            fetchWorkouts();
        }
    }, [visible]);

    async function fetchWorkouts() {
        const result = await getWorkoutsWithExercises();
        const sortedWorkouts = result.sort((a, b) => a.name.localeCompare(b.name));
        setWorkouts(sortedWorkouts);
        applyFilters(sortedWorkouts, searchQuery, selectedCategories, selectedRoutine);
    }

    function handleSearch(text: string) {
        setSearchQuery(text);
        applyFilters(workouts, text, selectedCategories, selectedRoutine);
    }

    function handleFilterUpdate(newSelectedCategories: string[]) {
        setSelectedCategories(newSelectedCategories);
        applyFilters(workouts, searchQuery, newSelectedCategories, selectedRoutine);
    }

    async function applyFilters(allWorkouts: WorkoutWithExercises[], searchText: string, categoryFilter: string[], selectedRoutine: string | null) {
        // Get workouts from routine
        let workoutsFilteredByRoutine: string[] = [];
        if (selectedRoutine) {
            const rows = await getRoutineWorkoutsByRoutineId(selectedRoutine);
            workoutsFilteredByRoutine = rows.map(row => row.workoutId);
        }

        const filtered = allWorkouts.filter(workout => {
            const matchesSearch = workout.name.toLowerCase().includes(searchText.toLowerCase());
            const matchesCategory = categoryFilter.length === 0 || workout.exercises.some(ex => categoryFilter.includes(ex.categoryId));

            const matchesRoutine = selectedRoutine ? workoutsFilteredByRoutine.includes(workout.id) : true;
            const excludes = excludeWorkouts.includes(workout.id);
            return matchesSearch && matchesCategory && matchesRoutine && !excludes;
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
            onClose={onClose}
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
                        ListEmptyComponent={<EmptyListNotice text="No workouts found" />}
                    />

                </>
            }
            modals={
                <>
                    <FilterModal
                        visible={filterModalOpen}
                        onClose={() => setFilterModalOpen(false)}
                        routineFilter={{
                            selected: selectedRoutine,
                            setSelected: setSelectedRoutine,
                            position: 1
                        }}
                        categoryFilter={{
                            selected: selectedCategories,
                            setSelected: handleFilterUpdate,
                            position: 2
                        }}
                    />
                </>
            }
        />
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
