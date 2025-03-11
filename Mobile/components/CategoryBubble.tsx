import { StyleSheet, Text, View } from "react-native";
import { ThemeColors } from "../theme";
import { useColourTheme } from "../contexts/ThemeContext";

export interface CategoryBubbleProps {
    id: string,
    colour: string,
    name: string
}

export default function CategoryBubble({ id, colour, name }: CategoryBubbleProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View key={id} style={[styles.categoryBadge, { backgroundColor: colour }]}>
            <Text style={styles.categoryText}>{name}</Text>
        </View>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    categoryBadge: {
        paddingHorizontal: 12,
        height: 24,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    categoryText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
})