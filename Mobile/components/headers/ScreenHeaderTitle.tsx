import { StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

export default function ScreenHeaderTitle({ title }: { title: string }) {
    return (
        <Text style={styles.title}>{title}</Text>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});