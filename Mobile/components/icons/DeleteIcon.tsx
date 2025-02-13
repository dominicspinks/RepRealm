import { ViewStyle, TextStyle } from "react-native";
import Icon from "./Icon";

type DeleteIconProps = {
    action: () => void,
    style?: ViewStyle | TextStyle | null
}

export default function DeleteIcon({ action, style }: DeleteIconProps) {
    return (
        <Icon icon="trash-bin" action={action} style={style} />
    )
}