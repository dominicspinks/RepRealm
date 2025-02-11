import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import OptionsIcon from "../icons/OptionsIcon";
import { theme } from "../../theme";
import { CategoryWithColour } from "../../db/schema";

interface CategoryCardProps {
    item: CategoryWithColour;
    isOpen: boolean; // ✅ Controlled from parent
    onEdit: (item: CategoryWithColour) => void;
    onDelete: (item: CategoryWithColour) => void;
    setOpenMenuId: (id: string | null) => void; // ✅ Function from parent to control the menu state
}

export default function CategoryCard({ item, isOpen, setOpenMenuId, onEdit, onDelete }: CategoryCardProps) {
    function toggleMenu(e: GestureResponderEvent) {
        e.stopPropagation();
        setOpenMenuId(isOpen ? null : item.id);
    }

    return (
        <View style={styles.categoryCard}>
            <View style={[styles.colourEdge, { backgroundColor: item.colourHex }]} />
            <Text style={styles.categoryName}>{item.name}</Text>

            {/* Options Button */}
            <OptionsIcon action={toggleMenu} style={styles.menuIcon} />

            {/* Options Menu (Only shows when `isOpen` is true) */}
            {isOpen && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => { setOpenMenuId(null); onEdit(item) }}>
                        <Text style={styles.menuItem}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setOpenMenuId(null); onDelete(item) }}>
                        <Text style={styles.menuItem}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    menuIcon: {
        color: theme.colors.mutedText,
        marginRight: theme.spacing.small,
    },
    menu: {
        position: "absolute",
        top: 40,
        right: 0,
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.small,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    menuItem: {
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
        fontSize: 14,
        color: theme.colors.text,
    },
});
