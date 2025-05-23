import { Text, View, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme, ThemeColors } from "../../theme";
import { useColourTheme } from "../../contexts/ThemeContext";

interface DropdownFieldInputProps<T> {
    selectedValue: string | null;
    setValue: (value: string) => void;
    items: T[];
    labelField: keyof T;
    valueField: keyof T;
    placeholder: string;
    label?: string;
    style?: ViewStyle | TextStyle;
    disabled?: boolean;
}

export default function DropdownFieldInput<T>({
    selectedValue,
    setValue,
    items,
    labelField,
    valueField,
    placeholder,
    label,
    style,
    disabled = false
}: DropdownFieldInputProps<T>) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={[styles.dropdownContainer, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.dropdown}>
                <Picker
                    selectedValue={selectedValue ?? ""}
                    onValueChange={setValue}
                    style={styles.picker}
                    enabled={!disabled}
                >
                    <Picker.Item label={placeholder} value={null} />
                    {items.map((item) => (
                        <Picker.Item
                            key={String(item[valueField])}
                            label={String(item[labelField])}
                            value={String(item[valueField])}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    dropdownContainer: {
        marginBottom: theme.spacing.medium,
        width: "100%"
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        color: colors.text.primary,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: colors.border.input,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: colors.background.inputField,
    },
    picker: {
        height: 55,
        width: "100%",
    },
});
