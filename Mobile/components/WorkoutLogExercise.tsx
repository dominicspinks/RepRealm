import { View, Text, FlatList, StyleProp, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { WorkoutLogExerciseWithSets, WorkoutExerciseSet, WorkoutLogExerciseSet } from "../db/schema";
import { formatSet } from "../utilities/formatHelpers";
import { theme, ThemeColors } from "../theme";
import { useColourTheme } from "../contexts/ThemeContext";

interface WorkoutLogExerciseWithSetsProps {
    exercise: WorkoutLogExerciseWithSets;
    containerStyle?: StyleProp<ViewStyle>;
    nameStyle?: StyleProp<TextStyle>;
    setTextStyle?: StyleProp<TextStyle>;
}

export default function WorkoutLogExercise({ exercise, containerStyle, nameStyle, setTextStyle }: WorkoutLogExerciseWithSetsProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Exercise Name */}
            <Text style={[styles.exerciseName, nameStyle]}>{exercise.name}</Text>

            {/* List of Sets */}
            {exercise.sets && exercise.sets.length > 0 &&
                <FlatList
                    data={exercise.sets}
                    keyExtractor={(set: WorkoutLogExerciseSet) => set.id}
                    renderItem={({ item }) => (
                        <Text style={[styles.setText, setTextStyle]}>
                            {formatSet(item, exercise)}
                        </Text>
                    )}
                />}
        </View>
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text.primary,
        marginBottom: theme.spacing.small,
    },
    setText: {
        fontSize: 14,
        color: colors.text.muted,
    },
});
