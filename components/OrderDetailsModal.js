import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import Modal from "react-native-modal";
import Divider from "./Divider";
import moment from "moment";

const screenHeight = Dimensions.get("window").height;

var config = require("../config.json");

class OrderDetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderItemsInOrder(orderItem) {
        //console.log("ORDERITEM.Items", orderItem.items)
        let tmp;
        if (this.props.isVisible == true) {
            tmp = orderItem.items.map((item, index) => {
                //console.log("MAPPOLAS", item)

                return (
                    <View style={{ marginStart: 10 }}>
                        <View
                            key={index * item.id}
                            style={{ flexDirection: "row", width: "80%", marginBottom: 5 }}
                        >
                            <Text
                                style={{
                                    fontFamily: config.boldFont,
                                    fontSize: 16,
                                    //marginStart: 10,
                                    marginEnd: 5,
                                    width: 40
                                }}
                            >
                                {item.quantity}db
                            </Text>
                            <Text style={{ fontFamily: config.regularFont, fontSize: 16 }}>
                                {item.product_name}
                            </Text>
                            <Text style={{ fontSize: 15, fontFamily: config.italicFont }}>
                                {" "}
                                {item.subproduct.name}
                            </Text>
                        </View>
                        {item.options.map((optionitem, optionindex) => {
                            return (
                                <Text style={{ fontFamily: config.lightFont }} key={optionindex}>
                                    - {optionitem.name}
                                </Text>
                            );
                        })}
                    </View>
                );

                // return (<Text key={item.id} style={{ fontFamily: config.regularFont, marginHorizontal: 10, fontSize: 16 }}><Text style={{ fontFamily: config.boldFont, fontSize: 14 }}>{item.quantity}db </Text>{item.full_name}</Text>)
            });
        }

        return <View>{tmp}</View>;
    }

    renderOrderAddress(orderItem) {
        return <Text>{}</Text>;
    }

    render() {
        const item = this.props.orderItem;
        return (
            <View>
                <Modal
                    isVisible={this.props.isVisible}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    style={{ height: screenHeight }}
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
                            <Text
                                style={{
                                    fontFamily: config.boldFont,
                                    marginStart: 10,
                                    marginTop: 10,
                                    fontSize: 25,
                                    alignSelf: "center"
                                }}
                            >
                                #{item.counter}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: config.lightFont,
                                    marginStart: 10,
                                    marginTop: 10,
                                    fontSize: 18
                                }}
                            >
                                id: {item.id}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: config.lightFont,
                                    marginStart: 10,
                                    marginTop: 10,
                                    fontSize: 18
                                }}
                            >
                                {moment(item.created_at).format("YYYY.MM.DD. - HH:mm")}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: config.boldFont,
                                    marginStart: 10,
                                    fontSize: 18
                                }}
                            >
                                {item.first_name} {item.last_name}
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
                            <ScrollView style={{ maxHeight: screenHeight / 2 }}>
                                {this.renderItemsInOrder(item)}
                            </ScrollView>

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

export default OrderDetailsModal;
