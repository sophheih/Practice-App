import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../../styles/Color";
import timeToString from "../../utils/timeToString";

interface Props {
    options: Date[];
    value: Date | undefined;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: Date) => void;
    loading: boolean;
}

const ReserveTimePicker = (props: Props) => {
    if (props.loading) return <Text style={{ color: Color.light6, margin: 18 }}>讀取中 ...</Text>;

    if (props.options.length === 0) return <Text style={{ color: Color.light6, margin: 18 }}>尚未選擇日期或本日無可預約時段</Text>;

    return (
        <ScrollView horizontal>
            {props.options.map((option) => (
                <TouchableOpacity key={option.getTime()} onPress={() => props.onChange(option)}>
                    <View style={{ alignItems: "center", marginHorizontal: 8, marginVertical: 18 }}>
                        <View
                            style={{
                                width: 10,
                                height: 36,
                                backgroundColor: props.value && option.getTime() === props.value.getTime() ? Color.primary : Color.light6,
                                borderRadius: 4,
                            }}
                        />
                        <Text style={{ color: "white", marginTop: 6 }}>{timeToString(option)}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default ReserveTimePicker;
