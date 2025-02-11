import { Ionicons } from "@expo/vector-icons";
import { GestureResponderEvent, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { theme } from "../../theme";

type OptionsIconProps = {
    action: (e: GestureResponderEvent) => void
    style?: ViewStyle | TextStyle
}

export default function OptionsIcon({ action, style }: OptionsIconProps) {
    return (
        <TouchableOpacity onPress={action}>
            <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} style={style} />
        </TouchableOpacity>
    )
}