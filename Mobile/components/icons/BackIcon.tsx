import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { theme } from "../../theme";

type BackIconProps = {
    action: () => void
}

export default function BackIcon({ action }: BackIconProps) {
    return (
        <TouchableOpacity onPress={action}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
    )
}