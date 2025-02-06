import { Text } from "react-native";
import { theme } from "../theme";

export default function ScreenHeaderTitle({ title }: { title: string }) {
    return (
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>{title}</Text>
    )
}