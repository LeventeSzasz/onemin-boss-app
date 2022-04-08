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

var globalStyle = require("../resources/styles");
var config = require("../config.json");

const screen = Dimensions.get("window");

var has_clicked_login_button = false;

class RegistrationScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pass: "",
            restaurant_name: "",
            isShowingMessage: false,
            showMessageButton: true,
            message: Localized.fill_all_field,
            emailError: "",
            nameError: "",
            restaurant_nameError: "",
            phoneError: "",
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

    handleNameTextChange(name) {
        this.setState({ name }, () => {
            if (this.state.name == "") {
                this.setState(
                    {
                        nameError: Localized.incorrect_name
                    },
                    () => {}
                );
            } else {
                this.setState(
                    {
                        nameError: ""
                    },
                    () => {}
                );
            }
        });
    }

    handleRestNameTextChange(restaurant_name) {
        this.setState({ restaurant_name }, () => {
            if (this.state.restaurant_name == "") {
                this.setState(
                    {
                        restaurant_nameError: Localized.incorrect_restaurant_name
                    },
                    () => {}
                );
            } else {
                this.setState(
                    {
                        restaurant_nameError: ""
                    },
                    () => {}
                );
            }
        });
    }

    handlePhoneTextChange(phone) {
        this.setState({ phone }, () => {
            if (this.state.phone == "") {
                this.setState(
                    {
                        phoneError: Localized.incorrect_phone
                    },
                    () => {}
                );
            } else {
                this.setState(
                    {
                        phoneError: ""
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

    handleRegisterButton() {
        has_clicked_login_button = true;
        var has_error = false;
        this.setState(
            {
                emailError: "",
                passwordError: "",
                nameError: "",
                restaurant_nameError: "",
                phoneError: ""
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

                if (this.state.name == "") {
                    this.setState(
                        {
                            nameError: Localized.incorrect_name
                        },
                        () => {}
                    );
                    has_error = true;
                }

                if (this.state.restaurant_name == "") {
                    this.setState(
                        {
                            restaurant_nameError: Localized.incorrect_restaurant_name
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

                Toast.show(Localized.successful_reg, Toast.LONG);

                this.props.navigation.navigate("MessageScreen");
            }
        );

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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.login_state != this.props.login_state) {
            if (this.props.login_state != null) {
                this.setState({ isShowingMessage: !this.props.login_state });
                if (!this.props.login_state) {
                    Toast.show(Localized.unsuccessful_login, Toast.LONG);
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
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image
                            style={globalStyle.backbutton}
                            source={require("../resources/left-arrow.png")}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            width: "70%",
                            textAlign: "center",
                            color: "white",
                            fontSize: 25,
                            margin: 15,
                            fontFamily: config.boldFont,
                            alignSelf: "center"
                        }}
                    >
                        {Localized.registration}
                    </Text>
                </ImageBackground>

                <View
                    style={[
                        styles.inputFieldSmallCorner,
                        {
                            flexDirection: "row",
                            padding: 0,
                            marginHorizontal: 30,
                            marginTop: 100,
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
                            marginTop: 30,
                            backgroundColor: "#ececec"
                        }
                    ]}
                >
                    <TextInput
                        style={{ width: "90%", color: "#929292", fontFamily: config.lightFont }}
                        value={this.state.name}
                        underlineColorAndroid="transparent"
                        placeholder={Localized.name}
                        placeholderTextColor="#929292"
                        autoCapitalize="sentences"
                        onChangeText={(name) => this.handleNameTextChange(name)}
                        keyboardType="name-phone-pad"
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
                            marginTop: 30,
                            backgroundColor: "#ececec"
                        }
                    ]}
                >
                    <TextInput
                        style={{ width: "90%", color: "#929292", fontFamily: config.lightFont }}
                        value={this.state.restaurant_name}
                        underlineColorAndroid="transparent"
                        placeholder={Localized.restaurant_name}
                        placeholderTextColor="#929292"
                        autoCapitalize="sentences"
                        onChangeText={(restaurant_name) =>
                            this.handleRestNameTextChange(restaurant_name)
                        }
                        keyboardType="name-phone-pad"
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
                            marginTop: 30,
                            backgroundColor: "#ececec"
                        }
                    ]}
                >
                    <TextInput
                        style={{ width: "90%", color: "#929292", fontFamily: config.lightFont }}
                        value={this.state.phone}
                        underlineColorAndroid="transparent"
                        placeholder={Localized.phone_number}
                        placeholderTextColor="#929292"
                        autoCapitalize="sentences"
                        onChangeText={(phone) => this.handlePhoneTextChange(phone)}
                        keyboardType="number-pad"
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
                        onPress={() => this.handleRegisterButton()}
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
                                {Localized.register.toUpperCase()}
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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RegistrationScreen));

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
