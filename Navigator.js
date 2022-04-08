/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import LoginScreen from './screens/LoginScreen';
import OrdersScreen from './screens/OrdersScreen';
import RestaurantDatasScreen from './screens/RestaurantDatasScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import MessageScreen from './screens/MessageScreen';

const MainNavigator = createStackNavigator({
  LoginScreen: {screen: LoginScreen},
  OrdersScreen: {screen: OrdersScreen},
  RestaurantDatasScreen: {screen: RestaurantDatasScreen},
  StatisticsScreen: {screen: StatisticsScreen},
  RegistrationScreen: {screen: RegistrationScreen},
  MessageScreen: {screen: MessageScreen}
});

const Navigator = createAppContainer(MainNavigator);

export default Navigator;
