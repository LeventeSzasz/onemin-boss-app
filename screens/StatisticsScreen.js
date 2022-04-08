import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { SafeAreaView } from "react-navigation";
import { Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Circle, G, Line, Svg } from 'react-native-svg';
import { Text as SVGText } from 'react-native-svg';
import { PieChart, BarChart, Grid, YAxis } from 'react-native-svg-charts'
import { connect } from 'react-redux';
import * as actionHelper from '../store/actions/actionHelper';
import Localized from '../utils/Localized.js';
import moment from 'moment';
import MenuButton from '../components/MenuButton'
import CalendarButton from '../components/CalendarButton'
import { TranslateSegmentFunction } from '../utils/TranslateID';
import SegmentModal from '../components/SegmentModal';
import InfoModal from '../components/InfoModal';
import * as scale from 'd3-scale'

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


var configjson = require('../config.json');

const colorsForChart = ["#5B6DC0", "#293A88", "#8B92AE", "#1B2C77",
    "#CEACCE", "#CFBED0", "#D0D0D0", "#D0E1D2", "#D1F1D4", "#CFFFD0",
    "#F9D877", "#7CBFB6", "#92CBDC", "#CEDDF2", "#B196C1", "#906FA8",]

/* 

const colorsForChart = [ "#5B6DC0", "#293A88", "#8B92AE" , "#1B2C77",
"#CEACCE", "#CFBED0", "#D0D0D0" , "#D0E1D2", "#D1F1D4", "#CFFFD0",
"#F9D877", "#7CBFB6", "#92CBDC" , "#CEDDF2", "#B196C1", "#906FA8", ]

*/

const randomColor = () => (colorsForChart[Math.floor(Math.random() * 4) + 0])

const PieLabels = ({ slices }) => {
    return slices.map((slice, index) => {
        const { labelCentroid, pieCentroid, data } = slice;
        return (
            <G key={index}>
                <Line
                    x1={labelCentroid[0]}
                    y1={labelCentroid[1]}
                    x2={pieCentroid[0]}
                    y2={pieCentroid[1]}
                    stroke={data.svg.fill}
                />
                <Circle
                    cx={labelCentroid[0]}
                    cy={labelCentroid[1]}
                    r={15}
                    fill={data.svg.fill}
                />
            </G>
        )
    })
}

// let segmentData = [{
//     label: Localized.payment_method, value: 'payment_method',
// }, {
//     label: Localized.platform, value: 'platform',
// }];

let segmentData = [{
    label: Localized.payment_method, value: 'payment-methods', arrayHelper: 'payment_methods', itemName: 'payment_method'
}, {
    label: Localized.platform, value: 'platforms', arrayHelper: 'platforms', itemName: 'platform'
}, {
    label: Localized.product_categories, value: 'product-categories', arrayHelper: 'product_categories', itemName: 'product_category'
},{
    label: Localized.products, value: 'products', arrayHelper: 'products', itemName: 'product'
},{
    label: Localized.subproducts, value: 'subproducts', arrayHelper: 'subproducts', itemName: 'subproduct'
}, {
    label: Localized.options, value: 'options', arrayHelper: 'options', itemName: 'option'
}, {
    label: Localized.users, value: 'shadow-customers', arrayHelper: 'shadow_customers', itemName: 'shadow_customer'
}
];


class StatisticsScreen extends React.PureComponent {
    static navigationOptions = {
        headerShown: false
    };
    constructor(props) {
        super(props);
        this.state = {
            raw_statistics: [],
            statistics: [],
            statisticsSVG: [],
            refreshing: false,
            segment_by: { label: Localized.payment_method, value: 'payment-methods', arrayHelper: 'payment_methods', itemName: 'payment_method' },
            segmentModalVisible: false,
            infoModalVisible: false,
            info: {},
            loading: true,
        }
    }

    //https://onemin-prod.herokuapp.com/api/stats/summary?restaurant_id=109&group_by=day&segment_by=payment_method&start_date=2020-01-03&end_date=2020-02-12
    //https://backend-prod.oneminorder.hu/api/summary?restaurant_id=109&group_by=day&segment_by=payment_method&category_segment=product&start_date=2020-01-03&end_date=2020-02-12&show_items=true&items_order_by=total

    componentDidMount() {
        //this.getStatistics(this.props.selectedRestaurant.id)
        this.getV3Statistics(this.props.selectedRestaurant.partner_id, this.props.selectedRestaurant.id);
        //console.log("STATISTICS", this.state.statistics);
        //console.log("COLORS", colorsForChart[0]);
        //Localized.setLanguage("hu")

        segmentData = [{
            label: Localized.payment_method, value: 'payment-methods', arrayHelper: 'payment_methods', itemName: 'payment_method'
        }, {
            label: Localized.platform, value: 'platforms', arrayHelper: 'platforms', itemName: 'platform'
        }, {
            label: Localized.product_categories, value: 'product-categories', arrayHelper: 'product_categories', itemName: 'product_category'
        },{
            label: Localized.products, value: 'products', arrayHelper: 'products', itemName: 'product'
        },{
            label: Localized.subproducts, value: 'subproducts', arrayHelper: 'subproducts', itemName: 'subproduct'
        }, {
            label: Localized.options, value: 'options', arrayHelper: 'options', itemName: 'option'
        }, {
            label: Localized.users, value: 'shadow-customers', arrayHelper: 'shadow_customers', itemName: 'shadow_customer'
        }
        ];

        this.setSegmentBy(segmentData[0]);
    }

    componentDidUpdate(prevProps) {
        if (this.props.date != prevProps.date ||
            this.props.endDate != prevProps.endDate ||
            this.props.selectingMode != prevProps.selectingMode ||
            this.props.segment_by != prevProps.segment_by ||
            this.props.selectedRestaurant != prevProps.selectedRestaurant) {
            //this.getStatistics(this.props.selectedRestaurant.id);
            this.setState({ loading: true }, () => this.getV3Statistics(this.props.selectedRestaurant.partner_id, this.props.selectedRestaurant.id))

        }

        if (this.props.language != prevProps.language) {
            //console.log("ujra kene renderelni")
            segmentData = [{
                label: Localized.payment_method, value: 'payment-methods', arrayHelper: 'payment_methods', itemName: 'payment_method'
            }, {
                label: Localized.platform, value: 'platforms', arrayHelper: 'platforms', itemName: 'platform'
            }, {
                label: Localized.product_categories, value: 'product-categories', arrayHelper: 'product_categories', itemName: 'product_category'
            },{
                label: Localized.products, value: 'products', arrayHelper: 'products', itemName: 'product'
            },{
                label: Localized.subproducts, value: 'subproducts', arrayHelper: 'subproducts', itemName: 'subproduct'
            }, {
                label: Localized.options, value: 'options', arrayHelper: 'options', itemName: 'option'
            }, {
                label: Localized.users, value: 'shadow-customers', arrayHelper: 'shadow_customers', itemName: 'shadow_customer'
            }
            ];

        }
    }

    // groupBy = function (xs, key) {
    //     return xs.reduce(function (rv, x) {
    //         (rv[x[key]] = rv[x[key]] || []).push(x);
    //         return rv;
    //     }, {});
    // };

    onRefresh() {
        console.log("onRefresh")
        this.setState({ refreshing: true }, () => {
            this.getV3Statistics(this.props.selectedRestaurant.partner_id, this.props.selectedRestaurant.id, () => this.setState({ refreshing: false }));
        })
    }

    renderScreenTitle() {
        return <Text style={{ width: "100%", textAlign: "center", fontSize: 20, fontFamily: configjson.boldFont, color: "black" }}>{Localized.statistics}</Text>
    }

    renderDate() {
        //moment().format("YYYY.MM.DD")
        if (this.props.selectingMode === "day") {
            return (
                <Text style={{ width: "100%", textAlign: "center", fontSize: 20, fontFamily: configjson.lightFont, color: "black" }}>{moment(this.props.date).format("YYYY.MM.DD")}</Text>)
        }
        if (this.props.selectingMode === "interval") {
            return (
                <Text style={{ width: "100%", textAlign: "center", fontSize: 20, fontFamily: configjson.lightFont, color: "black" }}>{moment(this.props.date).format("YYYY.MM.DD")} - {moment(this.props.endDate).format("YYYY.MM.DD")}</Text>)
        }

    }

    renderChart(segment_by, statistics) {

        if ( this.state.segmentModalVisible ){
            return null
        }

        console.log("RENDERCHART", statistics, this.state.loading, segment_by)

        let rowHeight = screenHeight / 20

        if ( segment_by.value == 'product-categories' || segment_by.value == 'products' || segment_by.value == 'subproducts' || segment_by.value == 'options' ) {

            console.log("prodcatshart", statistics)

            let max = 0;

            let barChartHelper = []
            for (let item of statistics) {
                //console.log("barcsarthelper", item)
                barChartHelper.push(item.value)
                if (item.value > max) max = item.value
            }

            //let chartHeight = statistics.length * rowHeight

            //console.log("barcharthelper", barChartHelper, max)

            const CUT_OFF = max / 3
            let BarLabels = ({ x, y, bandwidth, data }) => (
                data.map((value, index) => (
                    <SVGText
                        key={index}
                        x={value > CUT_OFF ? x(0) + 10 : x(value) + 10}
                        y={y(index) + (bandwidth / 2)}
                        fontSize={20}
                        fontFamily={configjson.regularFont}
                        fill={value > CUT_OFF ? '#135387' : '#135387'}
                        alignmentBaseline={'middle'}
                    >
                        {value} Ft
                    </SVGText>
                ))
            )

            return (
                <View style={{ flexDirection: 'row', padding: 10 }}>

                    <View style={{ marginTop: 10, width: "50%", marginBottom: 10}}>
                        {statistics.map((item, index) => {
                            //console.log("statisticsBARCHART", this.state.raw_statistics[index])
                            return (
                                <TouchableOpacity style={{ justifyContent: "center", height: rowHeight }} key={index}
                                onPress={ segment_by.value == 'product-categories' ? () => this.showInfoModal(this.state.raw_statistics[index]) : () => console.log("nemkellmodal")} 
                                >
                                    <Text key={index} style={{ color: "#A93D73", fontSize: 15, textAlign: "right", paddingRight: 5, fontFamily: configjson.regularFont }} numberOfLines={2} ellipsizeMode='middle'>{item.label}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>


                    <BarChart
                        style={{ flex : 1 }}
                        data={barChartHelper}
                        horizontal={true}
                        svg={{ fill: '#C0DCF3' }}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0}
                        gridMin={0}
                    >
                        <Grid direction={Grid.Direction.VERTICAL} />
                        <BarLabels />
                    </BarChart>

                </View>
            )
        }

        if (segment_by.value == 'platforms' || segment_by.value == 'payment-methods') {

            console.log("piechart statistics", statistics)

            return (
                <>
                    <PieChart style={{ height: 310 }}
                        data={statistics}
                        innerRadius={5}
                        outerRadius={80}
                        labelRadius={140}>
                        <PieLabels />
                    </PieChart>
                    <View style={{ width: "90%" }}>
                        {statistics
                            .sort((a, b) => b.value - a.value)
                            .map((item, index) => {
                                return (<View key={index} style={{ flexDirection: "row" }}>
                                    <Svg height="30" width="30" style={{ marginStart: 10, marginBottom: 5 }}>
                                        <Circle cx="15" cy="15" r="15" fill={item.svg.fill} />
                                    </Svg>
                                    <Text style={{ fontSize: 16, fontFamily: configjson.boldFont, margin: 5 }}>
                                        <Text style={{ fontSize: 16, fontFamily: configjson.lightFont }}>({Math.round((item.percent * 100 + Number.EPSILON) * 100) / 100}%)</Text> {item.key}: <Text style={{ fontSize: 16, fontFamily: configjson.lightFont }}>{item.value.toLocaleString("hu-HU")} Ft</Text>
                                    </Text>
                                </View>
                                )
                            })}
                    </View>
                </>
            )
        }

        if (segment_by.value == "shadow-customers") {
            //console.log("shadow-customers", statistics)
            return (

                <View style={{ backgroundColor: "#C9D3D6", marginHorizontal: 10, marginBottom: 10, paddingVertical: 10, borderRadius: 5 }}>
                        
                    <Text style={{ fontSize: 18, fontFamily: configjson.lightFont, marginStart: 10, marginBottom: 5, color: "black" }}>
                        {Localized.users_total} 
                        <Text style={{ fontSize: 20, fontFamily: configjson.boldFont }}>
                            {statistics.all} db
                        </Text>
                    </Text>

                    <Text style={{ fontSize: 18, fontFamily: configjson.lightFont, marginStart: 10, marginBottom: 5, color: "black" }}>
                        {Localized.users_new}
                        <Text style={{ fontSize: 20, fontFamily: configjson.boldFont }}>
                            {statistics.count} db
                        </Text>
                    </Text>

                </View>
            )
        }

    }

    getV3Statistics(partner_id, restaurant_id, callback) {
        //orders?restaurant_id=222&fresh=true&preorder=false&pickup=false

        //console.log("getStatistics", this.props.segment_by);

        let dateString = "from=" + moment(new Date()).startOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]")
            + "&till=" + moment(new Date()).endOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]")

        if (this.props.selectingMode === "day") {
            dateString = "from=" + moment(this.props.date).startOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]")
                + "&till=" + moment(this.props.date).endOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]")
        }
        if (this.props.selectingMode === "interval") {
            dateString = "from=" + moment(this.props.date).startOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]")
                + "&till=" + moment(this.props.endDate).endOf("day").format("YYYY-MM-DD[T]HH:mm:ss[Z]")
        }

        // /v3/admin/partners/:partner/restaurants/:restaurant/stats/payment-methods 
        // /v3/admin/partners/:partner/restaurants/:restaurant/stats/platforms
        // /v3/admin/partners/:partner/restaurants/:restaurant/stats/product-categories

        let URL = configjson.base_url + "v3/admin/partners/" + partner_id + "/restaurants/" + restaurant_id + "/stats/" + this.props.segment_by.value + "?" + dateString

        //let URL = configjson.base_url + "stats/summary?restaurant_id=" + restaurant_id + "&group_by=day&segment_by=" + this.props.segment_by + category_segment_string + dateString + show_item_order_by_string

        console.log("getStatistics URL", URL)

        //https://onemin-prod.herokuapp.com/api/stats/summary?restaurant_id=109&group_by=day&segment_by=platform&start_date=2019-01-31&end_date=2020-02-25
        //https://onemin-prod.herokuapp.com/api/stats/summary?restaurant_id=109&group_by=day&segment_by=platform&category_segment=product&start_date=2019-02-25&end_date=2020-02-25&show_items=true&items_order_by=total

        let header = {}

        header.uid = this.props.user_data.uid
        header.client = this.props.user_data.client
        header["access-token"] = this.props.user_data.access_token

        header.Accept = 'application/json'
        header['Content-Type'] = 'application/json'

        console.log("GET_STATISTICS_SURL", URL, header);

        fetch(URL, {
            method: 'GET',
            headers: header
        })

            .then((response) => {

                this.setState({ loading: false })

                if (response.status > 300) {
                    console.log("getStatistics FAILED: ", response);
                    this.setState({ no_prev_order: true })
                    return;
                }
                response.json().then(responseJson => {
                    const res = responseJson;
                    console.log("getStatistics SUCCESS: ", res, this.props.segment_by)

                    if (this.props.segment_by.value == 'product-categories' || this.props.segment_by.value == 'products' || this.props.segment_by.value == 'subproducts' || this.props.segment_by.value == 'options' ) {
                        this.makeV3DataForBarChart(res)
                    }
                    if (this.props.segment_by.value == 'platforms' || this.props.segment_by.value == 'payment-methods') {
                        this.makeV3DataForPieSVG(res, this.props.segment_by);
                    }
                    if (this.props.segment_by.value == 'shadow-customers') {
                        this.makeV3DataForShadowUsers(res)
                    }

                    // this.setState({
                    //     raw_statistics: res,
                    // })

                    if (callback) callback();
                });

            })
            .catch((error) => {
                console.log('Problem getStatistics: ' + error.message);
                if (callback) callback();
            });
    }

    makeV3DataForBarChart(raw_statistics) {
        //console.log("BARCHART", raw_statistics)

        let barChartSVGData = []
        let helperData = {}
        let sum = 0.0

        for (let item of raw_statistics) {
            sum += parseFloat(item.sum) || 0
            helperData[item.name] = parseFloat(item.sum) || 0
        }

        //console.log("barchart HELPER", helperData)

        let ColorIndex = 0;
        for (let key in helperData) {
            //console.log("key", key )
            barChartSVGData.push({
                value: helperData[key],
                label: key,
            })
            ColorIndex++;
        }

        barChartSVGData.sort((a, b) => b.value - a.value)
        raw_statistics.sort((a, b) => parseInt(b.sum) - parseInt(a.sum))

        //console.log("rendezett?", barChartSVGData, raw_statistics)

        this.setState({
            statisticsSVG: barChartSVGData, loading: false, raw_statistics
        })
    }

    makeV3DataForPieSVG(raw_statistics, segment_by) {

        //console.log("SEGMENTBY", segment_by)

        let pieChartSVGData = []
        let helperData = {}

        for (let item of raw_statistics[segment_by.arrayHelper]) {
            //console.log("item", item, item[segmentHelper], item.sum )
            helperData[item[segment_by.itemName]] = parseFloat(item.sum) || 0
        }

        //console.log("DATAFORPIE", helperData)

        let ColorIndex = 0;
        for (let key in helperData) {
            //console.log("key", key )
            pieChartSVGData.push({
                value: helperData[key],
                svg: {
                    fill: colorsForChart[ColorIndex],
                    onPress: () => console.log('press', key),
                },
                key: TranslateSegmentFunction(key) != undefined ? TranslateSegmentFunction(key) : key,
                percent: helperData[key] / parseFloat(raw_statistics.sum)
            })
            ColorIndex++;
        }

        this.setState({
            statisticsSVG: pieChartSVGData, loading: false, raw_statistics
        })

        //console.log("STATISTICSSVG", pieChartSVGData)
    }

    makeV3DataForShadowUsers(raw_statistics) {
        this.setState({ statisticsSVG: raw_statistics });
        //console.log("shadowuser", raw_statistics)
    }

    setSegmentBy = (segment_by) => {

        //console.log("SETSEGMENTBY", segment_by)
        this.props.setSegmentBy(segment_by);
        this.setState({ segment_by, segmentModalVisible: false, loading: true, statisticsSVG: [], raw_statistics: [] })

    }

    findSegmentElement(segment_by) {

        //console.log("findsegmentelement", segment_by)

        for (let i = 0; i < segmentData.length; i++) {
            if (segmentData[i].value === segment_by) {
                this.setSegmentBy(segmentData[i])
                break
            }
        }

    }

    showSegmentModal() {
        this.setState({ segmentModalVisible: true })
    }

    showInfoModal(info) {
        //console.log("infomodal", info)
        this.setState({ infoModalVisible: true, info })
    }

    closeSegmentModal(segment_by) {

        //console.log("CHOOSED SEGMENT", segment_by)

        this.setState({ segmentModalVisible: false })

    }

    closeInfoModal() {

        //console.log("close Info modal")

        this.setState({ infoModalVisible: false })

    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "#E0E7E9" }}>
                <ScrollView style={{ height: "90%" }} refreshControl={
                    <RefreshControl
                        colors={["#A93D73"]} //ANDROID
                        tintColor="#A93D73" //IOS
                        refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />
                }>
                    <View style={{
                        width: "100%", flexDirection: "row", justifyContent: "space-between", backgroundColor: "white",
                        //Anrdoid
                        elevation: 4,
                        //IOS
                        shadowColor: "grey",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        zIndex: 1,
                    }}>
                        <MenuButton icon={require("../resources/menu.png")} />
                        <View style={{ width: "45%", justifyContent: "center" }}>
                            {this.renderScreenTitle()}
                            {this.renderDate()}
                        </View>
                        <CalendarButton icon={require("../resources/calendar.png")} />
                    </View>

                    <TouchableOpacity style={{ flex: 1, flexDirection: "row", backgroundColor: "white", padding: 10, height: 80, justifyContent: "space-between", marginBottom: 10, paddingHorizontal: 30 }} /*onPress={ () => this.segmentPickerReference.togglePicker(true) } */
                        onPress={() => this.showSegmentModal()}>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={{ color: 'black', fontFamily: configjson.boldFont, }}>{Localized.segment}</Text>
                            <Text style={{ fontSize: 20, fontFamily: configjson.lightFont, }}>{this.state.segment_by.label}</Text>
                        </View>
                        <Image style={{ alignSelf: "center", height: 30, width: 30, tintColor: "#A93D73", }} source={require("../resources/levels.png")} resizeMode="contain" />
                    </TouchableOpacity  >

                    {this.state.segmentModalVisible ? <SegmentModal isVisible={this.state.segmentModalVisible} closeModal={() => this.closeSegmentModal()} segments={segmentData} selectSegment={this.setSegmentBy.bind(this)} /> : null}
                    {this.state.infoModalVisible ? <InfoModal isVisible={this.state.infoModalVisible} closeModal={() => this.closeInfoModal()} info={this.state.info} /> : null}

                    {this.renderChart(this.state.segment_by, this.state.statisticsSVG, this.state.loading)}

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
        segment_by: state.loginReducer.segment_by,
        selectedRestaurant: state.restaurantReducer.selectedRestaurant,
        language: state.languageReducer.language,
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onLogin: (endpoint, email, pass, has_loading_icon) => dispatch(actionHelper.login(endpoint, email, pass, has_loading_icon)),
        resetFieldStates: () => dispatch(actionHelper.resetFieldStates()),
        getRestaurant: (id, is_secondary_language) => dispatch(actionHelper.getRestaurant(id, is_secondary_language)),
        setSegmentBy: (segment_by) => dispatch(actionHelper.setSegmentBy(segment_by)),
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(StatisticsScreen));