import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import Modal from "react-native-modal";
import Divider from "./Divider"

class CustomDropDown extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <View style={{ position: "relative"}}>
            <TouchableOpacity style={{ flexDirection: "row" }}>
                <Text style={{ fontFamily: config.lightFont, fontSize: 20 }}>{this.props.label}</Text>
                <Image style={{ width: 15, height: 15 , margin: 5}} source={require("../resources/angle-arrow-down.png")}></Image>
            </TouchableOpacity>
            <Modal></Modal>
        </View> );
    }
}
 
export default CustomDropDown;