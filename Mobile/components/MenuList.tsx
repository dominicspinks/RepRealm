import { StyleSheet } from "react-native";
import { theme } from "../theme";
import React from "react";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import OptionsIcon from "./icons/OptionsIcon";

interface MenuListProps {
    options: { label: string, onPress: () => void }[]
}

export default function MenuList({ options }: MenuListProps) {
    return (
        <Menu>
            <MenuTrigger children={<OptionsIcon />} />
            <MenuOptions>
                {options.map((option) => (
                    <MenuOption key={option.label} onSelect={option.onPress} text={option.label} />
                ))}
            </MenuOptions>
        </Menu>
    )
}
