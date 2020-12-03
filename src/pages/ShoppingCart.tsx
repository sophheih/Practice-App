import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Button, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { useDispatch, useSelector } from "react-redux";
import ReserveDatePicker from "../components/Pickers/ReserveDatePicker";
import ReserveTherapistPicker from "../components/Pickers/ReserveTherapistPicker";
import ReserveTimePicker from "../components/Pickers/ReserveTimePicker";
import PriceCard from "../components/PriceCard";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Address, Member, Service, Therapist } from "../models/definitions";
import { addAddressToCache, removeService, toggleCreatingAddressModal } from "../redux/actions";
import { RootState } from "../redux/types";
import { Color } from "../styles/Color";
import calculatePrice from "../utils/calculatePrice";
import dateToString from "../utils/dateToString";
import durationOfServices from "../utils/durationOfServices";
import timeToString from "../utils/timeToString";

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector<RootState, Member | undefined>((state) => state.loginMember.user);
    const addresses = useSelector<RootState, Address[]>((state) => state.cacheData.addresses);
    const shoppingCartServices = useSelector<RootState, Service[]>((state) => state.shoppingCart.items);
    const errorHandler = useErrorhandler();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const [isFetchingTimeOptions, setIsFetchingTimeOptions] = useState(false);
    const [timeOptions, setTimeOptions] = useState<Date[]>([]);
    const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);

    const [isLoadingTherapist, setLoadingTherapist] = useState(false);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [selectedTherapist, setSelectedTherapist] = useState<Therapist | undefined>(undefined);

    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);

    const [isCreatingReservation, setIsCreatingReservation] = useState(false);

    useEffect(() => {
        refreshOptions();
    }, []);

    const refreshOptions = () => {
        if (user) {
            setLoadingTherapist(true);
            apis.getAllTherapist()
                .then((res) => setTherapists(res))
                .then(() => setLoadingTherapist(false))
                .catch(errorHandler.handle);

            setIsLoadingAddress(true);
            apis.getMemberAddresses(user.id)
                .then((res) => res.map((addr) => dispatch(addAddressToCache(addr))))
                .catch(errorHandler.handle)
                .finally(() => setIsLoadingAddress(false));
        }
    };

    useEffect(() => {
        if (selectedDate && shoppingCartServices.length !== 0 && durationOfServices(shoppingCartServices) !== 0) {
            setIsFetchingTimeOptions(true);
            apis.getAvalibleTime(selectedDate, durationOfServices(shoppingCartServices), selectedTherapist?.id)
                .then((res) => setTimeOptions(res))
                .catch(errorHandler.handle)
                .finally(() => setIsFetchingTimeOptions(false));
        }
    }, [selectedDate, selectedTherapist]);

    const createReservation = () => {
        if (!selectedTime) {
            Alert.alert("預約失敗", "請先選擇預約日期及時間");
            return;
        }

        if (!selectedAddress) {
            Alert.alert("預約失敗", "請選擇您要預約服務的地址");
            return;
        }

        setIsCreatingReservation(true);
        apis.createReservation(selectedTime, shoppingCartServices, selectedAddress.id, selectedTherapist ? selectedTherapist.id : undefined)
            .then((res) => {
                navigation.navigate("afterLogin", {
                    screen: "HistoriesStacks",
                    params: {
                        screen: "預約詳情",
                        params: { reservationID: res.id },
                    },
                });
            })
            .catch(errorHandler.handle)
            .finally(() => setIsCreatingReservation(false));
    };

    if (shoppingCartServices.length === 0) {
        return (
            <View>
                <ScrollView style={{ height: Dimensions.get("window").height }}>
                    <Text style={{ textAlign: "center", color: Color.dark6, marginTop: 48 }}>購物車是空的</Text>
                    <Text style={{ textAlign: "center", color: Color.dark6, marginTop: 8 }}>選一個按摩來舒壓一下吧</Text>
                </ScrollView>
            </View>
        );
    }

    return (
        <View>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingAddress || isLoadingTherapist}
                        onRefresh={() => refreshOptions()}
                        tintColor={Color.dark6}
                    />
                }
            >
                <View style={styles.section}>
                    <View style={styles.listitem}>
                        <Text style={styles.text}>當前選擇的服務</Text>
                    </View>

                    <View style={styles.listitem}>
                        {shoppingCartServices.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                onPress={() =>
                                    navigation.navigate("服務詳情", { serviceID: service.id })
                                }
                            >
                                <View style={styles.serviceBlock}>
                                    <Row>
                                        <Col size={2}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: service.image_url[0] }} />
                                        </Col>
                                        <Col
                                            size={8}
                                            style={{ marginLeft: 16 }}>
                                            <Text style={styles.text}>{service.title}</Text>
                                            <PriceCard
                                                service={service}
                                                style={{ color: Color.primary }} />
                                        </Col>
                                        <TouchableOpacity
                                            key={service.id}
                                            onPress={() => dispatch(removeService(service.id))}>
                                            <Col
                                                size={1}
                                                style={{ marginRight: 16 }}>
                                                <FontAwesome5
                                                    name="trash"
                                                    size={16}
                                                    color={Color.primary} />
                                            </Col>
                                        </TouchableOpacity>
                                    </Row>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.listitem}>
                        <Text style={{ color: "white", textAlign: "right" }}>
                            合計 NTD $ {user ? calculatePrice(shoppingCartServices, user.vip) : ""}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.listitem}>
                        <Text style={styles.text}>選擇日期 - {dateToString(selectedDate)}</Text>
                    </View>
                    <View
                        style={{
                            borderColor: Color.dark2,
                            borderWidth: 0.5,
                            width: "100%",
                            backgroundColor: Color.dark1,
                        }}
                    >
                        <ReserveDatePicker
                            value={selectedDate}
                            onChange={(v) => setSelectedDate(v)} />
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.listitem}>
                        <Text style={styles.text}>選擇按摩師</Text>
                    </View>

                    <View
                        style={{
                            borderColor: Color.dark2,
                            borderWidth: 0.5,
                            width: "100%",
                            backgroundColor: Color.dark1,
                        }}
                    >
                        <ReserveTherapistPicker
                            loading={isLoadingTherapist}
                            options={therapists}
                            value={selectedTherapist}
                            onChange={(v) => setSelectedTherapist(v)}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.listitem}>
                        <Text style={styles.text}>選擇時間 - {selectedTime ? timeToString(selectedTime, false) : "尚未選擇"}</Text>
                    </View>
                    <View
                        style={{
                            borderColor: Color.dark2,
                            borderWidth: 0.5,
                            width: "100%",
                            backgroundColor: Color.dark1,
                        }}
                    >
                        <ReserveTimePicker
                            loading={isFetchingTimeOptions}
                            options={timeOptions}
                            value={selectedTime}
                            onChange={(v) => setSelectedTime(v)}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.listitem}>
                        <Text style={styles.text}>選擇地址</Text>
                    </View>
                    {isLoadingAddress ?
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>讀取您保存的地址中 ...</Text>
                        </View> :
                        <>
                            {addresses.map((addr) => (
                                <TouchableOpacity
                                    key={addr.id}
                                    onPress={() => setSelectedAddress(addr) } >
                                    <View
                                        style={{
                                            ...styles.listitem,
                                            backgroundColor: addr === selectedAddress ? Color.primary : Color.dark2,
                                        }}
                                    >
                                        <Text style={styles.subtle}>{addr.note}</Text>
                                        <Text style={styles.text}>
                                            {addr.city} {addr.district} {addr.detail}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity onPress={() => dispatch(toggleCreatingAddressModal(true))}>
                                <View style={styles.listitem}>
                                    <Text style={styles.subtle}> + 新增住址</Text>
                                </View>
                            </TouchableOpacity>
                        </>}

                </View>

                <View style={styles.sectionWithoutMarginBottom}>
                    <Button
                        color={Color.primary}
                        title="立即預約"
                        onPress={() => createReservation()}
                        disabled={isCreatingReservation || isFetchingTimeOptions || isLoadingTherapist || isLoadingAddress}
                    />
                </View>
            </ScrollView>

        </View>
    );
};

export default ShoppingCart;

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
        lineHeight: 18,
        fontSize: 14,
        color: Color.light6,
    },
    colored_subtle: {
        opacity: 0.6,
        lineHeight: 18,
        fontSize: 14,
        fontWeight: "800",
        color: Color.primary,
    },
});
