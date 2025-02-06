import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { theme } from "../theme";

export default function NavMenuIcon() {

    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <FontAwesome name="bars" size={24} color={theme.colors.text} />
        </TouchableOpacity>
    )
}