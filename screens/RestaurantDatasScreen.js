import React, { Component } from "react";
import { withNavigation, SafeAreaView } from "react-navigation";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import * as actionHelper from "../store/actions/actionHelper";
import Localized from "../utils/Localized.js";
import moment from "moment";
import CalendarButton from "../components/CalendarButton";
import MenuButton from "../components/MenuButton";
import { checkForUpdate } from "../utils/LoginUtil.js";
import UpdateAppModal from "../components/UpdateAppModal.js";
var configjson = require("../config.json");

class RestaurantDatasScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            endDate: new Date(),
            PickerMode: "date",
            isDateTimePickerVisible: false,
            isEndDateTimePickerVisible: false,
            selectingMode: "day",
            refreshing: false,
            income_response: null,
            loading: false,
            updateModalVisible: false
        };
    }

    //"YYYY-MM-DD[T]HH:mm:ss.sss[Z]"

    componentDidMount() {
        checkForUpdate(this.props.user_data).then((hasToUpdate) => {
            console.log("then REstaurantScreen", hasToUpdate);
            if (hasToUpdate === true) {
                console.log("hastoUpdate", hasToUpdate, hasToUpdate == true, hasToUpdate === true);
                this.setState({ updateModalVisible: true });
            } else {
                console.log("hastoUpdate", hasToUpdate, hasToUpdate == true, hasToUpdate === true);
                this.setState({ updateModalVisible: false });
            }
        });

        this.props.setDate(this.state.date);
        this.props.setEndDate(this.state.endDate);
        //console.log( "DATESTATE", this.state.date, this.state.date.toISOString() );

        this.getRestaurantDatas();
    }

    componentDidUpdate(prevProps) {
        //console.log("componentDidUpdate", prevProps, this.props);
        if (
            this.props.selectingMode != prevProps.selectingMode ||
            this.props.date != prevProps.date ||
            this.props.endDate != prevProps.endDate
        ) {
            if (this.props.selectedRestaurant != null) {
                //console.log("------COMPONENTDIDUPDATE----------")
                this.getDatasV3(
                    this.props.selectedRestaurant.partner_id,
                    this.props.selectedRestaurant.id
                );
            }
        }
        if (!this.state.loading) {
            if (this.props.selectedRestaurant.id != prevProps.selectedRestaurant.id) {
                //console.log("ez futna le egy csomószor");
                if (this.props.user_data.target_type === "Partner") {
                    this.getRestaurantDatas();
                }
            }
        }

        if (this.props.language != prevProps.language) {
            console.log("ujra kene renderelni restaurantscreen");
        }
    }

    renderDate() {
        //moment().format("YYYY.MM.DD")
        if (this.props.selectingMode === "day") {
            return (
                <View style={{ backgroundColor: "white" }}>
                    <Text
                        style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: 20,
                            fontWeight: "300",
                            color: "black",
                            fontFamily: configjson.lightFont
                        }}
                    >
                        {moment(this.props.date).format("YYYY.MM.DD")}
                    </Text>
                </View>
            );
        }
        if (this.props.selectingMode === "interval") {
            return (
                <Text
                    style={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "300",
                        color: "black",
                        marginTop: 10
                    }}
                >
                    {moment(this.props.date).format("YYYY.MM.DD")} -{" "}
                    {moment(this.props.endDate).format("YYYY.MM.DD")}
                </Text>
            );
        }
    }

    getRestaurantDatas() {
        this.setState({ loading: true });

        // /v3/admin/partners/:partner/restaurants/:restaurant/stats/platforms

        console.log("USERDATA", this.props.user_data);
        if (this.props.user_data.target_type === "Restaurant") {
            fetch(configjson.base_url + "restaurants/" + this.props.user_data.target_id, {
                headers: {
                    "Cache-Control": "no-cache"
                }
            }).then((response) => {
                if (response.status > 300) {
                    this.setState({
                        isShowingMessage: true,
                        showMessageButton: true,
                        message: Localized.network_error,
                        loading: false
                    });
                    return;
                }

                response.json().then((responseJson) => {
                    const res = responseJson;

                    console.log("restaurantRESPONSE", res);

                    AsyncStorage.setItem("RESTAURANTDATAS", JSON.stringify(res));

                    //this.setState({ restaurant_datas: res });

                    this.props.setSelectedRestaurant({
                        partner_id: res.partner_id,
                        id: res.id,
                        name: res.name,
                        domain: res.domain
                    });
                    console.log("-----getRestaurantDatas() target type Restaurant----------", res);
                    this.getDatasV3(res.partner_id, res.id);

                    this.setState({ loading: false });
                });
            });
        } else {
            //kell egy valaszto hogy melyik etterembe vagyunk :D
            console.log("target type NEM EGYENLO restaurants", this.props.user_data.restaurants);
            let restaurants = this.props.user_data.restaurants;

            console.log(
                "FELTETEL",
                this.props.selectedRestaurant === null,
                this.props.selectedRestaurant
            );

            let selectedRestaurant = {};

            if (this.props.selectedRestaurant === null) {
                selectedRestaurant = restaurants[0];
            } else {
                selectedRestaurant = this.props.selectedRestaurant;
            }

            console.log("selectedRestaurant", restaurants[0], selectedRestaurant.id);

            fetch(configjson.base_url + "restaurants/" + selectedRestaurant.id, {
                headers: {
                    "Cache-Control": "no-cache"
                }
            }).then((response) => {
                if (response.status > 300) {
                    this.setState({
                        isShowingMessage: true,
                        showMessageButton: true,
                        message: Localized.network_error,
                        loading: false
                    });
                    return;
                }

                response.json().then((responseJson) => {
                    const res = responseJson;

                    //console.log("parter login resp", res)

                    AsyncStorage.setItem("RESTAURANTDATAS", JSON.stringify(res));

                    this.setState({ restaurant_datas: res });

                    //selectedRestaurant.domain = res.domain

                    //this.props.setSelectedRestaurant({ partner_id: this.props.user_data.target_id, id: res.id, name: res.name, domain: res.domain });
                    this.props.setSelectedRestaurant({
                        partner_id: res.partner_id,
                        id: res.id,
                        name: res.name,
                        domain: res.domain
                    });
                    //console.log("-----getRestaurantDatas() target type Restaurant ELSE----------")
                    this.getDatasV3(res.partner_id, res.id);
                    this.setState({ loading: false });
                });
            });
        }
    }

    onRefresh() {
        //console.log("onRefresh REstScreen")
        this.setState({ refreshing: true }, () => {
            this.getDatasV3(
                this.props.selectedRestaurant.partner_id,
                this.props.selectedRestaurant.id,
                () => this.setState({ refreshing: false })
            );
        });
    }

    getDatasV3(partner_id, restaurant_id, callback) {
        //orders?restaurant_id=222&fresh=true&preorder=false&pickup=false

        //ha kivan valasztva a datum akkor aznap 0 tol ejfelig kell szurni a dolgokat

        let dateString = "";

        dateString =
            "from=" + moment(this.props.date).startOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]");

        if (this.props.selectingMode == "day") {
            dateString +=
                "&till=" + moment(this.props.date).endOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]");
        } else {
            dateString +=
                "&till=" +
                moment(this.props.endDate).endOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]");
        }

        /// v3/admin/partners/:partner/restaurants/:restaurant/stats/platforms

        let URL =
            configjson.base_url +
            "v3/admin/partners/" +
            partner_id +
            "/restaurants/" +
            restaurant_id +
            "/stats/platforms?" +
            dateString;

        //console.log("USERDATA", this.props.user_data)

        let header = {};

        header.uid = this.props.user_data.uid;
        header.client = this.props.user_data.client;
        header["access-token"] = this.props.user_data.access_token;

        header.Accept = "application/json";
        header["Content-Type"] = "application/json";

        console.log("GET V3 DATAS RestaurantDatasScreen", URL, header);

        fetch(URL, {
            method: "GET",
            headers: header
        })
            .then((response) => {
                this.setState({ loading: false });

                if (response.status > 300) {
                    console.log("GET V3 DATAS RESTDATASCREEN FAILED: ", response);
                    this.setState({ no_prev_order: true });
                    return;
                }
                response.json().then((responseJson) => {
                    const res = responseJson;
                    console.log("GET V3 DATAS RESTDATASCREEN: ", res);

                    // this.setState({
                    //     fresh_orders: res
                    // })

                    //this.props.setFreshOrders(res);
                    this.setState({ income_response: res });
                });

                if (callback) callback();
            })
            .catch((error) => {
                console.log("Problem GET V3 DATAS RESTDATASCREEN: " + error.message);
                if (callback) callback();
            });
    }

    renderRestaurantName() {
        if (this.props.selectedRestaurant) {
            return (
                <Text style={{ width: "100%", textAlign: "center", fontSize: 18, color: "black" }}>
                    {this.props.selectedRestaurant.name}
                </Text>
            );
        } else {
            return <Text>Restaurant Name</Text>;
        }
    }

    renderFreshOrdersCount() {
        if (this.state.income_response) {
            return (
                <View style={{ width: "85%", alignSelf: "center", marginTop: 20 }}>
                    <Text style={{ fontFamily: configjson.boldFont, color: "black" }}>
                        {Localized.orders_total_title}
                    </Text>
                </View>
            );
        } else {
            return null;
        }
    }

    renderFreshOrdersPrice() {
        if (this.state.income_response) {
            let freshOrdersPrice = parseFloat(this.state.income_response.sum);
            // let freshOrdersArray = this.props.fresh_orders;
            // let freshOrdersCount = freshOrdersArray.length;
            // for (let i = 0; i < freshOrdersArray.length; i++) {

            //     freshOrdersPrice += freshOrdersArray[i].price.total;
            // }

            return (
                <View
                    style={{
                        width: "85%",
                        flexDirection: "row",
                        alignSelf: "center",
                        marginBottom: 10
                    }}
                >
                    <Text
                        style={{
                            alignSelf: "flex-start",
                            fontSize: 18,
                            fontFamily: configjson.boldFont,
                            color: "black"
                        }}
                    >
                        {this.state.income_response.count} {Localized.piece}
                    </Text>
                    <Text
                        style={{
                            flexGrow: 1,
                            alignSelf: "flex-end",
                            textAlign: "right",
                            fontSize: 25,
                            fontFamily: configjson.boldFont,
                            color: "black"
                        }}
                    >
                        {freshOrdersPrice.toLocaleString("hu-HU")} Ft
                    </Text>
                </View>
            );
        } else {
            return null;
        }
    }

    renderSitInOrders() {
        if (this.state.income_response) {
            let sitInOrdersPrice = 0;
            let platforms = this.state.income_response.platforms;
            let sitInordersCount = 0;
            for (let i = 0; i < platforms.length; i++) {
                if (platforms[i].platform === "sit_in") {
                    sitInOrdersPrice += parseFloat(platforms[i].sum);
                    sitInordersCount += platforms[i].count;
                }
            }

            return (
                <>
                    <View style={{ width: "85%", alignSelf: "center", paddingTop: 10 }}>
                        <Text style={{ fontFamily: configjson.regularFont }}>
                            {Localized.sit_in_orders_title}
                        </Text>
                    </View>
                    <View style={{ width: "85%", flexDirection: "row", alignSelf: "center" }}>
                        <Text
                            style={{
                                alignSelf: "flex-start",
                                fontSize: 18,
                                fontFamily: configjson.boldFont
                            }}
                        >
                            {sitInordersCount} {Localized.piece}
                        </Text>
                        <Text
                            style={{
                                flexGrow: 1,
                                alignSelf: "flex-end",
                                textAlign: "right",
                                fontSize: 18,
                                fontFamily: configjson.boldFont,
                                marginBottom: 10
                            }}
                        >
                            {sitInOrdersPrice.toLocaleString("hu-HU")} Ft
                        </Text>
                    </View>
                </>
            );
        } else {
            return null;
        }
    }

    renderTakeAwayOrders() {
        if (this.state.income_response) {
            let takeAwayOrdersPrice = 0;
            let platforms = this.state.income_response.platforms;
            let takeAwayOrdersCount = 0;
            for (let i = 0; i < platforms.length; i++) {
                if (platforms[i].platform === "take_away" || platforms[i].platform === "pickup") {
                    takeAwayOrdersPrice += parseFloat(platforms[i].sum);
                    takeAwayOrdersCount += platforms[i].count;
                }
            }

            return (
                <>
                    <View
                        style={{
                            width: "85%",
                            flexDirection: "row",
                            alignSelf: "center",
                            paddingTop: 10
                        }}
                    >
                        <Text style={{ fontFamily: configjson.regularFont }}>
                            {Localized.take_away_orders_title}
                        </Text>
                    </View>
                    <View style={{ width: "85%", flexDirection: "row", alignSelf: "center" }}>
                        <Text
                            style={{
                                alignSelf: "flex-start",
                                fontSize: 18,
                                fontFamily: configjson.boldFont
                            }}
                        >
                            {takeAwayOrdersCount} {Localized.piece}
                        </Text>
                        <Text
                            style={{
                                flexGrow: 1,
                                alignSelf: "flex-end",
                                textAlign: "right",
                                fontSize: 18,
                                fontFamily: configjson.boldFont,
                                marginBottom: 10
                            }}
                        >
                            {takeAwayOrdersPrice.toLocaleString("hu-HU")} Ft
                        </Text>
                    </View>
                </>
            );
        } else {
            return null;
        }
    }

    renderDeliveryOrders() {
        if (this.state.income_response) {
            let deliveryOrdersPrice = 0;
            let platforms = this.state.income_response.platforms;
            let deliveryOrdersCount = 0;
            for (let i = 0; i < platforms.length; i++) {
                if (
                    platforms[i].platform != "take_away" &&
                    platforms[i].platform != "sit_in" &&
                    platforms[i].platform != "pickup"
                ) {
                    deliveryOrdersPrice += parseFloat(platforms[i].sum);
                    deliveryOrdersCount += platforms[i].count;
                }
            }

            return (
                <>
                    <View
                        style={{
                            width: "85%",
                            flexDirection: "row",
                            alignSelf: "center",
                            paddingTop: 10
                        }}
                    >
                        <Text style={{ fontFamily: configjson.regularFont }}>
                            {Localized.deliveries_title}
                        </Text>
                    </View>
                    <View style={{ width: "85%", flexDirection: "row", alignSelf: "center" }}>
                        <Text
                            style={{
                                alignSelf: "flex-start",
                                fontSize: 18,
                                fontFamily: configjson.boldFont
                            }}
                        >
                            {deliveryOrdersCount} {Localized.piece}
                        </Text>
                        <Text
                            style={{
                                flexGrow: 1,
                                alignSelf: "flex-end",
                                textAlign: "right",
                                fontSize: 18,
                                fontFamily: configjson.boldFont,
                                marginBottom: 10
                            }}
                        >
                            {deliveryOrdersPrice.toLocaleString("hu-HU")} Ft
                        </Text>
                    </View>
                </>
            );
        } else {
            return null;
        }
    }

    render() {
        //console.log("lefutarender");
        return (
            <SafeAreaView style={{ width: "100%", height: "100%", backgroundColor: "#E0E7E9" }}>
                <ScrollView
                    style={{ width: "100%", height: "85%" }}
                    refreshControl={
                        <RefreshControl
                            colors={["#A93D73"]} //ANDROID
                            tintColor="#A93D73" //IOS
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                >
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "white",
                            //Anrdoid
                            elevation: 4,
                            //IOS
                            shadowColor: "grey",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            zIndex: 1
                        }}
                    >
                        <UpdateAppModal is_visible={this.state.updateModalVisible} />

                        <MenuButton icon={require("../resources/menu.png")} />
                        <View
                            style={{ width: "45%", alignItems: "center", justifyContent: "center" }}
                        >
                            <Text
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    fontSize: 20,
                                    color: "black",
                                    fontFamily: configjson.boldFont
                                }}
                            >
                                {Localized.summary}
                            </Text>
                            {this.renderDate()}
                        </View>
                        <CalendarButton icon={require("../resources/calendar.png")} />
                    </View>

                    <View
                        style={{
                            width: "100%",
                            height: 80,
                            alignSelf: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "white",
                            marginBottom: 10
                        }}
                    >
                        {this.renderFreshOrdersCount()}
                        {this.renderFreshOrdersPrice()}
                    </View>

                    <View
                        style={{
                            backgroundColor: "#C9D3D6",
                            marginHorizontal: 10,
                            marginBottom: 10,
                            paddingVertical: 10,
                            borderRadius: 5
                        }}
                    >
                        {this.renderSitInOrders()}
                    </View>

                    <View
                        style={{
                            backgroundColor: "#C9D3D6",
                            marginHorizontal: 10,
                            marginBottom: 10,
                            paddingVertical: 10,
                            borderRadius: 5
                        }}
                    >
                        {this.renderTakeAwayOrders()}
                    </View>

                    <View
                        style={{
                            backgroundColor: "#C9D3D6",
                            marginHorizontal: 10,
                            marginBottom: 10,
                            paddingVertical: 10,
                            borderRadius: 5
                        }}
                    >
                        {this.renderDeliveryOrders()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        user_data: state.loginReducer.user_data,
        date: state.loginReducer.date,
        endDate: state.loginReducer.endDate,
        selectingMode: state.loginReducer.selectingMode,
        selectedRestaurant: state.restaurantReducer.selectedRestaurant,
        fresh_orders: state.restaurantReducer.fresh_orders,
        language: state.languageReducer.language
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (endpoint, email, pass, has_loading_icon) =>
            dispatch(actionHelper.login(endpoint, email, pass, has_loading_icon)),
        resetFieldStates: () => dispatch(actionHelper.resetFieldStates()),
        getRestaurant: (id, is_secondary_language) =>
            dispatch(actionHelper.getRestaurant(id, is_secondary_language)),
        setDate: (date) => dispatch(actionHelper.setDate(date)),
        setEndDate: (endDate) => dispatch(actionHelper.setEndDate(endDate)),
        setSelectingMode: (selectingMode) => dispatch(actionHelper.setSelectingMode(selectingMode)),
        setSelectedRestaurant: (selectedRestaurant) =>
            dispatch(actionHelper.setSelectedRestaurant(selectedRestaurant)),
        setFreshOrders: (fresh_orders) => dispatch(actionHelper.setFreshOrders(fresh_orders))
    };
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RestaurantDatasScreen));
