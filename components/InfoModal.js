import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Localized from "../utils/Localized";

var config = require("../config.json");

class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    setSelectedSegment(segment) {
        console.log("modalsegment", segment);

        this.props.selectSegment(segment);
    }

    render() {
        return (
            <View>
                <Modal
                    isVisible={this.props.isVisible}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center"
                        }}
                    >
                        <View style={{ backgroundColor: "white", width: "90%" }}>
                            <Text style={{ fontFamily: config.boldFont, margin: 10, fontSize: 18 }}>
                                {this.props.info.name}
                            </Text>

                            <View
                                style={{
                                    width: "100%",
                                    margin: 5,
                                    height: 1,
                                    backgroundColor: "grey",
                                    alignSelf: "center"
                                }}
                            ></View>

                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: config.lightFont,
                                    marginStart: 10,
                                    marginBottom: 5,
                                    color: "black"
                                }}
                            >
                                {Localized.cart_total}
                                <Text style={{ fontSize: 20, fontFamily: config.regularFont }}>
                                    {parseInt(this.props.info.sum)} Ft
                                </Text>
                            </Text>

                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: config.lightFont,
                                    marginStart: 10,
                                    marginBottom: 5,
                                    color: "black"
                                }}
                            >
                                {Localized.pieces_title}
                                <Text style={{ fontSize: 20, fontFamily: config.regularFont }}>
                                    {parseInt(this.props.info.count)} {Localized.pieces}
                                </Text>
                            </Text>

                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: config.lightFont,
                                    marginStart: 10,
                                    marginBottom: 5,
                                    color: "black"
                                }}
                            >
                                {Localized.average}
                                <Text style={{ fontSize: 20, fontFamily: config.regularFont }}>
                                    {parseInt(this.props.info.avg)} Ft
                                </Text>
                            </Text>

                            <TouchableOpacity
                                onPress={() => this.props.closeModal()}
                                style={{ height: 40, justifyContent: "center", margin: 10 }}
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
                                        Bezárás
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default InfoModal;
