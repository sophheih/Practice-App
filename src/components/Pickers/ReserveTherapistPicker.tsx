import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Therapist } from "../../models/definitions";
import { Color } from "../../styles/Color";

interface Props {
    value: Therapist | undefined;
    options: Therapist[];
    // eslint-disable-next-line no-unused-vars
    onChange: (value: Therapist | undefined) => void;
    loading: boolean;
}

const ReserveTherapistPicker = (props: Props) => {
    if (props.loading) {
        return <Text style={{ color: Color.light6, margin: 18 }}>讀取按摩師列表中 ...</Text>;
    }

    if (props.options.length === 0) {
        return <Text style={{ color: Color.light6, margin: 18 }}>本日無可選按摩師</Text>;
    }

    return (
        <ScrollView horizontal style={{ paddingHorizontal: 12 }}>
            <TouchableOpacity onPress={() => props.onChange(undefined)}>
                <View style={{ alignItems: "center", marginHorizontal: 8, marginVertical: 18 }}>
                    <View
                        style={{
                            overflow: "hidden",
                            backgroundColor: undefined === props.value ? Color.primary : Color.dark5,
                            borderRadius: 8,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                margin: 8,
                                fontWeight: "bold",
                                textAlign: "center",
                                color: undefined === props.value ? "black" : "white",
                                width: 48,
                                height: 96,
                            }}
                        >
                            系統自動分配
                        </Text>
                    </View>

                    <Text style={{ fontSize: 12, textAlign: "center", color: "white", marginTop: 6 }}></Text>
                </View>
            </TouchableOpacity>
            {props.options.map((option) => (
                <TouchableOpacity key={option.id} onPress={() => props.onChange(option)}>
                    <View style={{ alignItems: "center", marginHorizontal: 8, marginVertical: 18 }}>
                        <View
                            style={{
                                overflow: "hidden",
                                backgroundColor: option === props.value ? Color.primary : Color.dark5,
                                borderRadius: 8,
                            }}
                        >
                            <Image
                                style={{
                                    width: 64,
                                    height: 82,
                                }}
                                source={{ uri: option.image_url }}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    margin: 8,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    color: option === props.value ? "black" : "white",
                                }}
                            >
                                {option.name}
                            </Text>
                        </View>

                        <Text style={{ fontSize: 12, textAlign: "center", color: "white", marginTop: 6 }}></Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default ReserveTherapistPicker;
