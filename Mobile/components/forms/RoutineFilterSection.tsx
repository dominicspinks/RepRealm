import { StyleSheet, View } from "react-native"
import DropdownFieldInput from "./DropdownFieldInput"
import { Routine } from "../../db/schema";
import { useState } from "react";
import FilterTypeHeader from "../headers/FilterTypeHeader";

interface RoutineFilterSectionProps {
    selectedValue: string | null;
    setValue: (value: string) => void;
    routines: Routine[];
    expanded?: boolean;
}

export default function RoutineFilterSection({ selectedValue, setValue, routines, expanded = true }: RoutineFilterSectionProps) {
    const [isExpanded, setIsExpanded] = useState(expanded);

    return (
        <View key="routineFilter">
            <FilterTypeHeader label="Routine" isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
            {isExpanded &&
                <DropdownFieldInput
                    selectedValue={selectedValue}
                    setValue={setValue}
                    items={routines}
                    placeholder={routines.length > 0 ? "Select a routine" : "No routines available"}
                    labelField="name"
                    valueField="id"
                    style={styles.routine}
                    disabled={routines.length === 0}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    routine: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
})