import { TextStyle, ViewStyle } from "react-native";
import Icon from "./Icon";

type BackIconProps = {
    action: () => void,
    style?: ViewStyle | TextStyle | null
}

export default function BackIcon({ action, style }: BackIconProps) {
    return (
        <Icon icon="arrow-back" action={action} style={style} />
    )
}