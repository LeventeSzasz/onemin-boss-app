import React, {Component} from 'react';
import {withNavigation, SafeAreaView} from 'react-navigation';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import * as actionHelper from '../store/actions/actionHelper';
import Localized from '../utils/Localized.js';
import moment from 'moment';
import OrderDetailsModal from '../components/OrderDetailsModal';
import MenuButton from '../components/MenuButton';
import CalendarButton from '../components/CalendarButton';
import {getPaymethodLocalized} from '../utils/TranslateID';

var configjson = require('../config.json');
const screen = Dimensions.get('window');

class OrdersScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      //fresh_orders: [],
      filtered_orders: [],
      orderDetailsModalVisible: false,
      detailedOrder: {},
      refreshing: false,
      loading: true,
      stornoFilter: '',
      discountFilter: '',
      page: 0,
    };
  }

  componentDidMount() {
    this.getOrders();

    console.log('paymethods redux', this.props.paymethods[0].name);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.date != prevProps.date ||
      this.props.endDate != prevProps.endDate ||
      this.props.selectingMode != prevProps.selectingMode ||
      this.props.selectedRestaurant != prevProps.selectedRestaurant
    ) {
      this.getOrders();
    }
  }

  onRefresh() {
    console.log('onRefresh');
    this.setState({refreshing: true}, () => {
      this.getOrders(() => this.setState({refreshing: false}));
    });
  }

  loadNextPage() {
    console.log('loadnextPage');
    this.setState({page: this.state.page + 1}, () => {
      this.getOrders();
    });
  }

  getOrders(callback) {
    this.setState({loading: true});
    //orders?restaurant_id=222&fresh=true&preorder=false&pickup=false

    let dateString = '';

    dateString =
      'from=' +
      moment(this.props.date).startOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');

    if (this.props.selectingMode == 'day') {
      dateString +=
        '&till=' +
        moment(this.props.date).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    } else {
      dateString +=
        '&till=' +
        moment(this.props.endDate)
          .endOf('day')
          .format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    }

    let URL =
      configjson.base_url +
      'v3/admin/partners/' +
      this.props.selectedRestaurant.partner_id +
      '/restaurants/' +
      this.props.selectedRestaurant.id +
      '/orders?' +
      dateString +
      '&preorder=false' +
      '&pickup=false' +
      '&page=' +
      this.state.page +
      '&limit=40' +
      this.state.stornoFilter +
      this.state.discountFilter;

    console.log('OrdersScreen URL', URL);

    let header = {};

    header.uid = this.props.user_data.uid;
    header.client = this.props.user_data.client;
    header['access-token'] = this.props.user_data.access_token;

    header.Accept = 'application/json';
    header['Content-Type'] = 'application/json';

    console.log('GETORDERSURL Orders', URL);

    fetch(URL, {
      method: 'GET',
      headers: header,
    })
      .then(response => {
        this.setState({loading: false});

        if (response.status > 300) {
          console.log('getOrders ORDERSCREEN FAILED: ', response);
          this.setState({no_prev_order: true});
          return;
        }
        response.json().then(responseJson => {
          const res = responseJson;
          console.log('getOrders ORDERSCREEN: ', res);

          this.setState({
            //fresh_orders: [...this.state.filtered_orders, ...res],
            filtered_orders: [...this.state.filtered_orders, ...res],
            loading: false,
          });

          if (callback) callback();

          //this.toggleStornoFilter();
        });
      })
      .catch(error => {
        console.log('Problem getOrders ORDERSCREEN: ' + error.message);
        if (callback) callback();
      });
  }

  renderScreenTitle() {
    return (
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: 20,
          fontFamily: configjson.boldFont,
          color: 'black',
        }}>
        {Localized.orders}
      </Text>
    );
  }

  renderDate() {
    //moment().format("YYYY.MM.DD")
    if (this.props.selectingMode === 'day') {
      return (
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 20,
            fontFamily: configjson.lightFont,
          }}>
          {moment(this.props.date).format('YYYY.MM.DD')}
        </Text>
      );
    }
    if (this.props.selectingMode === 'interval') {
      return (
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 20,
            fontFamily: configjson.lightFont,
          }}>
          {moment(this.props.date).format('YYYY.MM.DD')} -{' '}
          {moment(this.props.endDate).format('YYYY.MM.DD')}
        </Text>
      );
    }
  }

  orderItemPressed(order) {
    console.log('orderItemPressedLOG', order.id);

    if (order.status === 'received' || order.status === 'succeeded') {
      console.log('biztoshogymegakarodneznieztarendelesttefi?');
    } else {
      this.getSingleOrder(order.id);
    }
  }

  toggleStornoFilter() {
    console.log('toggleStornoFilter');
    if (this.state.stornoFilter === '') {
      this.setState(
        {
          stornoFilter: '&storno=true',
          page: 0,
          filtered_orders: [],
        },
        () => {
          this.getOrders();
        },
      );
    } else {
      this.setState(
        {
          stornoFilter: '',
          page: 0,
          filtered_orders: [],
        },
        () => {
          this.getOrders();
        },
      );
    }
  }

  toggleDicountFilter() {
    console.log('toggleDicountFilter');
    if (this.state.discountFilter === '') {
      this.setState(
        {
          discountFilter: '&has_discount=true',
          page: 0,
          filtered_orders: [],
        },
        () => {
          this.getOrders();
        },
      );
    } else {
      this.setState(
        {
          discountFilter: '',
          page: 0,
          filtered_orders: [],
        },
        () => {
          this.getOrders();
        },
      );
    }
  }

  getSingleOrder(order_id) {
    let URL = configjson.base_url + 'orders/' + order_id;
    let header = {};

    header.uid = this.props.user_data.uid;
    header.client = this.props.user_data.client;
    header['access-token'] = this.props.user_data.access_token;
    header.Accept = 'application/json';
    header['Content-Type'] = 'application/json';

    console.log('GETORDER URL', URL, header);

    fetch(URL, {
      method: 'GET',
      headers: header,
    })
      .then(response => {
        this.setState({loading: false});

        if (response.status > 300) {
          console.log('getOrder FAILED : ', response);
          this.setState({no_prev_order: true});
          return;
        }
        response.json().then(responseJson => {
          const res = responseJson;
          console.log('getOrder: ', res);

          this.setState(
            {
              detailedOrder: res,
            },
            () => {
              this.setState({orderDetailsModalVisible: true});
            },
          );
        });
      })
      .catch(error => {
        console.log('Problem get Order: ' + error.message);
      });
  }

  closeOrderDetailModal = () => {
    this.setState({
      orderDetailsModalVisible: false,
    });
  };

  renderOrderStatus(item) {
    if (item.archived_at != null) {
      return (
        <View
          style={{
            backgroundColor: 'red',
            borderBottomLeftRadius: 5,
            alignSelf: 'flex-end',
            padding: 5,
          }}>
          <Text style={{fontFamily: configjson.boldFont, color: 'white'}}>
            {Localized.storno}
          </Text>
        </View>
      );
    }

    switch (item.status) {
      case 'received':
        return (
          <View
            style={{
              backgroundColor: '#29B9FF',
              borderBottomLeftRadius: 5,
              alignSelf: 'flex-end',
              padding: 5,
            }}>
            <Text style={{fontFamily: configjson.boldFont, color: 'white'}}>
              {Localized[item.status]}
            </Text>
          </View>
        );
      case 'processed':
        //feldolgozva
        return (
          <View
            style={{
              backgroundColor: '#7DE394',
              borderBottomLeftRadius: 5,
              alignSelf: 'flex-end',
              padding: 5,
            }}>
            <Text
              style={{
                fontFamily: configjson.boldFont,
                color: 'white',
                textAlign: 'right',
              }}>
              {Localized[item.status]}
            </Text>
          </View>
        );
      case 'succeeded':
        //fuggöbenn
        return (
          <View
            style={{
              backgroundColor: '#FFA650',
              borderBottomLeftRadius: 5,
              alignSelf: 'flex-end',
              padding: 5,
            }}>
            <Text
              style={{
                fontFamily: configjson.boldFont,
                color: 'white',
                textAlign: 'right',
              }}>
              {Localized[item.status]}
            </Text>
          </View>
        );
      default:
        return (
          <Text style={{fontFamily: configjson.boldFont, textAlign: 'right'}}>
            {' '}
            {item.status}{' '}
          </Text>
        );
    }
  }

  renderPlatformIcon(item) {
    let iconnsize = 20;
    let color = 'grey';

    //android ios browser browser_ios browser_android facebook messenger sit_in take_away phone pizzahu ordit netpincer

    switch (item.platform) {
      case 'android':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/android.png')}
            resizeMode="contain"
          />
        );
      case 'ios':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/apple.png')}
            resizeMode="contain"
          />
        );
      case 'browser':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/world-wide-web.png')}
            resizeMode="contain"
          />
        );
      case 'browser_ios':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/smartphone.png')}
            resizeMode="contain"
          />
        );
      case 'browser_android':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/smartphone.png')}
            resizeMode="contain"
          />
        );
      case 'facebook':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/facebook.png')}
            resizeMode="contain"
          />
        );
      case 'messenger':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/messenger.png')}
            resizeMode="contain"
          />
        );
      case 'sit_in':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/placeholder.png')}
            resizeMode="contain"
          />
        );
      case 'take_away':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/food-delivery.png')}
            resizeMode="contain"
          />
        );
      case 'phone':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/phone-ringing.png')}
            resizeMode="contain"
          />
        );
      case 'pizzahu':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/world-wide-web.png')}
            resizeMode="contain"
          />
        );
      case 'ordit':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/world-wide-web.png')}
            resizeMode="contain"
          />
        );
      case 'netpincer':
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/foodpanda.png')}
            resizeMode="contain"
          />
        );
      default:
        return (
          <Image
            style={{height: iconnsize, width: iconnsize, tintColor: color}}
            source={require('../resources/world-wide-web.png')}
            resizeMode="contain"
          />
        );
    }
  }

  renderOrderPlace(item) {
    if (item.platform != 'sit_in' && item.platform != 'take_away') {
      return (
        <>
          <Text
            style={{
              fontFamily: configjson.boldFont,
              alignSelf: 'flex-start',
              fontSize: 20,
              flex: 1,
              marginHorizontal: 9,
            }}>
            {item.first_name} {item.last_name}
          </Text>

          <View
            style={{width: '95%', flexDirection: 'row', alignSelf: 'center'}}>
            <View style={{flexDirection: 'column', alignSelf: 'center'}}>
              <Text>
                <Text style={{fontFamily: configjson.regularFont}}>
                  {item.city}
                  {item.city ? ',' : ''}{' '}
                </Text>
                <Text style={{fontFamily: configjson.regularFont}}>
                  {item.street}{' '}
                </Text>
                <Text style={{fontFamily: configjson.regularFont}}>
                  {item.premise_number}
                </Text>
                <Text style={{fontFamily: configjson.regularFont}}>
                  {item.floor} {item.floor ? '/' : ''}{' '}
                </Text>
                <Text style={{fontFamily: configjson.regularFont}}>
                  {item.door_number} {item.door_number ? '/' : ''}{' '}
                </Text>
                <Text style={{fontFamily: configjson.regularFont}}>
                  {item.doorbell}
                </Text>
              </Text>
            </View>
          </View>
        </>
      );
    } else {
      return (
        <>
          <Text
            style={{
              fontFamily: configjson.boldFont,
              alignSelf: 'flex-start',
              fontSize: 20,
              flex: 1,
              marginHorizontal: 9,
            }}>
            {item.table_name}
          </Text>
        </>
      );
    }
  }

  renderDiscount = item => {
    //console.log("item.discount_price", item.discount_price);
    if (parseFloat(item.discount_price) != 0 && item.discount_price != null) {
      return (
        <>
          <Text
            style={{
              fontFamily: configjson.regularFont,
              alignSelf: 'flex-end',
              fontSize: 18,
              flex: 1,
              marginEnd: 10,
              textDecorationLine: 'line-through',
              textDecorationStyle: 'solid',
            }}>
            {parseFloat(item.products_base).toLocaleString('hu-HU')} Ft
          </Text>
        </>
      );
    } else {
      return null;
    }
  };

  renderOrderItem = flatListItem => {
    let item = flatListItem.item;
    //console.log("ITEM", item)
    // TODO currency

    return (
      <View
        key={item.id}
        style={{
          flex: 1,
          flexDirection: 'column',
          margin: 1,
          backgroundColor: 'white',
          margin: 5,
          // IOS SHADOW
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.8,
          shadowRadius: 2,
          // ANDROID SHADOW
          elevation: 2,
        }}>
        <TouchableOpacity onPress={() => this.orderItemPressed(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              flex: 1,
              marginStart: 10,
            }}>
            <Text style={{fontFamily: configjson.boldFont, marginTop: 10}}>
              #{item.counter}
            </Text>
            <Text
              style={{
                fontFamily: configjson.lightFont,
                marginTop: 10,
                flex: 1,
              }}>
              {moment(item.created_at).format(' MM.DD - HH:mm')}
            </Text>
            {this.renderOrderStatus(item)}
          </View>

          {this.renderOrderPlace(item)}

          {this.renderDiscount(item)}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            {this.renderPlatformIcon(item)}
            <Text
              style={{
                fontFamily: configjson.regularFont,
                fontSize: 15,
                textAlign: 'right',
                alignSelf: 'center',
                flexGrow: 1,
                fontFamily: configjson.italicFont,
                paddingTop: 5,
                marginHorizontal: 5,
                color: 'grey',
              }}>
              {getPaymethodLocalized(
                this.props.paymethods,
                item.payment_method,
              )}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: configjson.boldFont,
                alignSelf: 'flex-end',
                textAlign: 'right',
              }}>
              {parseFloat(item.total_price).toLocaleString('hu-HU')} Ft
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  render() {
    return (
      <SafeAreaView
        style={{width: '100%', height: '100%', backgroundColor: '#E0E7E9'}}>
        <View
          style={{width: '100%', height: '100%', backgroundColor: '#E0E7E9'}}
          onScroll={({nativeEvent}) => {
            if (this.isCloseToBottom(nativeEvent)) {
              console.log('scrollview end reached');
            }
          }}
          scrollEventThrottle={400}>
          <OrderDetailsModal
            isVisible={this.state.orderDetailsModalVisible}
            orderItem={this.state.detailedOrder}
            closeModal={this.closeOrderDetailModal}
          />
          <View
            style={{
              width: '100%',
              backgroundColor: '#E0E7E9',

              marginBottom: 20,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                //Anrdoid
                elevation: 4,
                //IOS
                shadowColor: 'grey',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                marginBottom: 5,
              }}>
              <MenuButton icon={require('../resources/menu.png')} />
              <View style={{width: '45%', justifyContent: 'center'}}>
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 15,
                    color: 'black',
                    fontFamily: configjson.lightFont,
                  }}>
                   {this.props.selectedRestaurant?.name
                  ? this.props.selectedRestaurant.name
                  : '-'}
                </Text>
                {this.renderScreenTitle()}
                {this.renderDate()}
              </View>
              <CalendarButton icon={require('../resources/calendar.png')} />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={{margin: 10, flexDirection: 'row'}}
                onPress={() => this.toggleStornoFilter()}>
                <Image
                  style={{width: 20, height: 20, tintColor: '#A93D73'}}
                  source={
                    this.state.stornoFilter === ''
                      ? require('../resources/filter.png')
                      : require('../resources/filter-filled.png')
                  }></Image>
                <Text style={{fontSize: 17}}>{Localized.storno_filter}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{margin: 10, flexDirection: 'row'}}
                onPress={() => this.toggleDicountFilter()}>
                <Image
                  style={{width: 20, height: 20, tintColor: '#A93D73'}}
                  source={
                    this.state.discountFilter === ''
                      ? require('../resources/filter.png')
                      : require('../resources/filter-filled.png')
                  }></Image>
                <Text style={{fontSize: 17}}>{Localized.discount_filter}</Text>
              </TouchableOpacity>
            </View>

            {this.state.loading ? (
              <ActivityIndicator
                size="large"
                color="#A93D73"
                animating={this.state.loading}
              />
            ) : null}

            {this.state.filtered_orders.length > 0 ? null : (
              <View
                style={{
                  backgroundColor: '#C9D3D6',
                  marginHorizontal: 10,
                  marginBottom: 10,
                  paddingVertical: 10,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: configjson.boldFont,
                    margin: 10,
                    textAlign: 'center',
                  }}>
                  {Localized.no_orders_to_show}
                </Text>
              </View>
            )}

            <FlatList
              data={this.state.filtered_orders}
              renderItem={this.renderOrderItem}
              keyExtractor={item => item.id.toString()}
              style={{height: '73%'}}
              onEndReached={() => this.loadNextPage()}
              refreshControl={
                <RefreshControl
                  colors={['#A93D73']} //ANDROID
                  tintColor="#A93D73" //IOS
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }
            />
            {/* {
                            this.state.fresh_orders.map((item) => {
                                return (this.renderOrderItem(item))
                            })

                        } */}
            {/* <View style={{ height: screen.height / 9 }}></View> */}
          </View>
        </View>
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
    language: state.languageReducer.language,
    paymethods: state.loginReducer.paymethods,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (endpoint, email, pass, has_loading_icon) =>
      dispatch(actionHelper.login(endpoint, email, pass, has_loading_icon)),
    resetFieldStates: () => dispatch(actionHelper.resetFieldStates()),
    getRestaurant: (id, is_secondary_language) =>
      dispatch(actionHelper.getRestaurant(id, is_secondary_language)),
  };
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(OrdersScreen),
);
