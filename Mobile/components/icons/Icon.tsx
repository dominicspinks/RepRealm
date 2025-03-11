import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { useColourTheme } from "../../contexts/ThemeContext";

type IconProps = {
    icon: keyof typeof Ionicons.glyphMap,
    action?: () => void,
    clickable?: boolean,
    size?: number,
    color?: string,
    style?: ViewStyle | TextStyle | null
}

export default function Icon({ icon, action, clickable = true, size = 24, color, style }: IconProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const iconColor = color ?? colors.text.primary;

    return (
        clickable ?
            (
                <TouchableOpacity onPress={action}>
                    <Ionicons name={icon} size={size} color={iconColor} style={[styles.icon, style]} />
                </TouchableOpacity>
            ) : (
                <Ionicons name={icon} size={size} color={iconColor} style={[styles.icon, style]} />
            )
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    icon: {
        padding: 2
    }
})