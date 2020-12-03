import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useErrorhandler from "../../hooks/useErrorHandler";
import apis from "../../models/apis";
import { Address, defaultAddress } from "../../models/definitions";
import { addAddressToCache, toggleCreatingAddressModal } from "../../redux/actions";
import { RootState } from "../../redux/types";
import PrimaryButton from "../Buttons/PrimaryButton";
import DistricPickerModal from "./DistrictPickerModal";
import Modal from "./Modal";

const CreateAddressModal = () => {
    const dispatch = useDispatch();
    const errorHandler = useErrorhandler();
    const isCreatingAddress = useSelector<RootState, boolean>((state) => state.ui.isCreatingAddress);

    const [isSelectingDistrict, setSelectingDistrict] = useState(false);
    const [isCreateAddressLoading, setIsCreateAddressLoading] = useState(false);
    const [inputingAddress, setInputingAddress] = useState<Address>(defaultAddress);

    const createAddress = () => {
        const { city, district, detail, note } = inputingAddress;
        const requestData = { city, district, detail, note };
        setIsCreateAddressLoading(true);
        apis.createAddress(requestData)
            .then((res) => {
                dispatch(toggleCreatingAddressModal(false));
                dispatch(addAddressToCache(res));
                setInputingAddress(defaultAddress);
            })
            .catch(errorHandler.handle)
            .finally(() => setIsCreateAddressLoading(false));
    };

    return (
        <Modal enable={isCreatingAddress} onClose={() => dispatch(toggleCreatingAddressModal(false))} canSwipeClose={!isSelectingDistrict}>
            <Text style={{ color: "white", fontSize: 20 }}>新增地址</Text>
            <View style={{ paddingBottom: 36 }}>
                <View>
                    <Text style={styles.inputLable}>地址標籤</Text>
                    <TextInput
                        style={styles.textInput}
                        keyboardType="default"
                        placeholder="家裡、辦公室 ..."
                        value={inputingAddress.note}
                        onChangeText={(v) => setInputingAddress({ ...inputingAddress, note: v })}
                    />
                </View>

                <View>
                    <Text style={styles.inputLable}>詳細地址</Text>

                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => setSelectingDistrict(true)}>
                        <Text style={styles.textInput}>{inputingAddress.city}</Text>
                        <Text style={styles.textInput}>{inputingAddress.district}</Text>
                    </TouchableOpacity>

                    <DistricPickerModal
                        enable={isSelectingDistrict}
                        value={inputingAddress}
                        onClose={() => setSelectingDistrict(false)}
                        onChange={(d) =>
                            d ? setInputingAddress({ ...inputingAddress, city: d.city, district: d.district }) :
                                setInputingAddress(defaultAddress)
                        }
                    />

                    <TextInput
                        style={styles.textInput}
                        value={inputingAddress.detail}
                        keyboardType="default"
                        placeholder="XXX 路 X 巷 X 號 X 樓 XXX 室"
                        onChangeText={(v) => setInputingAddress({ ...inputingAddress, detail: v })}
                    />
                </View>
            </View>
            <PrimaryButton disabled={isCreateAddressLoading} onPress={createAddress} text="新增地址" />
        </Modal>
    );
};

const styles = StyleSheet.create({
    inputLable: { color: "white", opacity: 0.8, marginTop: 32 },
    textInput: { color: "white", fontSize: 16, borderBottomWidth: 1, borderBottomColor: "white", marginTop: 12 },
});

export default CreateAddressModal;
