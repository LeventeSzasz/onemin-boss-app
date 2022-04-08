/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import Navigator from './Navigator';
import BottomMenu from './components/BottomMenu';
import loginReducer from './store/reducers/loginReducer';
import languageReducer from './store/reducers/languageReducer';
import bottomMenuReducer from './store/reducers/bottomMenuReducer';
import restaurantReducer from './store/reducers/restaurantReducer';
import SafeAreaView, {SafeAreaProvider} from 'react-native-safe-area-view';
import LeftMenu from './components/LeftMenu';

const rootReducer = combineReducers({
  loginReducer,
  languageReducer,
  bottomMenuReducer,
  restaurantReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <LeftMenu />
        <SafeAreaView style={{width: '100%', height: '100%'}}>
          <Navigator />
          <BottomMenu />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
