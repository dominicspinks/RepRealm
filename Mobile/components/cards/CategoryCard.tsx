import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme";
import { CategoryWithColour } from "../../db/schema";
import MenuList from "../MenuList";

interface CategoryCardProps {
    item: CategoryWithColour;
    onEdit: (item: CategoryWithColour) => void;
    onDelete: (itemId: string) => void;
}

export default function CategoryCard({ item, onEdit, onDelete }: CategoryCardProps) {
    return (
        <View style={styles.categoryCard}>
            <View style={[styles.colourEdge, { backgroundColor: item.colourHex }]} />
            <Text style={styles.categoryName}>{item.name}</Text>

            {/* Options Menu */}
            <MenuList options={[
                { label: "Edit", onPress: () => { onEdit(item) } },
                { label: "Delete", onPress: () => { onDelete(item.id) } }
            ]} />
        </View>
    );
}

// **Styles**
const styles = StyleSheet.create({
    categoryCard: {
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
    categoryName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text,
        margin: theme.spacing.small,
    },
});
