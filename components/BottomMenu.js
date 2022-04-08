import React, { Component } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { connect } from "react-redux";
import * as actionHelper from "../store/actions/actionHelper";
import Localized from "../utils/Localized";
import { Circle, G, Line, Svg } from "react-native-svg";

const screen = Dimensions.get("window");
var config = require("../config.json");

class BottomMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 70
        };
    }

    componentDidMount() {}

    componentDidUpdate(prevProps) {
        if (this.props.language != prevProps.language) {
            console.log("ujra kene renderelni");
        }
    }

    buttonTouched(index) {
        switch (index) {
            case 0:
                this.props.navigation.navigate("RestaurantDatasScreen", {});
                break;
            case 1:
                this.props.navigation.navigate("OrdersScreen", {});
                break;
            case 2:
                this.props.navigation.navigate("StatisticsScreen", {});
                break;
            default:
                this.props.navigation.navigate("RestaurantDatasScreen", {});
                break;
        }

        this.props.setSelectedIndex(index);
    }

    renderButton = (index, img, title) => {
        let iconHeight = screen.width / 8;
        let iconWidth = screen.width / 8;
        let active = this.props.index == index;

        // if (this.props.index == index) {
        //     iconHeight = screen.height / 10
        //     iconWidth = screen.width / 2 - 30
        // } else {
        //     iconHeight = screen.width / 9
        //     iconWidth = screen.width / 9
        // }

        return (
            <TouchableOpacity
                style={{
                    alignItems: "center",
                    height: iconHeight,
                    justifyContent: "center",
                    marginHorizontal: 30,
                    paddingBottom: 15
                }}
                onPress={() => this.buttonTouched(index)}
                //disabled={true} //TODO: disabled ha nincs rá jogosultsága
            >
                {/* <Svg height="10" width="10" position="absolute" top={-screen.height / 45}>
                    {active ? (
                        <Circle cx="5" cy="5" r="5" fill="#A93D73" style={{ paddingBottom: 10 }} />
                    ) : null}
                </Svg> */}

                <View style={{ height: "100%", width: iconWidth }}>
                    <Image
                        style={{
                            height: "100%",
                            width: "100%",
                            tintColor: active ? "#A93D73" : "black"
                        }}
                        source={img}
                        resizeMode="contain"
                    />
                </View>

                <Svg height="10" width="10" /*position="absolute" bottom={-screen.height / 45} */>
                    {active ? (
                        <Circle cx="5" cy="5" r="5" fill="#A93D73" style={{ paddingBottom: 10 }} />
                    ) : null}
                </Svg>
            </TouchableOpacity>
        );
    };

    renderBottomMenu() {
        return (
            //ittvolt az imagebackground

            <View
                style={{
                    height: screen.height / 9,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    position: "absolute",
                    bottom: 0,
                    backgroundColor: "white",
                    //Anrdoid
                    elevation: 24,
                    //IOS
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2
                }}
            >
                {this.renderButton(
                    0,
                    require("../resources/restaurant_icon.png"),
                    Localized.summary
                )}
                {this.renderButton(1, require("../resources/order_icon.png"), Localized.orders)}
                {this.renderButton(
                    2,
                    require("../resources/statistics_icon.png"),
                    Localized.statistics
                )}
            </View>
        );
    }

    render() {
        return <View>{this.props.index > -1 ? this.renderBottomMenu() : null}</View>;
    }
}

function mapStateToProps(state) {
    return {
        index: state.bottomMenuReducer.index,
        navigation: state.bottomMenuReducer.navigation,
        language: state.languageReducer.language
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedIndex: (index) => dispatch(actionHelper.setSelectedIndex(index))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomMenu);
