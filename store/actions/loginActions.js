import * as actionTypes from "./actionTypes";
import AsyncStorage from "@react-native-community/async-storage";
import { checkForUpdate, loadPermissions } from "../../utils/LoginUtil";

let configjson = require("../../config.json");

export const register = (endpoint, body) => {
    console.log("reg endpoint: ", endpoint);
    console.log("reg body: ", body);
    return (dispatch) => {
        dispatch(registerResponsed(null));
        dispatch(startLoading());

        fetch(endpoint, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
                dispatch(stopLoading());

                if (response.status > 300) {
                    //console.log("REGISTRATION FAILED", response);
                    dispatch(registerResponsed(false));
                    return;
                }
                //console.log("SUCCESSFUL REGISTRATION", response);
                //response.json();

                dispatch(registerResponsed(true));
                dispatch(
                    login(
                        configjson.base_url + "customer_auth/sign_in",
                        body.email,
                        body.password,
                        true
                    )
                );
            })
            .catch((error) => {
                //console.log("Problem with your Login: " + error.message);
                dispatch(registerResponsed(false));
            });
    };
};

export const login = (endpoint, email, pass, has_loading_icon) => {
    return (dispatch) => {
        dispatch(loginResponsed(null));

        if (has_loading_icon == true) {
            dispatch(startLoading());
        }

        const body = {
            email: email.toLowerCase(),
            password: pass,
            partner_id: configjson.partner_id
        };

        console.log("LOGIN BODY: ", body);

        //fetch(endpoint).then(response => response.json()).then(optionsJSON => {
        fetch(endpoint, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
                dispatch(stopLoading());
                if (response.status > 300) {
                    console.log("LOGIN FAILED", response);
                    dispatch(loginResponsed(false));
                    return;
                }

                response.json().then((responseJson) => {
                    const res = responseJson;

                    console.log("SUCCESSFUL LOGIN", res);
                    //AsyncStorage.setItem('target_id', res.data.target_id.toString());

                    const loginResponse = {
                        uid: response.headers.map.uid,
                        "access-token": response.headers.map["access-token"],
                        client: response.headers.map.client
                    };

                    AsyncStorage.setItem("uid", loginResponse.uid.toString());
                    AsyncStorage.setItem("access-token", loginResponse["access-token"].toString());
                    AsyncStorage.setItem("client", loginResponse.client.toString());

                    AsyncStorage.setItem("email", email);
                    AsyncStorage.setItem("password", pass);

                    AsyncStorage.setItem("login_response", JSON.stringify(res));

                    AsyncStorage.setItem("target_type", res.data.target_type);
                    AsyncStorage.setItem("target_id", res.data.target_id.toString());
                    AsyncStorage.setItem("role_json", res.data.role_json);

                    let user_data = {
                        customer_id: res.id,
                        uid: loginResponse.uid.toString(),
                        access_token: loginResponse["access-token"].toString(),
                        client: loginResponse.client.toString(),
                        email: email,
                        password: pass,
                        target_type: res.data.target_type,
                        target_id: res.data.target_id,
                        restaurants: res.data.restaurants
                    };

                    AsyncStorage.setItem("user_data", JSON.stringify(user_data));

                    loadPermissions(user_data, "hu") // azért nincs localizeolva mert a persmissonok nincsenek megjelenitve igy lenyegtelen
                        .then((myPermissions) => {
                            dispatch(loginResponsed(true, user_data));
                        })
                        .catch((error) => {
                            console.error(error);
                            dispatch(loginResponsed(false, "NO_PERMISSION"));
                        });
                });
            })
            .catch((error) => {
                console.error("Problem with your Login: " + error.message);
                dispatch(loginResponsed(false, null));
            });
    };
};

export const setPaymethods = (paymethods) => {
    console.log("loginaction paymethods", paymethods);
    return {
        type: actionTypes.SET_PAYMETHODS,
        paymethods: paymethods
    };
};

export const setDate = (date) => {
    return {
        type: actionTypes.SET_DATE,
        date: date
    };
};

export const setEndDate = (endDate) => {
    return {
        type: actionTypes.SET_END_DATE,
        endDate: endDate
    };
};

export const setSelectingMode = (selectingMode) => {
    return {
        type: actionTypes.SET_SELECTING_MODE,
        selectingMode: selectingMode
    };
};

export const setSegmentBy = (segment_by) => {
    return {
        type: actionTypes.SET_SEGMENT_BY,
        segment_by: segment_by
    };
};

export const logoutFinished = () => {
    return {
        type: actionTypes.LOGOUT_FINISHED
    };
};

export const registerResponsed = (isSuccess, user_data) => {
    return {
        type: actionTypes.REGISTER_RESPONSE,
        isSuccess: isSuccess,
        user_data: user_data
    };
};

export const loginResponsed = (isSuccess, user_data) => {
    return {
        type: actionTypes.LOGIN_RESPONSE,
        isSuccess: isSuccess,
        user_data: user_data
    };
};

export const startLoading = () => {
    return {
        type: actionTypes.STARTED_LOADING
    };
};

export const stopLoading = () => {
    return {
        type: actionTypes.FINISHED_LOADING
    };
};
