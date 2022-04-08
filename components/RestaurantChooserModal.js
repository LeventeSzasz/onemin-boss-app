import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Button, ScrollView, FlatList, ImageBackground } from 'react-native';
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import * as actionHelper from '../store/actions/actionHelper';
import Divider from '../components/Divider';
import Localized from '../utils/Localized';
import LocalizedStrings from 'react-native-localization';
var config = require('../config.json');

class RestaurantChooserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    restaurantChoosed(restaurant) {
        console.log("RESTAURANT CHOOSED", restaurant);
        this.props.setSelectedRestaurant(restaurant);
        this.props.closeModal()
    }


    renderRestaurantItem = item => {
        return (
            <TouchableOpacity key={item.id} onPress={() => this.restaurantChoosed(item)}>
                <Text style={{ color: "black", fontFamily: config.regularFont, fontSize: 18, margin: 10 }}>{item.name}</Text>
            </TouchableOpacity>
        );

    };

    render() {
        return (<View>
            <Modal isVisible={this.props.isVisible}
                animationIn="zoomInDown"
                animationOut="zoomOutUp">
                <View style={{ justifyContent: "center", alignItems: "center", alignContent: "center", }}>
                    <View style={{ backgroundColor: "white", width: "90%", height: 600 }}>

                        <Text style={{ margin: 10, fontSize: 20, fontFamily: config.boldFont }}>{Localized.your_restaurants}</Text>

                        <ScrollView style={{ height: 400 }}>
                            {this.props.restaurants.map((item) => {
                                return (<TouchableOpacity key={item.id} onPress={() => this.restaurantChoosed(item)}>
                                    <Text style={{ color: "black", fontFamily: config.regularFont, fontSize: 18, margin: 10 }}>{item.name}</Text>
                                </TouchableOpacity>)
                            })}
                        </ScrollView>

                        <TouchableOpacity onPress={() => this.props.closeModal()} style={{ height: 40, justifyContent: "center", margin: 10 }}>
                            <View style={{ width: "100%", height: "100%", justifyContent: "center", backgroundColor: "#A93D73" }} >
                                <Text style={{ width: "100%", color: "white", textAlign: "center", fontFamily: config.boldFont, }}>
                                    {Localized.close}
                                </Text>
                            </View>

                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>);
    }
}

function mapStateToProps(state) {
    return {
        user_data: state.loginReducer.user_data,
    }
}


const mapDispatchToProps = dispatch => {
    return {
        setIsMenuOpened: (is_menu_opened) => dispatch(actionHelper.setIsMenuOpened(is_menu_opened)),
        setSelectedRestaurant: (selectedRestaurant) => dispatch(actionHelper.setSelectedRestaurant(selectedRestaurant)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantChooserModal); 