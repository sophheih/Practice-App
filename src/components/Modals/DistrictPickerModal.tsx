import { Picker } from "@react-native-community/picker";
import React, { useState } from "react";
import { Alert, Platform, View } from "react-native";
import { Row } from "react-native-easy-grid";
import { Address } from "../../models/definitions";
import PrimaryButton from "../Buttons/PrimaryButton";
import Modal from "./Modal";

interface Props {
    enable: boolean;
    value: Address | undefined;
    onClose: () => void;
    // eslint-disable-next-line no-unused-vars
    onChange: (data: Address | undefined) => void;
}

const DistricPickerModal = (props: Props) => {
    const [city, setCity] = useState(props.value?.city);
    const [district, setDistrict] = useState(props.value?.district);

    const options = [
        { city: "台北市", districts: ["松山區", "大安區", "古亭區", "雙園區", "龍山區", "城中區", "建成區", "延平區", "大同區", "中山區"] },
        {
            city: "新北市",
            districts: [
                // eslint-disable-next-line max-len
                "板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "土城區", "蘆洲區", "樹林區", "汐止區", "鶯歌區", "三峽區", "淡水區", "瑞芳區", "五股區", "泰山區", "林口區", "深坑區", "石碇區", "坪林區", "三芝區", "石門區", "八里區", "平溪區", "雙溪區", "貢寮區", "金山區", "萬里區", "烏來區",
            ],
        },
    ];

    const submit = () => {
        if (props.value === undefined) {
            props.onChange(undefined);
            props.onClose();
        } else if (props.value && city && district) {
            props.onChange({ ...props.value, city, district });
            props.onClose();
        } else {
            Alert.alert("請選擇一個行政區");
        }
    };

    return (
        <Modal enable={props.enable} onClose={props.onClose}>
            <View style={{ height: Platform.OS === "ios" ? 256 : 128 }}>
                <Row style={{ height: Platform.OS === "ios" ? 168 : 64, display: "flex", alignItems: "center" }}>
                    <Picker
                        selectedValue={city}
                        itemStyle={{ color: "white", fontSize: 16 }}
                        style={{ height: Platform.OS === "ios" ? 216 : 108, width: "50%", color: "white" }}
                        onValueChange={(v) => setCity(v.toString())}
                    >
                        {options.map((c) => (
                            <Picker.Item key={c.city} label={c.city} value={c.city} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={district}
                        itemStyle={{ color: "white", fontSize: 16 }}
                        style={{ height: Platform.OS === "ios" ? 216 : 108, width: "50%", color: "white" }}
                        onValueChange={(v) => setDistrict(v.toString())}
                    >
                        {options
                            .find((c) => c.city === city)
                            ?.districts.map((d) => (
                                <Picker.Item key={d} label={d} value={d} />
                            ))}
                    </Picker>
                </Row>
                <PrimaryButton text="確定" onPress={() => submit()} />
            </View>
        </Modal>
    );
};

export default DistricPickerModal;
