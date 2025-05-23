import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ScreenHeaderTitle from '../components/headers/ScreenHeaderTitle';
import NavMenuIcon from '../components/icons/NavMenuIcon';
import ScreenHeader from '../components/headers/ScreenHeader';
import PlusIcon from '../components/icons/PlusIcon';
import StartWorkoutModal from '../components/modals/StartWorkoutModal';
import SelectWorkoutModal from '../components/modals/SelectWorkoutModal';
import { WorkoutLogWithExercises, WorkoutWithExercises } from '../db/schema';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { createWorkoutLog, deleteWorkoutLogById, getWorkoutLogsWithExercises } from '../services/workoutLogsService';
import WorkoutLogCard from '../components/cards/WorkoutLogCard';
import EmptyListNotice from '../components/EmptyListNotice';
import { useColourTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../theme';

type WorkoutLogsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WorkoutLogs'>;

export default function WorkoutLogsScreen() {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const navigation = useNavigation<WorkoutLogsScreenNavigationProp>();
    const [startWorkoutModalOpen, setStartWorkoutModalOpen] = React.useState(false);

    const [workoutModalOpen, setWorkoutModalOpen] = React.useState(false);
    const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogWithExercises[]>([]);

    useEffect(() => {
        loadWorkoutLogs();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadWorkoutLogs();
        }, [])
    );

    async function loadWorkoutLogs() {
        const logs = await getWorkoutLogsWithExercises();
        setWorkoutLogs(logs);
    }

    function handleSelectSavedWorkout() {
        setStartWorkoutModalOpen(false);
        setWorkoutModalOpen(true);
    }

    async function handleCreateWorkout(workout?: WorkoutWithExercises) {
        const workoutLog = await createWorkoutLog(workout?.id ?? undefined);
        setWorkoutModalOpen(false);
        navigation.navigate("ActiveWorkout", { workoutLogId: workoutLog.id });
    }

    function handleCloseSelectWorkoutModal() {
        setWorkoutModalOpen(false);
        setStartWorkoutModalOpen(true);
    }

    async function handleDeleteWorkout(workoutLogId: string) {
        await deleteWorkoutLogById(workoutLogId);

        // Refresh workout logs after deletion
        setWorkoutLogs(prevLogs => prevLogs.filter(log => log.id !== workoutLogId));
    }

    return (
        <View style={styles.page}>
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Workout Logs" />}
                rightElement={<PlusIcon action={() => setStartWorkoutModalOpen(true)} />}
            />

            {/* Workout Log List */}
            <FlatList
                data={workoutLogs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <WorkoutLogCard
                        workoutLog={item}
                        onEdit={(workoutLogId) => navigation.navigate("ActiveWorkout", { workoutLogId })}
                        onDelete={handleDeleteWorkout}
                    />
                )}
                ListEmptyComponent={() => (<EmptyListNotice text="No workout logs found" />)}
            />

            {/* Modals */}
            <StartWorkoutModal
                visible={startWorkoutModalOpen}
                onClose={() => setStartWorkoutModalOpen(false)}
                handleSelectSavedWorkout={handleSelectSavedWorkout}
                handleStartNewWorkout={handleCreateWorkout}
            />

            {/* Select Workout Modal */}
            <SelectWorkoutModal
                visible={workoutModalOpen}
                onClose={handleCloseSelectWorkoutModal}
                onSelectWorkout={handleCreateWorkout}
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