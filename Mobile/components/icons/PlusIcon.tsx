import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { theme } from "../theme";

type PlusIconProps = {
    action: () => void
}

export default function PlusIcon({ action }: PlusIconProps) {
    return (
        <TouchableOpacity onPress={action}>
            <Ionicons name="add" size={24} color={theme.colors.text} />
        </TouchableOpacity>
    )
}