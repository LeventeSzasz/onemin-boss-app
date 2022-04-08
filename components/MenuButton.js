import React, { Component, useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import * as actionHelper from "../store/actions/actionHelper";

var config = require("../config.json");

var iconSize = 30;

class MenuButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <TouchableOpacity
                style={{ margin: 30 }}
                onPress={() => this.props.setIsMenuOpened(!this.props.is_menu_opened)}
            >
                <Image
                    style={{ width: iconSize, height: iconSize, tintColor: "#A93D73" }}
                    source={this.props.icon}
                ></Image>
            </TouchableOpacity>
        );
    }
}

function mapStateToProps(state) {
    return {
        is_menu_opened: state.bottomMenuReducer.is_menu_opened
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setIsMenuOpened: (is_menu_opened) => dispatch(actionHelper.setIsMenuOpened(is_menu_opened))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuButton);
