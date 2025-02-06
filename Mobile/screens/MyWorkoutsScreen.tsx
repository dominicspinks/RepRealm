import React, { useState } from 'react';
import TabNavigator from '../navigation/TabNavigator';

export default function MyWorkoutsScreen() {
    const [activeTab, setActiveTab] = useState('Workouts');

    return (
        <TabNavigator onTabChange={setActiveTab} />
    );
}
