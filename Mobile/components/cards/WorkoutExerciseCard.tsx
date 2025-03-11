import { View, StyleSheet } from "react-native";
import { theme, ThemeColors } from "../../theme";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import { WorkoutExerciseWithSets } from "../../db/schema";
import ExerciseWithSets from "../ExerciseWithSets";
import { useColourTheme } from "../../contexts/ThemeContext";

interface WorkoutExerciseCardProps {
    item: WorkoutExerciseWithSets;
    onEdit: (exercise: WorkoutExerciseWithSets) => void;
    onDelete: (exercise: WorkoutExerciseWithSets) => void;
}

export default function WorkoutExerciseCard({ item, onEdit, onDelete }: WorkoutExerciseCardProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.card}>
            {/* Category Colour Indicator */}
            <View style={[styles.colourEdge, { backgroundColor: item.categoryColour }]} />

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <ExerciseWithSets
                    exercise={item}
                />

                <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                    {/* Delete Button (Top Right) */}
                    <DeleteIcon action={() => onDelete(item)} />

                    {/* Spacer to push edit icon to bottom */}
                    <View style={{ flex: 1 }} />

                    {/* Edit Button (Bottom Right) */}
                    <EditIcon action={() => onEdit(item)} />
                </View>
            </View>
        </View>
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    card: {
        flexDirection: "column",
        backgroundColor: colors.background.card,
        borderRadius: theme.cards.borderRadius,
        marginVertical: theme.spacing.small,
        marginHorizontal: theme.spacing.medium,
        padding: theme.spacing.medium,
        elevation: 2,
    },
    colourEdge: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 10,
        borderTopLeftRadius: theme.cards.borderRadius,
        borderBottomLeftRadius: theme.cards.borderRadius,
    },
});
