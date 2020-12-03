import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Histories from "../pages/Histories";
import ReservationDetail from "../pages/ReservationDetail";

const Stack = createStackNavigator();

const HistoriesStacks = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="訂單紀錄" component={Histories} />
            <Stack.Screen name="預約詳情" component={ReservationDetail} />
        </Stack.Navigator>
    );
};

export default HistoriesStacks;
