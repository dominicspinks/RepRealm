import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import OptionsIcon from "./icons/OptionsIcon";
import { useColourTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../theme";
import { StyleSheet } from "react-native";

interface MenuListProps {
    options: { label: string, onPress: () => void }[]
}

export default function MenuList({ options }: MenuListProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <Menu>
            <MenuTrigger children={<OptionsIcon style={styles.menuIcon} />} />
            <MenuOptions>
                {options.map((option) => (
                    <MenuOption key={option.label} onSelect={option.onPress} text={option.label} />
                ))}
            </MenuOptions>
        </Menu>
    )
}


const createStyles = (colors: ThemeColors) => StyleSheet.create({
    menuIcon: {
        color: colors.text.primary,
    }
})