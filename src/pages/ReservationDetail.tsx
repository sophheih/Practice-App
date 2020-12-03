import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import PriceCard from "../components/PriceCard";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Reservation, Therapist } from "../models/definitions";
import ParamList from "../models/routeParams";
import { Color } from "../styles/Color";
import dateToString from "../utils/dateToString";
import timeToString from "../utils/timeToString";

const ReservationDetail = () => {
    const navigation = useNavigation();
    const reservationID = useRoute<RouteProp<ParamList, "ReservationDetail">>().params.reservationID;
    const errorHandler = useErrorhandler();

    const [isLoading, setLoading] = useState(false);
    const [reservation, setReservation] = useState<Reservation | undefined>();

    const [therapist, setTherapist] = useState<Therapist | undefined>();

    useEffect(() => {
        setLoading(true);
        apis.getReservationData(reservationID)
            .then((res) => setReservation(res))
            .catch((err) => {
                errorHandler.handle(err);
                navigation.navigate("訂單紀錄");
            })
            .finally(() => setLoading(false));
    }, [reservationID]);

    useEffect(() => {
        if (reservation) {
            setLoading(true);
            apis.getTherapistData(reservation.therapist_id)
                .then((res) => setTherapist(res))
                .catch(errorHandler.handle)
                .finally(() => setLoading(false));
        }
    }, [reservation]);

    const downloadData = () => {
        if (reservation) {
            setLoading(true);
            apis.getReservationData(reservation.id)
                .then((res) => {
                    setReservation(res);
                })
                .catch((err) => {
                    errorHandler.handle(err);
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {reservation ? (
                <ScrollView
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => downloadData()} tintColor={Color.dark6} />}
                >
                    <View style={styles.section}>
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>預約編號</Text>
                            <Text style={styles.text}>{reservation.id}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>預約的服務</Text>
                        </View>
                        {reservation.services_id.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                onPress={() =>
                                    navigation.navigate("服務詳情", { serviceID: service.id })
                                }
                            >
                                <View style={styles.listitem}>
                                    <Row>
                                        <Col size={2}>
                                            <Image style={styles.image} source={{ uri: service.image_url[0] }} />
                                        </Col>
                                        <Col size={8} style={{ marginLeft: 16 }}>
                                            <Text style={styles.text}>{service.title}</Text>
                                            <PriceCard service={service} style={{ color: Color.primary }} />
                                        </Col>
                                    </Row>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>預約時間</Text>
                            <Text style={styles.text}>
                                {dateToString(reservation.start_time)} {timeToString(reservation.start_time)}
                            </Text>
                        </View>
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>服務總時長</Text>
                            <Text style={styles.text}>
                                {(reservation.end_time.getTime() - reservation.start_time.getTime()) / 1000 / 60} 分鐘
                            </Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>按摩師</Text>
                        </View>
                        {therapist ? (
                            <View style={styles.listitem}>
                                <Row>
                                    <Col size={2}>
                                        <Image style={styles.image} source={{ uri: therapist.image_url }} />
                                    </Col>
                                    <Col size={8} style={{ marginLeft: 16 }}>
                                        <Text style={styles.text}>{therapist.name}</Text>
                                        <Text style={styles.subtle}>{therapist.description}</Text>
                                    </Col>
                                </Row>
                            </View>
                        ) : (
                            <View style={styles.listitem}>
                                <Text style={styles.listitem}>讀取中</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>實付金額</Text>
                            <Text style={styles.text}>NT$ {reservation.total_price}</Text>
                        </View>

                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>服務地址</Text>
                            <Text style={styles.text}>
                                {reservation.address.city + " " + reservation.address.district + " " + reservation.address.detail}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <TouchableOpacity onPress={() => Linking.openURL("https://line.me/R/ti/p/%40332izodu")}>
                            <View style={styles.listitem}>
                                <Text style={styles.subtle}>聯繫客服</Text>
                                <Text style={styles.text}>修改預約、取消預約 ...</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : (
                <></>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    serviceBlock: { marginVertical: 14 },
    image: {
        borderRadius: 16,
        width: "100%",
        height: 60,
    },
    sectionWithoutMarginBottom: {
        padding: 8,
        backgroundColor: Color.dark1,
    },
    listitem: {
        borderColor: Color.dark2,
        borderWidth: 0.5,
        width: "100%",
        backgroundColor: Color.dark1,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    text: {
        lineHeight: 18,
        fontSize: 16,
        color: "white",
    },
    textInput: {
        lineHeight: 18,
        fontSize: 16,
        color: "white",
        marginTop: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "rgba(255,255,255,0.15)",
    },
    title: {
        lineHeight: 48,
        fontSize: 36,
        color: "white",
    },
    subtle: {
        opacity: 0.6,
        lineHeight: 18,
        fontSize: 14,
        color: "white",
    },
    colored_subtle: {
        opacity: 0.6,
        lineHeight: 18,
        fontSize: 14,
        fontWeight: "800",
        color: Color.primary,
    },
});

export default ReservationDetail;
