import React, { Component, useState } from "react";
import { withNavigation, SafeAreaView } from "react-navigation";
import { Text, View, Button, TouchableOpacity, Image } from "react-native";
import CalendarModal from "./CalendarModal";

var config = require("../config.json");
var iconSize = 30;

class CalendarButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarModalVisible: false
        };
    }

    showCalendar = () => {
        this.setState({ calendarModalVisible: true });
    };

    closeCalendar = () => {
        this.setState({ calendarModalVisible: false });
    };

    render() {
        return (
            <View>
                <CalendarModal
                    isVisible={this.state.calendarModalVisible}
                    closeModal={() => this.closeCalendar()}
                />
                <TouchableOpacity style={{ margin: 30 }} onPress={() => this.showCalendar()}>
                    <Image
                        style={{ width: iconSize, height: iconSize, tintColor: "#A93D73" }}
                        source={this.props.icon}
                    ></Image>
                </TouchableOpacity>
            </View>
        );
    }
}

export default CalendarButton;
