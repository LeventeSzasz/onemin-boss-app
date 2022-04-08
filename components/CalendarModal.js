import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import * as actionHelper from "../store/actions/actionHelper";
import Localized from "../utils/Localized.js";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-simple-toast";

var config = require("../config.json");

class CalendarModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date == null ? new Date() : this.props.date,
            endDate: this.props.endDate == null ? new Date() : this.props.endDate,
            PickerMode: "date",
            isDateTimePickerVisible: false,
            isEndDateTimePickerVisible: false,
            selectingMode: "day",
            minimumDate: null,
            maximumDate: new Date()
        };
    }

    // componentDidMount(){
    //     this.props.setDate(this.state.date);
    //     this.props.setEndDate(this.state.endDate);
    // }

    showDateTimePicker = () => {
        console.log("showDateTimePicker");
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        console.log("hideDateTimePicker");
        this.setState({ isDateTimePickerVisible: false });
    };

    showEndDateTimePicker = () => {
        console.log("showEndDateTimePicker");
        this.setState({ isEndDateTimePickerVisible: true });
    };

    hideEndDateTimePicker = () => {
        console.log("hideEndDateTimePicker");
        this.setState({ isEndDateTimePickerVisible: false });
    };

    handleDatePicked = (date) => {
        this.hideDateTimePicker();

        console.log("handleDatePicked", date);
        this.setState({
            date
        });
    };

    handleEndDatePicked = (endDate) => {
        this.hideEndDateTimePicker();

        console.log("handleEndDatePicked", endDate);
        this.setState({
            endDate
        });
    };

    onDayPressed() {
        this.setState(
            {
                selectingMode: "day"
            },
            () => {
                this.props.setSelectingMode("day");
            }
        );
    }

    onIntervalPressed() {
        this.setState(
            {
                selectingMode: "interval"
            },
            () => {
                this.props.setSelectingMode("interval");
            }
        );
    }

    onCloseButtonPressed() {
        //ide kell egy oylan hogy ha nem egy hónap van kiválasztva akkor hibát írjon ki
        // ééééés úgy kéne megcsinálni hogy akkor írja be reduxba csak a dátumot ha itt már leellenőriztuk hogy 1 hónap lehet max

        if (this.state.selectingMode === "interval") {
            let date1 = moment(this.state.date);
            let date2 = moment(this.state.endDate);

            let diff = Math.abs(date1.diff(date2, "days"));
            console.log("diff", diff);

            if (diff > 30) {
                console.log("ezt már nem lehet");
                Toast.show(Localized.too_long_interval, Toast.LONG);
            } else {
                console.log("ezt még lehet itt beállítani a propsokat");
                this.props.setDate(date1);
                this.props.setEndDate(date2);

                this.props.closeModal();
            }
        } else {
            this.props.setDate(this.state.date);

            this.props.closeModal();
        }
    }

    setFieldValue(inputName, value) {
        console.log("setFieldValue", inputName, value);
    }

    renderCalendarSection() {
        if (this.state.selectingMode === "day") {
            return (
                <>
                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            height: "100%",
                            marginHorizontal: 10,
                            marginVertical: 10,
                            height: 30,
                            justifyContent: "center",
                            // IOS SHADOW
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            // ANDROID SHADOW
                            elevation: 2,
                            backgroundColor: "white"
                        }}
                        onPress={this.showDateTimePicker}
                    >
                        <Text
                            style={{
                                color: "black",
                                fontSize: 15,
                                fontFamily: config.boldFont,
                                textAlign: "center",
                                alignSelf: "center"
                            }}
                        >
                            {moment(this.state.date).format("YYYY.MM.DD")}
                        </Text>
                    </TouchableOpacity>

                    {this.state.isDateTimePickerVisible && (
                        <DateTimePickerModal
                            //display="inline"
                            value={this.props.date}
                            mode={this.state.PickerMode}
                            isVisible={this.state.isDateTimePickerVisible}
                            onChange={(event, value) => {
                                //setShowDatePicker(!showDatePicker);
                                this.setFieldValue(event, value);
                            }}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            maximumDate={new Date()}
                            //minimumDate={/*new Date(moment().subtract(1, 'months'))*/ this.state.minimumDate}
                        />
                    )}
                </>
            );
        }

        if (this.state.selectingMode === "interval") {
            return (
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            alignSelf: "center",
                            justifyContent: "center",
                            marginHorizontal: 10
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                marginVertical: 10,
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                height: 30,
                                justifyContent: "center",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                                // ANDROID SHADOW
                                elevation: 2,
                                backgroundColor: "white"
                            }}
                            onPress={this.showDateTimePicker}
                        >
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 15,
                                    fontFamily: config.boldFont,
                                    textAlign: "center"
                                }}
                            >
                                {moment(this.state.date).format("YYYY.MM.DD")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                marginVertical: 10,
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                height: 30,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                                // ANDROID SHADOW
                                elevation: 2,
                                backgroundColor: "white"
                            }}
                            onPress={this.showEndDateTimePicker}
                        >
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 15,
                                    fontFamily: config.boldFont,
                                    textAlign: "center"
                                }}
                            >
                                {moment(this.state.endDate).format("YYYY.MM.DD")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.isDateTimePickerVisible && (
                        <DateTimePickerModal
                            value={this.props.date}
                            mode={this.state.PickerMode}
                            isVisible={this.state.isDateTimePickerVisible}
                            onChange={(event, value) => {
                                //setShowDatePicker(!showDatePicker);
                                this.setFieldValue(event, value);
                            }}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            maximumDate={new Date(this.props.date)}
                            //display="inline"
                            //minimumDate={/*new Date(moment().subtract(1, 'months'))*/ this.state.minimumDate}
                            //todo valahogy ugy csinalni a date-et hogy ha barmelyiket kivasztja akkor +1 honap
                            //vagyis. ezt ha kivasztja + 1 honap.
                            //ha a veget valasztja ki eloszor akkor abbol -1 honap
                            //azert lesz szopas mert redux a datum XDDDDDD
                        />
                    )}
                    {this.state.isEndDateTimePickerVisible && (
                        <DateTimePickerModal
                            value={this.props.endDate}
                            mode={this.state.PickerMode}
                            isVisible={this.state.isEndDateTimePickerVisible}
                            onChange={(event, value) => {
                                //setShowDatePicker(!showDatePicker);
                                this.setFieldValue(event, value);
                            }}
                            onConfirm={this.handleEndDatePicked}
                            onCancel={this.hideEndDateTimePicker}
                            maximumDate={new Date(this.props.endDate)}
                            //display="inline"
                            //minimumDate={/*new Date(moment().subtract(1, 'months'))*/ this.state.minimumDate}
                        />
                    )}
                </>
            );
        }
    }

    render() {
        return (
            <View>
                <Modal
                    isVisible={this.props.isVisible}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                            margin: 10
                        }}
                    >
                        <View style={{ backgroundColor: "white", width: "90%" }}>
                            <View style={{ flexDirection: "row", alignSelf: "center", margin: 10 }}>
                                <TouchableOpacity
                                    style={{
                                        alignItems: "center",
                                        flex: 1,
                                        backgroundColor:
                                            this.state.selectingMode === "day"
                                                ? "#A93D73"
                                                : "white",
                                        height: 30,
                                        justifyContent: "center",
                                        borderWidth: 2,
                                        borderColor: "#A93D73"
                                    }}
                                    onPress={() => this.onDayPressed()}
                                >
                                    <Text
                                        style={{
                                            color:
                                                this.state.selectingMode === "day"
                                                    ? "white"
                                                    : "#A93D73",
                                            textAlign: "center",
                                            fontFamily: config.boldFont
                                        }}
                                    >
                                        {Localized.day}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        alignItems: "center",
                                        flex: 1,
                                        backgroundColor:
                                            this.state.selectingMode === "day"
                                                ? "white"
                                                : "#A93D73",
                                        height: 30,
                                        justifyContent: "center",
                                        borderWidth: 2,
                                        borderColor: "#A93D73"
                                    }}
                                    onPress={() => this.onIntervalPressed()}
                                >
                                    <Text
                                        style={{
                                            color:
                                                this.state.selectingMode === "day"
                                                    ? "#A93D73"
                                                    : "white",
                                            textAlign: "center",
                                            fontFamily: config.boldFont
                                        }}
                                    >
                                        {Localized.interval}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {this.renderCalendarSection()}

                            <TouchableOpacity
                                onPress={() => this.onCloseButtonPressed()}
                                style={{ height: 40, justifyContent: "center", marginTop: 10 }}
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
                                        {Localized.close}
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

function mapStateToProps(state) {
    return {
        user_data: state.loginReducer.user_data,
        date: state.loginReducer.date,
        endDate: state.loginReducer.endDate,
        selectingMode: state.loginReducer.selectingMode
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (endpoint, email, pass, has_loading_icon) =>
            dispatch(actionHelper.login(endpoint, email, pass, has_loading_icon)),
        resetFieldStates: () => dispatch(actionHelper.resetFieldStates()),
        setDate: (date) => dispatch(actionHelper.setDate(date)),
        setEndDate: (endDate) => dispatch(actionHelper.setEndDate(endDate)),
        setSelectingMode: (selectingMode) => dispatch(actionHelper.setSelectingMode(selectingMode))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarModal);
