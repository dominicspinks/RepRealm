import { Ionicons } from "@expo/vector-icons";
import { TextStyle, ViewStyle } from "react-native";
import { theme } from "../../theme";

type OptionsIconProps = {
    style?: ViewStyle | TextStyle
}

export default function OptionsIcon({ style }: OptionsIconProps) {
    return (
        <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} style={style} />
    )
}