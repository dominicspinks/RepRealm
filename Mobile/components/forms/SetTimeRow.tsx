import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { splitTimeComponents } from "../../utilities/formatHelpers";
import { useColourTheme } from "../../contexts/ThemeContext";

interface SetTimeRowProps {
    value: number;
    setTime: (time: number) => void;
}

export default function SetTimeRow({ value, setTime }: SetTimeRowProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [inputHours, setInputHours] = useState("");
    const [inputMinutes, setInputMinutes] = useState("");
    const [inputSeconds, setInputSeconds] = useState("");

    useEffect(() => {
        const { hours, minutes, seconds } = splitTimeComponents(value);
        setInputHours(hours > 0 ? hours.toString() : "");
        setInputMinutes(minutes.toString().padStart(2, "0"));
        setInputSeconds(seconds.toString().padStart(2, "0"));
    }, [value]);

    // Handle raw input without applying formatting immediately
    function handleChange(setInput: (val: string) => void) {
        return (text: string) => {
            if (text === "" || /^[0-9]{0,2}$/.test(text)) {
                setInput(text);
            }
        };
    }

    // Apply formatting when user exits input field
    function handleBlur() {
        const h = inputHours === "" ? 0 : Math.max(0, parseInt(inputHours) || 0);
        const m = inputMinutes === "" ? 0 : Math.min(Math.max(parseInt(inputMinutes) || 0), 59);
        const s = inputSeconds === "" ? 0 : Math.min(Math.max(parseInt(inputSeconds) || 0), 59);

        setInputHours(h > 0 ? h.toString() : "");
        setInputMinutes(m.toString().padStart(2, "0"));
        setInputSeconds(s.toString().padStart(2, "0"));

        // Convert to milliseconds
        const totalMilliseconds = (h * 3600000) + (m * 60000) + (s * 1000);
        setTime(totalMilliseconds);
    }

    return (
        <View style={styles.timeRow}>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="hh"
                maxLength={2}
                value={inputHours}
                onFocus={() => setInputHours(inputHours || "")}
                onChangeText={handleChange(setInputHours)}
                onBlur={handleBlur}
                selectTextOnFocus={true}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="mm"
                maxLength={2}
                value={inputMinutes}
                onFocus={() => setInputMinutes(inputMinutes || "")}
                onChangeText={handleChange(setInputMinutes)}
                onBlur={handleBlur}
                selectTextOnFocus={true}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="ss"
                maxLength={2}
                value={inputSeconds}
                onFocus={() => setInputSeconds(inputSeconds || "")}
                onChangeText={handleChange(setInputSeconds)}
                onBlur={handleBlur}
                selectTextOnFocus={true}
            />
        </View>
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        width: 50,
        height: 50,
        textAlign: "center",
        fontSize: 24,
        borderWidth: 1,
        borderColor: colors.border.input,
        borderRadius: 5,
        color: colors.text.primary,
        backgroundColor: colors.background.inputField,
    },
    separator: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 5,
        color: colors.text.primary,
    },
});
