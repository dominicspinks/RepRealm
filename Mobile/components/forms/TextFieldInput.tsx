import { StyleSheet, Text, View, TextInput, TextStyle, ViewStyle } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { useColourTheme } from "../../contexts/ThemeContext";

interface TextInputProps {
    setValue: (value: string) => void;
    value: string;
    placeholder: string;
    label?: string;
    style?: ViewStyle | TextStyle;
    keyboardType?: "default" | "numeric"
    disabled?: boolean
}

export default function TextFieldInput({ keyboardType, setValue, placeholder, label, value, style, disabled = false }: TextInputProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={style}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                keyboardType={keyboardType ?? "default"}
                value={value}
                onChangeText={setValue}
                editable={!disabled}
            />
        </View>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        color: colors.text,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
    },
})