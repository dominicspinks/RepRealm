import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, ThemeColors } from "../../theme";
import { useColourTheme } from "../../contexts/ThemeContext";

interface FilterTypeHeaderProps {
    label: string;
    isExpanded: boolean;
    onClick: () => void;
}

export default function FilterTypeHeader({ label, isExpanded, onClick }: FilterTypeHeaderProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <TouchableOpacity style={styles.headerContainer} onPress={onClick}>
            <Text style={styles.label}>{label}</Text>
            <Ionicons
                name={isExpanded ? "chevron-down" : "chevron-forward"}
                size={20}
                color={'white'}
            />
        </TouchableOpacity>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.primary,
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold",
    },
});
