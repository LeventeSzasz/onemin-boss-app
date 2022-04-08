"use strict";

var React = require("react-native");
import { Platform, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const IOS_APPBAR_PADDING = screenHeight / screenWidth >= 2 ? 30 : 10;

var { StyleSheet } = React;

module.exports = StyleSheet.create({
    // APPBAR ---------------------------------------//
    cartbutton: {
        margin: 20,
        justifyContent: "flex-end",
        width: 20,
        height: 20
    },
    backbutton: {
        position: "absolute",
        top: 0,
        margin: 20,
        justifyContent: "flex-start",
        width: 20,
        height: 20
    },
    appbarcontainer: {
        justifyContent: "space-between",
        borderRadius: 0,
        paddingTop: Platform.OS === "ios" ? IOS_APPBAR_PADDING : 0,
        flexDirection: "row",
        backgroundColor: "red"
    },
    underline: {
        backgroundColor: "white"
    },
    indicatorStyle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    appbarstyle: {
        justifyContent: "space-between",
        borderRadius: 0,
        //marginTop: Platform.OS === 'ios' ? 10 : 0,
        marginTop: Platform.OS === "ios" ? IOS_APPBAR_PADDING : 0,
        flexDirection: "row"
    },
    appbarName: {
        fontSize: 25,
        textAlign: "left",
        paddingVertical: 15,
        color: "white"
    },
    // APPBAR ---------------------------------------//
    counterButton: {
        height: 30,
        width: 30,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0,
        borderRadius: 15
    },
    counterButtonTitle: {
        fontSize: 22,
        color: "white",
        textAlign: "center"
    },
    counterButton2: {
        height: 35,
        width: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 17.5
    },
    counterButtonTitle2: {
        fontSize: 27,
        color: "red",
        textAlign: "center"
    },
    textInput: {
        paddingVertical: 25,
        paddingHorizontal: 10
    }
});
