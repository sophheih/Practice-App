import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { useSelector } from "react-redux";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Member, Order, Reservation } from "../models/definitions";
import { RootState } from "../redux/types";
import { Color } from "../styles/Color";
import dateToString from "../utils/dateToString";
import { getOrderStatusString } from "../utils/getOrderStatusString";
import timeToString from "../utils/timeToString";

const Histories = () => {
    const navigation = useNavigation();
    const errorHandler = useErrorhandler();

    const [orders, setOrders] = useState<Order[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const member = useSelector<RootState, Member | undefined>((state) => state.loginMember.user);

    useEffect(() => {
        downloadData();
    }, []);

    const downloadData = () => {
        setIsLoading(true);
        if (member) {
            apis.getOrders(member.id)
                .then((res) => setOrders(res))
                .then(() => apis.getReservations(member.id))
                .then((res) => {
                    setReservations(res);
                    setIsLoading(false);
                })
                .catch((err) => {
                    errorHandler.handle(err);
                    setIsLoading(false);
                });
        }
    };

    return (
        <ScrollView
            style={{ paddingHorizontal: 16 }}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => downloadData()} tintColor={Color.dark6} />}
        >
            <Text style={{ color: Color.light1, fontSize: 24, fontWeight: "bold", marginTop: 36, marginBottom: 16 }}>本月預約服務</Text>
            {reservations
                .filter((r) => r.start_time.getFullYear() === new Date().getFullYear() && r.start_time.getMonth() === new Date().getMonth())
                .map((reservation) => (
                    <TouchableOpacity
                        key={reservation.id}
                        onPress={() => navigation.navigate("預約詳情", { reservationID: reservation.id })}
                    >
                        <View style={{ backgroundColor: "white", padding: 14, marginVertical: 8, borderRadius: 8 }}>
                            <Text style={{ color: Color.primary, fontSize: 24, fontWeight: "bold" }}>
                                {dateToString(reservation.start_time)}
                            </Text>
                            <Text>
                                {timeToString(reservation.start_time, true)} 開始，{timeToString(reservation.end_time, true)} 結束
                            </Text>
                            <Text>共 {reservation.services_id.length} 項服務</Text>
                        </View>
                    </TouchableOpacity>
                ))}

            <Text style={{ color: Color.light1, fontSize: 24, fontWeight: "bold", marginTop: 36, marginBottom: 16 }}>歷史儲值紀錄</Text>
            {orders
                .filter((order) => order.status === "SUCCESS")
                .map((order) => (
                    <TouchableOpacity
                        key={order.id}
                        onPress={() => {
                            if (order.status === "UNPAID") {
                                navigation.navigate("餘額儲值", { orderID: order.id });
                            }
                        }}
                    >
                        <View style={{ backgroundColor: "white", padding: 14, marginVertical: 8, borderRadius: 8 }}>
                            <Row>
                                <Col size={9}>
                                    <Text style={{ color: Color.primary, fontSize: 24, fontWeight: "bold" }}>NTD $ {order.amount}</Text>
                                    <Text style={{ color: Color.dark4 }}>訂單建立於 {dateToString(order.create_time)}</Text>
                                </Col>
                                <Col
                                    size={3}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: order.status === "SUCCESS" ? "green" : "red", fontSize: 18, fontWeight: "bold" }}>
                                        {getOrderStatusString(order)}
                                    </Text>
                                    {order.status === "UNPAID" ? (
                                        <Text style={{ color: Color.dark6, fontSize: 12, marginTop: 8 }}>點擊付款</Text>
                                    ) : (
                                        <></>
                                    )}
                                </Col>
                            </Row>
                        </View>
                    </TouchableOpacity>
                ))}
        </ScrollView>
    );
};

export default Histories;
