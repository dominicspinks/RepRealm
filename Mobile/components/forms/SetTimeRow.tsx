import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { theme } from "../../theme";

interface SetTimeRowProps {
    value: string;
    setTime: (time: string) => void;
}

export default function SetTimeRow({ value, setTime }: SetTimeRowProps) {
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");

    // Convert milliseconds to hh:mm:ss when component mounts or value changes
    useEffect(() => {
        const totalMilliseconds = parseInt(value) || 0;
        const h = Math.floor(totalMilliseconds / 3600000);
        const m = Math.floor((totalMilliseconds % 3600000) / 60000);
        const s = Math.floor((totalMilliseconds % 60000) / 1000);

        setHours(h > 0 ? h.toString() : "");
        setMinutes(m > 0 || h > 0 ? m.toString() : "");
        setSeconds(s > 0 || m > 0 || h > 0 ? s.toString() : "");
    }, [value]);

    // Update state and convert to milliseconds
    function updateTime(newHours: string, newMinutes: string, newSeconds: string) {
        const h = newHours === "" ? 0 : Math.max(0, parseInt(newHours) || 0);
        const m = newMinutes === "" ? 0 : Math.min(Math.max(parseInt(newMinutes) || 0, 0), 59);
        const s = newSeconds === "" ? 0 : Math.min(Math.max(parseInt(newSeconds) || 0, 0), 59);

        setHours(newHours);
        setMinutes(newMinutes);
        setSeconds(newSeconds);

        const totalMilliseconds = (h * 3600000) + (m * 60000) + (s * 1000);
        setTime(totalMilliseconds.toString());
    }

    return (
        <View style={styles.timeRow}>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="hh"
                maxLength={2}
                value={hours}
                onFocus={() => setHours(hours || "")}
                onChangeText={(val) => updateTime(val, minutes, seconds)}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="mm"
                maxLength={2}
                value={minutes}
                onFocus={() => setMinutes(minutes || "")}
                onChangeText={(val) => updateTime(hours, val, seconds)}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="ss"
                maxLength={2}
                value={seconds}
                onFocus={() => setSeconds(seconds || "")}
                onChangeText={(val) => updateTime(hours, minutes, val)}
            />
        </View>
    );
}

// **Styles**
const styles = StyleSheet.create({
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
        borderColor: theme.colors.inputBorder,
        borderRadius: 5,
        color: theme.colors.text,
    },
    separator: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 5,
        color: theme.colors.text,
    },
});
