import { ViewStyle, TextStyle } from "react-native";
import Icon from "./Icon";

type PlusIconProps = {
    action: () => void,
    style?: ViewStyle | TextStyle | null
}

export default function PlusIcon({ action, style }: PlusIconProps) {
    return (
        <Icon icon="add" action={action} style={style} />
    )
}