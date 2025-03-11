import { View, TextInput, StyleSheet } from "react-native";
import { theme, ThemeColors } from "../../theme";
import SearchIcon from "../icons/SearchIcon";
import { useColourTheme } from "../../contexts/ThemeContext";

interface ModalSearchFieldProps {
    placeholder: string;
    value: string;
    handleSearch: (text: string) => void;
}

export default function ModalSearchField({ placeholder, value, handleSearch }: ModalSearchFieldProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.searchContainer} >
            <SearchIcon />
            <TextInput
                style={styles.searchBar}
                placeholder={placeholder}
                placeholderTextColor={colors.text.primary}
                value={value}
                onChangeText={handleSearch}
            />
        </View>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: colors.background.inputModalSearch,
        padding: 10,
        borderRadius: 0,
        marginVertical: 10,
    },
    searchBar: {
        fontSize: 16,
        color: colors.text.primary,
    },
});