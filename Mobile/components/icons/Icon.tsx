import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { theme } from "../../theme";

type IconProps = {
    icon: keyof typeof Ionicons.glyphMap,
    action?: () => void,
    clickable?: boolean,
    size?: number,
    color?: string,
    style?: ViewStyle | TextStyle | null
}

export default function Icon({ icon, action, clickable = true, size = 24, color = theme.colors.text, style }: IconProps) {
    return (
        clickable ?
            (
                <TouchableOpacity onPress={action}>
                    <Ionicons name={icon} size={size} color={color} style={[styles.icon, style]} />
                </TouchableOpacity>
            ) : (
                <Ionicons name={icon} size={size} color={color} style={[styles.icon, style]} />
            )
    )
}

const styles = StyleSheet.create({
    icon: {
        padding: 2
    }
})