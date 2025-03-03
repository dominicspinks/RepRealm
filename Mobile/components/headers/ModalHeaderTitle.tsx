import { StyleSheet, Text } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { useColourTheme } from "../../contexts/ThemeContext";

interface ModalHeaderProps {
    title: string
}

export default function ModalHeaderTitle({ title }: ModalHeaderProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <Text style={styles.modalTitle}>{title}</Text>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
    },
})