import React, { Component } from "react";
import {
    Platform,
    TextInput,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ImageBackground,
    Linking
} from "react-native";
import Localized from "../utils/Localized.js";
import { connect } from "react-redux";
import * as actionHelper from "../store/actions/actionHelper";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-community/async-storage";
import { withNavigation } from "react-navigation";
import Toast from "react-native-simple-toast";

var globalStyle = require("../resources/styles");
var config = require("../config.json");

const screen = Dimensions.get("window");

var has_clicked_login_button = false;

class MessageScreen extends Component {
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
            announcement_sec_lang: ""
        };
    }

    onAccessoryPress() {
        this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
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

    handleOKButton() {
        this.props.navigation.navigate("LoginScreen");

        //Linking.openURL("https://www.oneminorder.hu/");
    }

    componentDidMount() {
        console.log("NAVIGATION", this.props.navigation);

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

                <Text
                    style={{
                        width: "90%",
                        textAlign: "center",
                        color: "black",
                        fontSize: 18,
                        marginStart: 10,
                        marginTop: 70,
                        fontFamily: config.regularFont,
                        alignSelf: "center"
                    }}
                >
                    {Localized.thank_you_for_reg}
                </Text>

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
                        onPress={() => this.handleOKButton()}
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
                                OK
                            </Text>
                        </View>
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
        setLanguage: (language) => dispatch(actionHelper.setLanguage(language))
    };
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(MessageScreen));

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
