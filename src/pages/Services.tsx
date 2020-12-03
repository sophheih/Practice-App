import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import PriceCard from "../components/PriceCard";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Event, Service } from "../models/definitions";
import { RootState } from "../redux/types";
import { Color } from "../styles/Color";

const Services = () => {
    const navigation = useNavigation();
    const errorHandler = useErrorhandler();
    const token = useSelector<RootState, string | undefined>((state) => state.loginMember.token);
    const animVal = useRef(new Animated.Value(0)).current;

    const [isLoadingServices, setLoadingServices] = useState(false);
    const [services, setServices] = useState<Service[]>([]);

    const [isLoadingEvents, setLoadingEvents] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [imageArray, setImageArray] = useState<JSX.Element[]>([]);

    useEffect(() => {
        events.forEach((event, i) => {
            const thisImage = (
                <Image
                    key={`image${i}`}
                    source={{ uri: event.image_url }}
                    style={{ width: Dimensions.get("window").width * 0.9 }} />
            );
            setImageArray((ia) => [...ia, thisImage]);
        });
    }, [events]);

    useEffect(() => {
        if (token) downloadData();
    }, [token]);

    const downloadData = () => {
        setLoadingServices(true);
        apis.getAllService()
            .then((res) => setServices(res))
            .catch(errorHandler.handle)
            .finally(() => setLoadingServices(false));

        setLoadingEvents(true);
        apis.getAllEvents()
            .then((res) => {
                setImageArray([]);
                setEvents(res);
            })
            .catch(errorHandler.handle)
            .finally(() => setLoadingEvents(false));
    };

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl
                    refreshing={isLoadingEvents || isLoadingServices}
                    onRefresh={() => downloadData()}
                    tintColor={Color.dark6}
                />
            }
        >
            {events.length > 0 ? (
                <View
                    style={{
                        marginStart: "5%",
                        width: "90%",
                        height: 250,
                        marginVertical: 24,
                        borderRadius: 36,
                        overflow: "hidden",
                    }}
                >
                    <ScrollView
                        horizontal
                        scrollEventThrottle={10}
                        pagingEnabled
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: animVal } } }], { useNativeDriver: false })}
                    >
                        {imageArray}
                    </ScrollView>
                </View>
            ) : (
                <></>
            )}

            {services.map((service) => (
                <TouchableOpacity
                    key={service.id}
                    onPress={() =>
                        navigation.navigate("服務詳情", { serviceID: service.id })
                    }
                >
                    <View style={styles.item}>
                        <Image
                            style={styles.image}
                            source={{ uri: service.image_url[0] }} />
                        <View style={styles.inner}>
                            <Text style={styles.title}>{service.title}</Text>
                            <Text>{service.short_description}</Text>
                            <View style={styles.next}>
                                <PriceCard service={service} style={{ color: Color.primary }} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default Services;

const styles = StyleSheet.create({
    item: {
        width: "90%",
        marginHorizontal: "5%",
        marginVertical: 18,
        borderRadius: 16,
        backgroundColor: "white",
    },
    inner: { padding: 16 },
    image: {
        borderRadius: 16,
        width: "100%",
        height: 180,
    },
    next: { flexDirection: "row", justifyContent: "flex-start", marginTop: 16 },
    nextText: {
        marginLeft: 8,
        color: Color.primary,
        fontWeight: "800",
    },
    title: {
        fontWeight: "800",
        fontSize: 20,
        lineHeight: 36,
    },
});
