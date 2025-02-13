import { TextStyle, ViewStyle } from "react-native";
import Icon from "./Icon";

type OptionsIconProps = {
    style?: ViewStyle | TextStyle | null
}

export default function OptionsIcon({ style }: OptionsIconProps) {
    return (
        <Icon icon="ellipsis-vertical" clickable={false} style={style} />
    )
}