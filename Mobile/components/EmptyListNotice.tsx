import { StyleSheet, Text } from "react-native";
import { theme, ThemeColors } from "../theme";
import { useColourTheme } from "../contexts/ThemeContext";

interface EmptyListNoticeProps {
    text: string;
}

export default function EmptyListNotice({ text }: EmptyListNoticeProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <Text style={styles.text}>{text}</Text>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    text: {
        textAlign: "center",
        marginTop: theme.spacing.large,
        color: colors.mutedText,
    },

})