import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme";

interface CheckboxProps {
    checked: boolean;
    onPress: () => void;
    text?: string | null;
    style?: ViewStyle | TextStyle;
}

export default function Checkbox({ checked, onPress, text = null, style }: CheckboxProps) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, style]} >
            <Ionicons
                name={checked ? "checkbox" : "square-outline"}
                size={24}
                color={theme.colors.primary}
            />
            {text && <Text style={styles.text}>{text}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    text: {
        fontSize: 16,
        marginLeft: 10,
    },
});
