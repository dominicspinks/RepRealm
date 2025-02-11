import { StyleSheet, Text, View, TextInput, TextStyle, ViewStyle } from "react-native";
import { theme } from "../../theme";

interface TextInputProps {
    setValue: (value: string) => void;
    value: string;
    placeholder: string;
    label?: string;
    style?: ViewStyle | TextStyle;
    keyboardType?: "default" | "numeric"
}

export default function TextFieldInput({ keyboardType, setValue, placeholder, label, value, style }: TextInputProps) {
    return (
        <View style={style}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                keyboardType={keyboardType ?? "default"}
                value={value}
                onChangeText={setValue}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        color: theme.colors.text,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
    },
})