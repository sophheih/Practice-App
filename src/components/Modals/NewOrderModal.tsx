import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Member } from "../../models/definitions";
import { toggleCreatingOrderModal } from "../../redux/actions";
import { RootState } from "../../redux/types";
import PrimaryButton from "../Buttons/PrimaryButton";
import Modal from "./Modal";


const NewOrderModal = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isCreatingOrder = useSelector<RootState, boolean>((state) => state.ui.isCreatingOrder);
    const loginMember = useSelector<RootState, Member | undefined>((state) => state.loginMember.user);

    const [inputAmonut, setInputAmount] = useState(1000);

    const createOrder = () => {
        dispatch(toggleCreatingOrderModal(false));
        navigation.navigate("afterLogin", {
            screen: "MemberInfoStacks",
            params: {
                screen: "會員儲值",
                params: { amount: inputAmonut },
            },
        });
    };

    return (
        <Modal enable={isCreatingOrder} onClose={() => dispatch(toggleCreatingOrderModal(false))}>
            <Text style={{ color: "white", fontSize: 20 }}>會員加值</Text>
            <Text style={{ color: "white", opacity: 0.6, marginTop: 24 }}>當前餘額</Text>
            <Text style={{ color: "white", fontSize: 24 }}>NT$ {loginMember?.balance}</Text>
            <Text style={{ color: "white", opacity: 0.6, marginTop: 24 }}>請輸入加值金額</Text>
            <TextInput
                style={{ color: "white", fontSize: 24, borderBottomWidth: 1, borderBottomColor: "white", marginTop: 18 }}
                keyboardType="number-pad"
                value={"NT$ " + inputAmonut.toString()}
                onChangeText={(v) => setInputAmount(+(v.substr(4, v.length-4)))}
            />
            <PrimaryButton
                onPress={createOrder}
                text="確定加值"
            />
        </Modal>
    );
};

export default NewOrderModal;
