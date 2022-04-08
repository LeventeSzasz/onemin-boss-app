import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Localized from "../utils/Localized";

var config = require("../config.json");

class SegmentModal extends Component {
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
                                {Localized.choose_segment_by}
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

                            {this.props.segments.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        style={{ paddingVertical: 10 }}
                                        key={index}
                                        onPress={() => this.setSelectedSegment(item)}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontFamily: config.regularFont,
                                                marginStart: 10,
                                                marginBottom: 5,
                                                color: "#A93D73"
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default SegmentModal;
