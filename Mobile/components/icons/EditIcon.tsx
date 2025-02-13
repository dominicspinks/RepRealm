import { ViewStyle, TextStyle } from "react-native";
import Icon from "./Icon";

interface EditIconProps {
    action: () => void,
    style?: ViewStyle | TextStyle | null
}

export default function EditIcon({ action, style }: EditIconProps) {
    return (
        <Icon icon="pencil" action={action} style={style} />
    )
}