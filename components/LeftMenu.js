import React, { Component } from "react";
import {
    Animated,
    TouchableOpacity,
    Dimensions,
    Text,
    Switch,
    View,
    Image,
    Linking,
    Pressable
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { withNavigation, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import * as actionHelper from "../store/actions/actionHelper";
import AsyncStorage from "@react-native-community/async-storage";
import RestaurantChooserModal from "./RestaurantChooserModal";
import Localized from "../utils/Localized";
import LocalizedStrings from "react-native-localization";

var config = require("../config.json");

const screenWidth = Dimensions.get("window").width;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

class LeftMenu extends Component {
    constructor(props) {
        super(props);

        this.toggleMenu = this.toggleMenu.bind(this);

        this.state = {
            left_menu_vidth: new Animated.Value(screenWidth * -1),
            left_menu_vidth_original: screenWidth * -1,
            is_menu_opened: false,

            switchValue: false,

            is_restaurant_chooser_visible: false,

            restaurants: []
        };
    }

    toggleSwitch = (value) => {
        this.setState({ switchValue: value });
        console.log("LANG", value);

        if (value) {
            this.props.setLanguage("en");
        } else {
            this.props.setLanguage("hu");
        }
    };

    componentDidMount() {
        AsyncStorage.getItem("RESTAURANTDATAS").then((restaurant_data) => {
            let restDataJSON = JSON.parse(restaurant_data);
            if (restaurant_data) {
                this.setState({
                    restaurant_name: restDataJSON.name
                });
            }
        });

        AsyncStorage.getItem("user_data").then((user_data) => {
            if (user_data != null) {
                let user_dataJSON = JSON.parse(user_data);

                this.setState({
                    restaurants: user_dataJSON.restaurants
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.is_menu_opened != this.props.is_menu_opened) {
            this.toggleMenu(!this.props.is_menu_opened);
        }

        if (prevProps.user_data != this.props.user_data) {
            if (this.props.user_data != null) {
                console.log("prevUSERDATA", prevProps.user_data, this.props.user_data.restaurants);
                this.setState({
                    restaurants: this.props.user_data.restaurants
                });
            }
        }
    }

    toggleMenu() {
        if (!this.state.is_menu_opened) {
            Animated.timing(this.state.left_menu_vidth, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(this.state.left_menu_vidth, {
                toValue: this.state.left_menu_vidth_original,
                duration: 250,
                useNativeDriver: false
            }).start();
        }
        this.setState({ is_menu_opened: !this.state.is_menu_opened }, () => {
            /*this.props.setIsMenuOpened( !this.props.is_menu_opened )*/
        });
        //this.props.setIsMenuOpened( !this.props.is_menu_opened )
    }

    showRestaurantChooserModal() {
        console.log("SHOWRESTAURANTCHOOSERMODAL", this.state.is_restaurant_chooser_visible);
        this.setState({
            is_restaurant_chooser_visible: true
        });
    }

    closeRestaurrantChooserModal() {
        this.setState({
            is_restaurant_chooser_visible: false
        });
    }

    logOut() {
        //asyncból törölni az adatokat és átdobni loginscreenre.
        //console.log("LOGOUTPRESSED");

        AsyncStorage.removeItem("email");
        AsyncStorage.clear();
        this.props.setSelectedIndex(-1);
        this.props.navigation.navigate("LoginScreen");
        this.toggleMenu();
    }

    goToWebPage() {
        //console.log("this.props.selectedRestaurant", this.props.selectedRestaurant)
        Linking.openURL("https://" + this.props.selectedRestaurant.domain);
    }

    render() {
        return (
            <AnimatedPressable
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: this.state.left_menu_vidth,
                    position: "absolute",
                    bottom: 0,
                    zIndex: 1
                }}
                onPress={() => this.toggleMenu()}
            >
                <LinearGradient
                    colors={["#fa3351", "#A93D73"]}
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 1.0, y: 1.0 }}
                    style={{ width: 250 }}
                >
                    <TouchableOpacity
                        style={{ width: "100%", height: "100%" }}
                        onPress={this.toggleMenu}
                    >
                        <SafeAreaView
                            style={{
                                height: "100%",
                                paddingTop: 50
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => this.showRestaurantChooserModal()}
                                style={{ backgroundColor: "#A93D73", marginBottom: 30 }}
                            >
                                <Text
                                    style={{
                                        fontFamily: config.boldFont,
                                        fontSize: 20,
                                        textAlign: "center",
                                        width: "100%",
                                        marginBottom: 20,
                                        marginTop: 20,
                                        color: "white"
                                    }}
                                >
                                    {this.props.selectedRestaurant
                                        ? this.props.selectedRestaurant.name
                                        : "Etterem"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => this.goToWebPage()}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    marginStart: 40
                                }}
                            >
                                <Image
                                    style={{
                                        alignSelf: "center",
                                        height: 15,
                                        width: 15,
                                        tintColor: "white",
                                        marginEnd: 10
                                    }}
                                    source={require("../resources/foreign.png")}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        fontFamily: config.boldFont,
                                        textAlign: "left",
                                        marginTop: 20,
                                        marginBottom: 20,
                                        color: "white"
                                    }}
                                >
                                    {Localized.go_to_website}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => this.logOut()}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    paddingBottom: 30,
                                    marginStart: 40
                                }}
                            >
                                <Image
                                    style={{
                                        alignSelf: "center",
                                        height: 15,
                                        width: 15,
                                        tintColor: "white",
                                        marginEnd: 10
                                    }}
                                    source={require("../resources/logout.png")}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        fontFamily: config.boldFont,
                                        textAlign: "left",
                                        marginTop: 20,
                                        marginBottom: 20,
                                        color: "white"
                                    }}
                                >
                                    {Localized.logout}
                                </Text>
                            </TouchableOpacity>

                            <View
                                style={{
                                    flex: 0,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignContent: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        alignSelf: "center",
                                        fontSize: 20,
                                        color: "white",
                                        fontFamily: config.lightFont,
                                        margin: 5
                                    }}
                                >
                                    HUN
                                </Text>
                                <Switch
                                    style={{}}
                                    onValueChange={this.toggleSwitch}
                                    value={this.state.switchValue}
                                />
                                <Text
                                    style={{
                                        alignSelf: "center",
                                        fontSize: 20,
                                        color: "white",
                                        fontFamily: config.lightFont,
                                        margin: 5
                                    }}
                                >
                                    ENG
                                </Text>
                            </View>
                        </SafeAreaView>
                    </TouchableOpacity>
                </LinearGradient>
                {this.state.restaurants?.length > 1 ? (
                    <RestaurantChooserModal
                        isVisible={this.state.is_restaurant_chooser_visible}
                        closeModal={() => this.closeRestaurrantChooserModal()}
                        restaurants={this.state.restaurants}
                    />
                ) : null}
            </AnimatedPressable>
        );
    }
}

function mapStateToProps(state) {
    return {
        is_menu_opened: state.bottomMenuReducer.is_menu_opened,
        user_data: state.loginReducer.user_data,
        selectedRestaurant: state.restaurantReducer.selectedRestaurant,
        navigation: state.bottomMenuReducer.navigation,
        language: state.languageReducer.language
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setIsMenuOpened: (is_menu_opened) => dispatch(actionHelper.setIsMenuOpened(is_menu_opened)),
        setSelectedIndex: (index) => dispatch(actionHelper.setSelectedIndex(index)),
        setLanguage: (language) => dispatch(actionHelper.setLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu);
