import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme";
import { ExerciseFull } from "../../db/schema";
import MenuList from "../MenuList";

interface ExerciseCardProps {
    item: ExerciseFull;
    onEdit: (item: ExerciseFull) => void;
    onDelete: (item: ExerciseFull) => void;
}

export default function ExerciseCard({ item, onEdit, onDelete }: ExerciseCardProps) {
    return (
        <View style={styles.exerciseCard}>
            {/* Category Colour Indicator */}
            <View style={[styles.colourEdge, { backgroundColor: item.categoryColour }]} />

            {/* Exercise Name */}
            <Text style={styles.exerciseName}>{item.name}</Text>

            {/* Options Menu */}
            <MenuList options={[
                { label: "Edit", onPress: () => { onEdit(item) } },
                { label: "Delete", onPress: () => { onDelete(item) } }
            ]} />
        </View>
    );
}

// **Styles**
const styles = StyleSheet.create({
    exerciseCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.cardBackground,
        padding: 0,
        borderRadius: theme.cards.borderRadius,
        marginVertical: theme.spacing.small,
        marginHorizontal: theme.spacing.medium,
        elevation: 2,
    },
    colourEdge: {
        width: 15,
        height: "100%",
        borderTopLeftRadius: theme.cards.borderRadius,
        borderBottomLeftRadius: theme.cards.borderRadius,
        marginRight: theme.spacing.medium,
    },
    exerciseName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text,
        margin: theme.spacing.small,
    },
});
