import { combineReducers } from "redux";
import { CacheDataAction, LoginMemberAction, ShoppingCartAction, UIAction } from "./actions";
import {
    ADD_ADDRESS_TO_CACHE,
    ADD_SERVICE,
    CacheDataState,
    CLEAR_SHOPPING_CART,
    LoginMemberState,
    RECORD_CURRENT_SCREEN_NAME,
    REMOVE_ADDRESS_FROM_CACHE,
    REMOVE_SERVICE,
    SET_USER_DATA,
    SET_USER_TOKEN,
    ShoppingCartState,


    TOGGLE_CREATING_ADDRESS_MODAL,


    TOGGLE_CREATING_ORDER_MODAL,


    UIState,
    USER_LOGOUT,
} from "./types";

const initialState: LoginMemberState = { user: undefined, token: undefined };
export function loginMemberReducer(state = initialState, action: LoginMemberAction): LoginMemberState {
    switch (action.type) {
    case SET_USER_DATA:
        return { ...state, user: action.user };
    case SET_USER_TOKEN:
        return { ...state, token: action.token };
    case USER_LOGOUT:
        return { user: undefined, token: undefined };
    default:
        return state;
    }
}

const initialShoppingCartState: ShoppingCartState = { items: [] };
export function shoppingCartReducer(state = initialShoppingCartState, action: ShoppingCartAction): ShoppingCartState {
    switch (action.type) {
    case ADD_SERVICE:
        return { ...state, items: [...state.items, action.service] };
    case REMOVE_SERVICE:
        return { ...state, items: [...state.items.filter((s) => s.id !== action.serviceID)] };
    case CLEAR_SHOPPING_CART:
        return { ...state, items: [] };
    default:
        return state;
    }
}

const initialUIState : UIState = { currentScreenName: "", isCreatingAddress: false, isCreatingOrder: false };
export function uiStateReducer(state = initialUIState, action: UIAction): UIState {
    switch (action.type) {
    case RECORD_CURRENT_SCREEN_NAME:
        return { ...state, currentScreenName: action.currentScreenName };
    case TOGGLE_CREATING_ADDRESS_MODAL:
        return { ...state, isCreatingAddress: action.isCreating };
    case TOGGLE_CREATING_ORDER_MODAL:
        return { ...state, isCreatingOrder: action.isCreating };
    default:
        return state;
    }
}

const initCacheDataState : CacheDataState = { addresses: [] };
export function cacheDataStateReducer(state = initCacheDataState, action: CacheDataAction): CacheDataState {
    switch (action.type) {
    case ADD_ADDRESS_TO_CACHE:
        return { ...state, addresses: [...state.addresses.filter((addr) => addr.id !== action.address.id), action.address] };
    case REMOVE_ADDRESS_FROM_CACHE:
        return { ...state, addresses: [...state.addresses.filter((addr) => addr.id !== action.addressID)] };
    default:
        return state;
    }
}

export const rootReducer = combineReducers({
    loginMember: loginMemberReducer,
    shoppingCart: shoppingCartReducer,
    cacheData: cacheDataStateReducer,
    ui: uiStateReducer,
});
