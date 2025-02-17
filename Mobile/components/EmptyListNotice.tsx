import { StyleSheet, Text } from "react-native";
import { theme } from "../theme";

interface EmptyListNoticeProps {
    text: string;
}

export default function EmptyListNotice({ text }: EmptyListNoticeProps) {
    return (
        <Text style={styles.text}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        marginTop: theme.spacing.large,
        color: theme.colors.mutedText,
    },

})