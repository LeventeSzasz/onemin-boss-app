import React, { Component } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Linking, Platform } from "react-native";
import Modal from "react-native-modal";
import Localized from "../utils/Localized.js";

var config = require("../config.json");

export default class UpdateAppModal extends Component {
    constructor(props) {
        super(props);

        this.domain =
            Platform.OS == "ios"
                ? "https://apps.apple.com/us/app/oneminorder/id1578242733"
                : "https://play.google.com/store/apps/details?id=com.omba";
    }

    openPage = () => {
        Linking.openURL(this.domain).catch((err) => console.error("An error occurred", err));
    };

    render() {
        return (
            <Modal
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                //transparent={true}
                isVisible={this.props.is_visible}
            >
                <View
                    style={{
                        marginHorizontal: 15,
                        backgroundColor: "#A93D73",
                        borderRadius: 15,
                        width: "90%",
                        height: 185,
                        alignItems: "center"
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 16,
                            fontFamily: config.boldFont,
                            marginTop: 15
                        }}
                    >
                        {Localized.attention}
                    </Text>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 14,
                            fontFamily: config.regularFont,
                            marginTop: 10,
                            textAlign: "center"
                        }}
                    >
                        {Localized.update_app}
                    </Text>

                    <TouchableOpacity
                        onPress={() => this.openPage()}
                        style={{ width: "90%", alignSelf: "center" }}
                    >
                        <View
                            style={[
                                styles.button,
                                {
                                    backgroundColor: "#A93D73",
                                    borderRadius: 25
                                }
                            ]}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: "white",
                                    fontSize: 15,
                                    fontFamily: config.boldFont
                                }}
                            >
                                {Localized.update}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        backgroundColor: "#A93D73",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: 40,
        marginTop: 50
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
        //height: '60%'
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    scrollableModal: {
        height: 300
    },
    scrollableModalContent1: {
        height: 200,
        backgroundColor: "orange",
        alignItems: "center",
        justifyContent: "center"
    },
    scrollableModalContent2: {
        height: 200,
        backgroundColor: "lightgreen",
        alignItems: "center",
        justifyContent: "center"
    }
});
