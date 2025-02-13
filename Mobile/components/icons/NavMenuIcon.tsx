import { DrawerActions, useNavigation } from "@react-navigation/native";
import Icon from "./Icon";

export default function NavMenuIcon() {
    const navigation = useNavigation();

    return (
        <Icon icon="menu" action={() => navigation.dispatch(DrawerActions.openDrawer())} />
    )
}