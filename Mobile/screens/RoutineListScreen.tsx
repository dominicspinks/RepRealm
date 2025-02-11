import { View } from "react-native";
import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";

export default function RoutineListScreen() {
    return (
        <View style={{ flex: 1 }}>
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Routines" />}
                rightElement={<PlusIcon action={() => console.log(`Open create page`)} />}
            />
        </View>
    )
}