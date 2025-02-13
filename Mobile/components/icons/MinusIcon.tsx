import { ViewStyle, TextStyle } from "react-native";
import Icon from "./Icon";

type MinusIconProps = {
    action: () => void,
    style?: ViewStyle | TextStyle | null
}

export default function MinusIcon({ action, style }: MinusIconProps) {
    return (
        <Icon icon="remove" action={action} style={style} />
    )
}