import { ViewStyle, TextStyle } from "react-native";
import Icon from "./Icon";

type SearchIconProps = {
    style?: ViewStyle | TextStyle | null
}

export default function SearchIcon({ style }: SearchIconProps) {
    return (
        <Icon icon="search" clickable={false} style={style} />
    )
}