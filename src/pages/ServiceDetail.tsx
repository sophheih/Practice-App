import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Button, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PriceCard from "../components/PriceCard";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Service } from "../models/definitions";
import ParamList from "../models/routeParams";
import { addService, removeService } from "../redux/actions";
import { RootState } from "../redux/types";
import { Color } from "../styles/Color";

const ServiceDetail = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const errorHandler = useErrorhandler();

    const shoppingCartItems = useSelector<RootState, Service[]>((state) => state.shoppingCart.items);
    const serviceID = useRoute<RouteProp<ParamList, "ServiceDetail">>().params.serviceID;

    const [isLoading, setLoading] = useState(false);
    const [service, setService] = useState<Service | undefined>();

    const animVal = useRef(new Animated.Value(0)).current;
    const imageArray: JSX.Element[] = [];

    useEffect(() => {
        setLoading(true);
        apis.getServiceData(serviceID)
            .then((res) => setService(res))
            .catch(errorHandler.handle)
            .finally(() => setLoading(false));
    }, [serviceID]);

    const addServiceToShoppingCart = () => {
        if (service) {
            if (shoppingCartItems.map((i) => i.id).includes(service.id)) {
                Alert.alert("這個服務已經在購物車了!");
                return;
            }
            dispatch(addService(service));
        }
    };

    const removeFromShoppingCart = () => {
        if (service) {
            if (!shoppingCartItems.includes(service)) {
                Alert.alert("這個服務不在購物車內!");
                return;
            }
            dispatch(removeService(service.id));
        }
    };

    if (service) {
        service.image_url.forEach((image, i) => {
            const thisImage = <Image key={`image${i}`} source={{ uri: image }} style={{ width: Dimensions.get("window").width }} />;
            imageArray.push(thisImage);
        });
    }

    const downloadData = () => {
        if (service) {
            setLoading(true);
            apis.getServiceData(service.id)
                .then((res) => {
                    setService(res);
                    setLoading(false);
                })
                .catch((err) => {
                    errorHandler.handle(err);
                    setLoading(false);
                    navigation.navigate("服務列表");
                });
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => downloadData()} tintColor={Color.dark6} />}>
                {service ? (
                    <View>
                        <View style={{ width: "100%", height: 250 }}>
                            <ScrollView
                                horizontal
                                scrollEventThrottle={10}
                                pagingEnabled
                                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: animVal } } }], { useNativeDriver: false })}
                            >
                                {imageArray}
                            </ScrollView>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.title}>{service.title}</Text>
                            <View style={styles.paragraph}>
                                <Text style={styles.text}>{service.long_description}</Text>
                            </View>
                            <PriceCard
                                service={service}
                                style={{ color: Color.primary, fontSize: 20, marginTop: 16, textAlign: "right" }}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.subtle}>服務時長</Text>
                            <Text style={styles.text}>{service.duration} 分鐘</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.subtle}>原價</Text>
                            <Text style={styles.text}>NT$ {service.price} </Text>
                        </View>
                    </View>
                ) : (
                    <></>
                )}
            </ScrollView>
            <View style={styles.sectionWithoutMarginBottom}>
                {!service ? (
                    <Button color={Color.dark3} title="讀取中 ..." onPress={() => {}} />
                ) : !shoppingCartItems.map((i) => i.id).includes(service.id) ? (
                    <Button color={Color.primary} title="加入購物車" onPress={() => addServiceToShoppingCart()} />
                ) : (
                    <Button color={Color.dark3} title="已放入購物車" onPress={() => removeFromShoppingCart()} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontWeight: "800",
        fontSize: 28,
        color: "white",
    },
    section: {
        padding: 24,
        backgroundColor: Color.dark1,
        marginBottom: 18,
    },
    sectionWithoutMarginBottom: {
        padding: 8,
        backgroundColor: Color.dark1,
    },
    subtle: {
        fontWeight: "800",
        fontSize: 16,
        color: "white",
    },
    text: {
        fontSize: 14,
        color: "white",
    },
    price: {
        fontWeight: "800",
        fontSize: 16,
        color: Color.primary,
    },
    paragraph: { marginTop: 16 },
    button: {
        backgroundColor: Color.primary,
        padding: 8,
        color: "white",
    },
});

export default ServiceDetail;
