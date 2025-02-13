import { ViewStyle, TextStyle } from "react-native";
import Icon from "./Icon";

type CloseIconProps = {
    action: () => void,
    style?: ViewStyle | TextStyle | null
}

export default function CloseIcon({ action, style }: CloseIconProps) {
    return (
        <Icon icon="close" action={action} style={style} />
    )
}