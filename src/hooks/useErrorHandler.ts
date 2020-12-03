import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { toggleCreatingOrderModal } from "../redux/actions";
import store from "../redux/store";

const ERROR_TOKEN_EXPIRED = "Token expired";
const ERROR_INVALID_TOKEN = "Invalid token";
const ERROR_USER_OR_PASS_WRONG = "Username or password is wrong.";
const ERROR_ADDRESS_NOT_EXIST = "The address does not exist";
const USER_BALANCE_NOT_ENOUGH = "User balance not enough.";
const TIME_NOT_AVAILABLE = "sorry! time interval had been taken by others.";

const useErrorhandler = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handle = (err: any) => {
        const currentScreenName = store.getState().ui.currentScreenName;
        switch (err) {
        case ERROR_TOKEN_EXPIRED || ERROR_INVALID_TOKEN:
            if (currentScreenName !== "登入") {
                Alert.alert("登入失敗", "您的登入階段已過期，請重新登入");
                navigation.navigate("登入");
                SecureStore.deleteItemAsync("token");
            }
            return;
        case ERROR_USER_OR_PASS_WRONG:
            Alert.alert("登入失敗", "用戶不存在或密碼輸入錯誤");
            return;
        case ERROR_ADDRESS_NOT_EXIST:
            Alert.alert("發生錯誤", "該用戶地址不存在");
            return;
        case USER_BALANCE_NOT_ENOUGH:
            dispatch(toggleCreatingOrderModal(true));
            return;
        case TIME_NOT_AVAILABLE:
            Alert.alert("預約失敗", "改時間段已被他人預約，請下拉重新查詢可選時間");
            return;
        default:
            console.error(err);
            Alert.alert("發生未預期的錯誤", "請聯繫客服人員為您服務");
        }
    };

    return { handle };
};

export default useErrorhandler;
