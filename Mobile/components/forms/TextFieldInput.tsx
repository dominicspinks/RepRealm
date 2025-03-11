import { StyleSheet, Text, View, TextInput, TextStyle, ViewStyle } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { useColourTheme } from "../../contexts/ThemeContext";

interface TextInputProps {
    setValue: (value: string) => void;
    value: string;
    placeholder: string;
    label?: string;
    containerStyle?: ViewStyle | TextStyle;
    inputStyle?: ViewStyle | TextStyle;
    keyboardType?: "default" | "numeric"
    disabled?: boolean
}

export default function TextFieldInput({ keyboardType, setValue, placeholder, label, value, containerStyle, inputStyle, disabled = false }: TextInputProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={containerStyle}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, inputStyle]}
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
        color: colors.text.primary,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.border.input,
        padding: 10,
        marginBottom: 15,
        backgroundColor: colors.background.inputField,
    },
})