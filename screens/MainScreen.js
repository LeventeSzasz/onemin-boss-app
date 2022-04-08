import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import OrdersScreen from "./OrdersScreen";
import RestaurantDatasScreen from "./RestaurantDatasScreen";
import StatisticsScreen from "./StatisticsScreen";
import { BottomNavigation, Text } from "react-native-paper";

const RestaurantDatasRoute = () => <RestaurantDatasScreen />;

const OrdersRoute = () => <OrdersScreen />;

const StatisticsRoute = () => <StatisticsScreen />;

class MainScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {
                    key: "restaurantdatas",
                    title: "Restaurant Datas",
                    color: "#3F51B5",
                    icon: require("../resources/restaurant_icon.png")
                },
                {
                    key: "orders",
                    title: "Orders",
                    color: "#009688",
                    icon: require("../resources/orders.png")
                },
                {
                    key: "statistics",
                    title: "Statistics",
                    color: "#ff5056",
                    icon: require("../resources/statistics_icon.png")
                }
            ]
        };
    }

    _handleIndexChange = (index) => this.setState({ index });

    _renderScene = BottomNavigation.SceneMap({
        restaurantdatas: RestaurantDatasRoute,
        orders: OrdersRoute,
        statistics: StatisticsRoute
    });

    render() {
        return (
            <BottomNavigation
                navigationState={this.state}
                onIndexChange={this._handleIndexChange}
                renderScene={this._renderScene}
                shifting={true}
            />
        );
    }
}

export default MainScreen;
