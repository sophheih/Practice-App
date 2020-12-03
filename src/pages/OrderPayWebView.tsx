import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { API_URL } from "../config";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import ParamList from "../models/routeParams";

const OrderPayWebView = () => {
    const route = useRoute<RouteProp<ParamList, "會員儲值">>();
    const navigation = useNavigation();
    const errorHandler = useErrorhandler();
    const webviewRef = React.useRef() as React.MutableRefObject<WebView>;
    const amount = route.params.amount;
    const [isDone, setDone] = useState(false);

    const [html, setHtml] = useState("");

    const handleError = () => {
        Alert.alert("無法取得付款頁面", "請聯繫客服人員處理");
        navigation.navigate("會員資訊");
    };

    useEffect(() => {
        setDone(false);
        apis.getPaymentPage(amount)
            .then((res) => setHtml(res))
            .catch(errorHandler.handle);
    }, []);

    const listenNavigationState = (state: WebViewNavigation) => {
        const splitedURL = state.url.split("/");
        const lastURLpath = splitedURL[splitedURL.length - 1].split("?")[0];
        const URLparams = splitedURL[splitedURL.length - 1].split("?")[1] ?
            splitedURL[splitedURL.length - 1].split("?")[1].split("&").map((p) => {
                return { name: p.split("=")[0], value: p.split("=")[1] };
            }) : [];

        if (lastURLpath === "mpg_return_url" && URLparams.find((p) => p.name === "Status")?.value === "SUCCESS" && !isDone) {
            navigation.navigate("會員資訊", { shouldRefresh: true });
            setDone(true);
        }
    };

    return (
        <WebView
            ref={webviewRef}
            source={{
                baseUrl: API_URL + "/order/",
                html: html,
            }}
            onError={handleError}
            onNavigationStateChange={listenNavigationState}
        />
    );
};

export default OrderPayWebView;
