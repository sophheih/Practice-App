import React from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { Member, Service } from "../models/definitions";
import { RootState } from "../redux/types";

interface Props {
    service: Service;
    style?: any;
}

const PriceCard = (props: Props) => {
    const loginMember = useSelector<RootState, Member | undefined>((state) => state.loginMember.user);

    const normalPrice = Math.round(props.service.nor_per * props.service.price);
    const vipPrice = Math.round(props.service.vip_per * props.service.price);
    const minusPrice = Math.round(props.service.price - props.service.minus);

    if (minusPrice < 0) minusPrice === 0;

    if (loginMember?.vip) {
        if (Math.min(vipPrice, minusPrice) === vipPrice) {
            if (vipPrice !== normalPrice) {
                return <Text style={{ ...props.style, fontWeight: "bold" }}>VIP 獨享價 NTD $ {normalPrice}</Text>;
            } else {
                return <Text style={{ ...props.style, fontWeight: "bold" }}>NTD $ {normalPrice}</Text>;
            }
        } else {
            return (
                <Text style={{ ...props.style, fontWeight: "bold" }}>
                    NTD $ {minusPrice} (現省 {props.service.minus} ! )
                </Text>
            );
        }
    } else {
        if (Math.min(normalPrice, minusPrice) === normalPrice) {
            return <Text style={{ ...props.style, fontWeight: "bold" }}>NTD $ {normalPrice}</Text>;
        } else {
            return (
                <Text style={{ ...props.style, fontWeight: "bold" }}>
                    NTD $ {minusPrice} (現省 {props.service.minus} ! )
                </Text>
            );
        }
    }
};

export default PriceCard;
