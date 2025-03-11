import { StyleSheet, Text } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { useColourTheme } from "../../contexts/ThemeContext";

export default function ScreenHeaderTitle({ title }: { title: string }) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <Text style={styles.title}>{title}</Text>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
});