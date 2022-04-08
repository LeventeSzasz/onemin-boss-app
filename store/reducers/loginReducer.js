import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../UpdateUtility";
import Localized from "../../utils/Localized.js";

const initialState = {
    addresses: [],
    loading: false,
    login_state: null,
    user_data: {},
    registration_state: null,
    save_addresses_state: null,
    default_address_id: 0,
    date: null,
    endDate: null,
    selectingMode: "day",
    segment_by: {
        label: Localized.payment_method,
        value: "payment-methods",
        arrayHelper: "payment_methods",
        itemName: "payment_method"
    },
    paymethods: []
};

const setPaymethods = (state, action) => {
    console.log("loginreducer paymethods", action.paymethods);

    return updateObject(state, {
        paymethods: action.paymethods
    });
};

const setDate = (state, action) => {
    return updateObject(state, {
        date: action.date
    });
};

const setEndDate = (state, action) => {
    return updateObject(state, {
        endDate: action.endDate
    });
};

const setSelectingMode = (state, action) => {
    return updateObject(state, {
        selectingMode: action.selectingMode
    });
};

const setSegmentBy = (state, action) => {
    return updateObject(state, {
        segment_by: action.segment_by
    });
};

const registerResponsed = (state, action) => {
    return updateObject(state, {
        registration_state: action.isSuccess
    });
};

const logoutFinished = (state, action) => {
    return updateObject(state, {
        login_state: null
    });
};

const loginResponsed = (state, action) => {
    return updateObject(state, {
        login_state: action.isSuccess,
        user_data: action.user_data
    });
};

const startLoading = (state, action) => {
    return updateObject(state, {
        loading: true
    });
};

const stopLoading = (state, action) => {
    return updateObject(state, {
        loading: false
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PAYMETHODS:
            return setPaymethods(state, action);
        case actionTypes.SET_DATE:
            return setDate(state, action);
        case actionTypes.SET_END_DATE:
            return setEndDate(state, action);
        case actionTypes.SET_SELECTING_MODE:
            return setSelectingMode(state, action);
        case actionTypes.SET_SEGMENT_BY:
            return setSegmentBy(state, action);
        case actionTypes.STARTED_LOADING:
            return startLoading(state, action);
        case actionTypes.FINISHED_LOADING:
            return stopLoading(state, action);
        case actionTypes.LOGIN_RESPONSE:
            return loginResponsed(state, action);
        case actionTypes.REGISTER_RESPONSE:
            return registerResponsed(state, action);
        case actionTypes.LOGOUT_FINISHED:
            return logoutFinished(state, action);
        default:
            return state;
    }
};

export default reducer;
