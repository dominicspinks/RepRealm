import { StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

interface ModalHeaderProps {
    title: string
}

export default function ModalHeaderTitle({ title }: ModalHeaderProps) {
    return (
        <Text style={styles.modalTitle}>{title}</Text>
    )
}

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
    },
})