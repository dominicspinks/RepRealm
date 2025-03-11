import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { useColourTheme } from "../../contexts/ThemeContext";
import CheckboxIcon from "../icons/CheckboxIcon";

interface CheckboxProps {
    checked: boolean;
    onPress: () => void;
    text?: string | null;
    style?: ViewStyle | TextStyle;
}

export default function Checkbox({ checked, onPress, text = null, style }: CheckboxProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, style]} >
            <CheckboxIcon checked={checked} />
            {text && <Text style={styles.text}>{text}</Text>}
        </TouchableOpacity>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    text: {
        fontSize: 16,
        marginLeft: 10,
        color: colors.text.primary,
    },
});
