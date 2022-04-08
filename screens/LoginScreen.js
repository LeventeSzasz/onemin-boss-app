import React, { Component } from "react";
import {
    TextInput,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ImageBackground
} from "react-native";
import Localized from "../utils/Localized.js";
import { connect } from "react-redux";
import * as actionHelper from "../store/actions/actionHelper";
import AsyncStorage from "@react-native-community/async-storage";
import { withNavigation } from "react-navigation";
import Toast from "react-native-simple-toast";
import Modal from "react-native-modal";
import { checkForUpdate } from "../utils/LoginUtil.js";
import UpdateAppModal from "../components/UpdateAppModal.js";

var globalStyle = require("../resources/styles");
var config = require("../config.json");

const screen = Dimensions.get("window");

var has_clicked_login_button = false;

class LoginScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pass: "",
            isShowingMessage: false,
            showMessageButton: true,
            message: Localized.fill_all_field,
            emailError: "",
            passwordError: "",
            secureTextEntry: true,
            is_showing_forgotten_pass: false,
            announcement: "",
            announcement_sec_lang: "",
            noPermissionModalVisible: false
        };
    }

    onAccessoryPress() {
        this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
    }

    onCloseButtonPressed() {
        this.setState({ noPermissionModalVisible: false });
    }

    renderPasswordAccessory() {
        let { secureTextEntry } = this.state;

        let img = !secureTextEntry
            ? require("../resources/pw_show_128.png")
            : require("../resources/pw_notshow_128.png");

        return (
            <TouchableOpacity
                onPress={() => this.onAccessoryPress()}
                style={{ width: 50, height: 50, alignItems: "center", justifyContent: "center" }}
            >
                <Image style={{ width: 30, height: 30 }} source={img} resizeMode="contain" />
            </TouchableOpacity>
        );
    }

    handleEmailTextChange(email) {
        this.setState({ email }, () => {
            if (this.state.email == "") {
                this.setState(
                    {
                        emailError: Localized.incorrect_email
                    },
                    () => {}
                );
            } else {
                this.setState(
                    {
                        emailError: ""
                    },
                    () => {}
                );
            }
        });
    }

    handlePassTextChange(pass) {
        this.setState({ pass }, () => {
            if (!has_clicked_login_button) {
                return;
            }
            if (this.state.pass.length < 6) {
                this.setState(
                    {
                        passwordError: Localized.min_6_chars
                    },
                    () => {}
                );
            } else {
                this.setState(
                    {
                        passwordError: ""
                    },
                    () => {}
                );
            }
        });
    }

    handleLoginButton() {
        has_clicked_login_button = true;
        var has_error = false;
        this.setState(
            {
                emailError: "",
                passwordError: ""
            },
            () => {
                if (this.state.email == "") {
                    this.setState(
                        {
                            emailError: Localized.incorrect_email
                        },
                        () => {}
                    );
                    has_error = true;
                }

                if (this.state.pass.length < 6) {
                    this.setState(
                        {
                            passwordError: Localized.min_6_chars
                        },
                        () => {}
                    );
                    has_error = true;
                }

                if (has_error) {
                    this.setState(
                        {
                            isShowingMessage: true,
                            showMessageButton: true,
                            message: Localized.fill_all_field
                        },
                        () => {}
                    );
                    return;
                }

                this.props.onLogin(
                    config.base_url + "admin_auth/sign_in",
                    this.state.email,
                    this.state.pass,
                    true
                );
                //feccs login ha jo a belepes akkor elmentjuk asynchba az adatokat aztan dobjuk tovabb a kovii kepernyore
                Localized.setLanguage("hu");
            }
        );
    }

    handleRegisterButton() {
        this.props.navigation.navigate("RegistrationScreen");

        //Linking.openURL("https://www.oneminorder.hu/");
    }

    componentDidMount() {
        //console.log("NAVIGATION", this.props.navigation);

        this.props.setNavigation(this.props.navigation);

        AsyncStorage.getItem("email").then((email) => {
            if (email) {
                AsyncStorage.getItem("password").then((password) => {
                    this.props.onLogin(
                        config.base_url + "admin_auth/sign_in",
                        email,
                        password,
                        true
                    );
                });
            }
        });

        this.props.setSelectedIndex(-1);
        this.props.setLanguage("hu");

        // /v3/payment-methods/

        let URL = config.base_url + "v3/payment-methods/";
        //console.log("getpayment-methods URL", URL);

        let header = {};

        //header.uid = this.props.user_data.uid;
        //header.client = this.props.user_data.client;
        //header["access-token"] = this.props.user_data.access_token;

        header.Accept = "application/json";
        header["Content-Type"] = "application/json";
        header["Accept-Language"] = this.props.language;

        fetch(URL, {
            method: "GET",
            headers: header
        })
            .then((response) => {
                if (response.status > 300) {
                    //console.log("getPaymethods FAILED: ", response);

                    return;
                }
                response.json().then((responseJson) => {
                    const res = responseJson;
                    this.props.setPaymethods(res);
                    //console.log("getPaymethods SUCCESS: ", res);
                });
            })
            .catch((error) => {
                //console.log("Problem getPaymethods: " + error.message);
            });

        checkForUpdate(this.props.user_data).then((hasToUpdate) => {
            console.log("then", hasToUpdate);
            if (hasToUpdate) {
                this.setState({ updateModalVisible: true });
            } else {
                this.setState({ updateModalVisible: false });
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.login_state != this.props.login_state) {
            if (this.props.login_state != null) {
                this.setState({ isShowingMessage: !this.props.login_state });
                if (!this.props.login_state) {
                    Toast.show(Localized.unsuccessful_login, Toast.LONG);

                    console.log("USER DATA AFTER LOGIN", this.props.user_data);
                    if (this.props.user_data == "NO_PERMISSION") {
                        this.setState({ noPermissionModalVisible: true });
                    }
                } else {
                    Toast.show(Localized.successful_login, Toast.LONG);

                    this.props.navigation.navigate("RestaurantDatasScreen");
                    this.props.setSelectedIndex(0);
                }
            }
        }
    }

    render() {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#ffffff",
                    justifyContent: "center"
                }}
            >
                {/* <ActivityIndicator size="large" color="#00ff00" /> */}
                <ImageBackground
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: screen.width,
                        height: screen.height / 3,
                        justifyContent: "center",
                        overflow: "visible"
                    }}
                    source={require("../resources/launch_screen_bg.png")}
                    resizeMode="stretch"
                >
                    <Image
                        style={{
                            width: "70%",
                            resizeMode: "contain",
                            margin: 15,
                            alignSelf: "center"
                        }}
                        source={require("../resources/launch_screen_logo.png")}
                    />
                </ImageBackground>

                <UpdateAppModal is_visible={this.state.updateModalVisible} />
                <Modal
                    isVisible={this.state.noPermissionModalVisible}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                            margin: 10
                        }}
                    >
                        <View style={{ backgroundColor: "white", width: "90%" }}>
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 15,
                                    fontFamily: config.boldFont,
                                    textAlign: "center",
                                    alignSelf: "center",
                                    padding: 10
                                }}
                            >
                                {Localized.no_permisson}
                            </Text>
                            <TouchableOpacity
                                onPress={() => this.onCloseButtonPressed()}
                                style={{ height: 40, justifyContent: "center", marginTop: 10 }}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        justifyContent: "center",
                                        backgroundColor: "#A93D73"
                                    }}
                                >
                                    <Text
                                        style={{
                                            width: "100%",
                                            color: "white",
                                            textAlign: "center",
                                            fontFamily: config.boldFont
                                        }}
                                    >
                                        {Localized.close}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Text
                    style={{
                        textAlign: "center",
                        color: "black",
                        fontSize: 25,
                        marginStart: 10,
                        marginTop: 70,
                        fontFamily: config.boldFont
                    }}
                >
                    {Localized.login}
                </Text>

                <View
                    style={[
                        styles.inputFieldSmallCorner,
                        {
                            flexDirection: "row",
                            padding: 0,
                            marginHorizontal: 30,
                            marginTop: 30,
                            backgroundColor: "#ececec"
                        }
                    ]}
                >
                    <TextInput
                        style={{ width: "90%", color: "#929292", fontFamily: config.lightFont }}
                        value={this.state.email}
                        underlineColorAndroid="transparent"
                        placeholder={Localized.email}
                        placeholderTextColor="#929292"
                        autoCapitalize="sentences"
                        onChangeText={(email) => this.handleEmailTextChange(email)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <View style={{ width: 20, height: 40, marginRight: 20 }} />
                </View>

                <View
                    style={[
                        styles.inputFieldSmallCorner,
                        {
                            flexDirection: "row",
                            padding: 0,
                            marginHorizontal: 30,
                            marginTop: 20,
                            backgroundColor: "#ececec"
                        }
                    ]}
                >
                    <TextInput
                        style={{ width: "90%", color: "#929292", fontFamily: config.lightFont }}
                        value={this.state.pass}
                        underlineColorAndroid="transparent"
                        placeholder={Localized.password}
                        placeholderTextColor="#929292"
                        autoCapitalize="none"
                        onChangeText={(pass) => this.handlePassTextChange(pass)}
                        keyboardType="default"
                        secureTextEntry={true}
                        autoCapitalize="none"
                    />
                    <View style={{ width: 20, height: 40, marginRight: 20 }} />
                </View>

                <View
                    style={{
                        flex: 0,
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginHorizontal: 30,
                        marginTop: 30
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={() => this.handleLoginButton()}
                    >
                        <View
                            style={{
                                width: "100%",
                                height: 50,
                                justifyContent: "center",
                                backgroundColor: "#A93D73"
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: "white",
                                    fontSize: 15,
                                    fontFamily:
                                        config.regularFont /*fontFamily: config.fontFamilyBold */,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1
                                    },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 1.41,
                                    elevation: 2
                                }}
                            >
                                {Localized.login.toUpperCase()}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 30
                        }}
                        onPress={() => this.handleRegisterButton()}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "#A93D73",
                                fontSize: 15,
                                fontFamily:
                                    config.regularFont /*fontFamily: config.fontFamilyBold */,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1
                                },
                                shadowOpacity: 0.5,
                                shadowRadius: 1.41,
                                elevation: 2
                            }}
                        >
                            {Localized.registration}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loginReducer.loading,
        login_state: state.loginReducer.login_state,
        user_data: state.loginReducer.user_data,
        language: state.languageReducer.language,
        is_secondary_language: state.languageReducer.is_secondary_language
        //navigation: state.bottomMenuReducer.navigation
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (endpoint, email, pass, has_loading_icon) =>
            dispatch(actionHelper.login(endpoint, email, pass, has_loading_icon)),
        resetFieldStates: () => dispatch(actionHelper.resetFieldStates()),
        getRestaurant: (id, is_secondary_language) =>
            dispatch(actionHelper.getRestaurant(id, is_secondary_language)),
        setNavigation: (navigation) => dispatch(actionHelper.setNavigation(navigation)),
        setSelectedIndex: (index) => dispatch(actionHelper.setSelectedIndex(index)),
        setSelectedRestaurant: (selectedRestaurant) =>
            dispatch(actionHelper.setSelectedRestaurant(selectedRestaurant)),
        setLanguage: (language) => dispatch(actionHelper.setLanguage(language)),
        setPaymethods: (paymethods) => dispatch(actionHelper.setPaymethods(paymethods))
    };
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(LoginScreen));

const styles = StyleSheet.create({
    inputFieldSmallCorner: {
        paddingLeft: 20,
        //margin: 20,
        justifyContent: "flex-end",
        height: 50,
        borderColor: "#bbbbbb",
        borderBottomWidth: 3
        //borderRadius: 0,
        // backgroundColor: '#ffffff',
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.50,
        // shadowRadius: 1.41,
        // elevation: 2,
    }
});
