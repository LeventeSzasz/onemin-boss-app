import React, { Component, useEffect } from "react";
import { withNavigation } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import MainScreen from "./MainScreen";
import LoginScreen from "./LoginScreen";

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.init();

        AsyncStorage.getItem("email").then((value) => {
            this.setState({
                email: value
            });
        });
    }

    renderScreen() {
        if (this.state.email === null) {
            return <LoginScreen />;
        } else {
            return <MainScreen />;
        }
    }

    render() {
        return this.renderScreen();
    }
}

export default withNavigation(HomeScreen);
