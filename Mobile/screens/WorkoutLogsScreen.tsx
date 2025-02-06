import React from 'react';
import { View, Text } from 'react-native';
import ScreenHeaderTitle from '../components/ScreenHeaderTitle';
import NavMenuIcon from '../components/icons/NavMenuIcon';
import ScreenHeader from '../components/ScreenHeader';
import PlusIcon from '../components/icons/PlusIcon';

export default function WorkoutLogsScreen() {
    return (
        <View style={{ flex: 1 }}>
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Workout Logs" />}
                rightElement={<PlusIcon action={() => console.log(`Open create page`)} />}
            />
        </View>
    );
}
