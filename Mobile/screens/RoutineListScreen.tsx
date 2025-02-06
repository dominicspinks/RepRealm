import { View } from "react-native";
import NavMenuIcon from "../components/NavMenuIcon";
import PlusIcon from "../components/PlusIcon";
import ScreenHeader from "../components/ScreenHeader";
import ScreenHeaderTitle from "../components/ScreenHeaderTitle";

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