import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../../styles/Color";

interface Props {
    value: Date | undefined;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: Date) => void;
}

const ReserveDatePicker = (props: Props) => {
    const options = [];
    const i = new Date();
    for (let n = 0; n < 14; n++) {
        const j = new Date();
        j.setTime(i.getTime());
        options.push(j);
        i.setDate(i.getDate() + 1);
    }

    return (
        <ScrollView horizontal style={{ paddingHorizontal: 12 }}>
            {options.map((option) => (
                <TouchableOpacity key={option.getTime()} onPress={() => props.onChange(option)}>
                    <View style={{ alignItems: "center", marginHorizontal: 8, marginVertical: 18 }}>
                        <View
                            style={{
                                width: 42,
                                padding: 6,
                                backgroundColor: props.value && option.getDate() === props.value.getDate() ? Color.primary : Color.dark5,
                                borderRadius: 8,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    textAlign: "center",
                                    color: props.value && option.getDate() === props.value.getDate() ? "black" : "white",
                                }}
                            >
                                {(option.getMonth() + 1).toString() + "月"}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    textAlign: "center",
                                    color: props.value && option.getDate() === props.value.getDate() ? "black" : "white",
                                }}
                            >
                                {option.getDate()}
                            </Text>
                        </View>

                        <Text style={{ fontSize: 12, textAlign: "center", color: "white", marginTop: 6 }}>
                            {option.getDate() === new Date().getDate() ? "今天" : ""}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default ReserveDatePicker;
