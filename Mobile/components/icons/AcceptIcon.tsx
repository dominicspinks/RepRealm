import { TextStyle, ViewStyle } from "react-native";
import Icon from "./Icon";

type AcceptIconProps = {
    action: () => void,
    style?: ViewStyle | TextStyle | null
}

export default function AcceptIcon({ action, style }: AcceptIconProps) {
    return (
        <Icon icon="checkmark" action={action} style={style} />
    )
}