import React, {Component, PropTypes} from 'react';
import GeoFire from 'geofire';

import {
    AppRegistry,
    AppState,
    Image,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Dimensions,
    Animated,
    StatusBar,
    AlertIOS,
    NativeModules,
    Linking,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';

import Geocoder from 'react-native-geocoder';
import MapView from 'react-native-maps';

var {
    RNMapsRouteUtils
} = require('NativeModules');

import Avatar from './components/Avatar';

const { height, width } = Dimensions.get('window');

// add location

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
export default class SimpleMap extends Component{
    constructor(props) {

        super(props);

        this.usersRef = this.getRef().child('Users');

        this.state = {
            loading: true,
            request: {},
            hasRespondedToRequest: props.hasRespondedToRequest || false,
            buttonText: 'ON-SCENE',
            patientAddress: '',
            currentCondition: '',
            status: 'en-route',
            hasEnteredRange: true,
            route: {},
            source: {},
            mapRegion: {
                latitude: props.currentLocation ? props.currentLocation.latitude : 42,
                longitude: props.currentLocation ? props.currentLocation.longitude : -73,
                latitudeDelta: props.currentLocation ? props.currentLocation.latitudeDelta : 0.003,
                longitudeDelta: props.currentLocation ? props.currentLocation.longitudeDelta : 0.003,
            },
            destination: props.destination || null,
            currentLocation: props.currentLocation || { latitude: 42, longitude: -73},
            mapRegionInput: undefined,
            markers: [],
            etaMarker: {},
            menuIsExpanded: false,
            user: props.user || {},
            patient: props.patient || {},
            // patient: {},
            eta: props.user ? this.getEta(props.user, props.patient) : 0,
            goodSamaritanProfile: {}
        };

        this.requestsRef = this.getRef().child('BekonRequests');
        this.patientProfileRef = this.getRef().child('PatientProfile');
        this.bekonRequestRef = this.getRef().child('BekonRequests');
        this.goodSamaritanProfileRef = this.getRef().child('GoodSamaritanProfile');

        this.listenForRequests = this.listenForRequests.bind(this);
        // this.listenForRequestUpdates = this.listenForRequestUpdates.bind(this);
        this.getPatientById = this.getPatientById.bind(this);
        this.getPatientProfileById = this.getPatientProfileById.bind(this);
        this.getGoodSamaritanProfileById = this.getGoodSamaritanProfileById.bind(this);

        this.GeoFire = new GeoFire(this.getRef().child('geofire'));

        this.getPatientProfileById(this.state.patient.id);
    }

    getPatientById(id) {
        console.log('litt', id)
        let result = {};
        this.usersRef.once('value', snap => {
            snap.forEach(child => {
                if(child.val().id === id) {
                    result = Object.assign({}, child.val())
                    // this.setState({
                    //     patient: child.val(),
                    //     loading: false
                    // })
                }
            })
        });

        return result;
    }

    getPatientProfileById(id) {
        this.patientProfileRef.once('value', snap => {
            snap.forEach(child => {
                if(child.val().id === id) {
                    this.setState({
                        patientProfile: child.val(),
                        currentCondition: child.val().conditions[0],
                        loading: false
                    }, () => {

                    })
                }
            })
        })
    }

    getGoodSamaritanProfileById(id) {
        this.goodSamaritanProfileRef.once('value', snap => {
            snap.forEach(child => {
                if(child.val().id === this.props.app.auth().currentUser.uid) {
                    this.setState({
                        goodSamaritanProfile: child.val()
                    })
                }
            })
        })
    }

    getEta(user, patient) {
        // console.log('xvvc', 'getEta', this);
        let options = {
            patientLat: patient.currentLocation.latitude,
            patientLong: patient.currentLocation.longitude,
            samaritanLat: user.currentLocation.latitude,
            samaritanLong: user.currentLocation.longitude
        };

        RNRMapsRouteUtils.getRouteDetails(options, (result) => {
            console.log('cdc', result)
            this.updateEta(result)
        })
    }

    updateEta(eta) {
        this.setState({
            eta: eta.eta
        }, () => {
            this.forceUpdate()
        })
    }

    componentWillMount() {
        this.setState({
            markers: [
                {
                    latlng: {
                        latitude: 40.7402272, longitude: -74.008529
                    }
                },
                {
                    latlng: {
                        latitude: 40.7829796,
                        longitude: -73.9611593
                    },
                },
            ],
            etaMarker: {
                latlng: {
                    latitude: 40.7402272 + 0.005,
                    longitude: -74.008529 + 0.0005
                }
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="default"/>
                <View style={{flex: 1, flexDirection: 'column'}}>
                </View>
                <MapView
                    ref={ref => this.map = ref }
                    initialRegion={{
                        latitude: 40.739392,
                        longitude: -74.007706,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                      }}
                    style={styles.map}>
                    {this.state.markers.map( (marker, index) => (
                        <MapView.Marker
                            index={index}
                            identifier={`Marker${index}`}
                            coordinate={marker.latlng}>
                            <Avatar uri={marker.uri}
                                    aviStyle={{height: 30, width: 30, borderRadius: 15}}
                                    onSelect={() => {}}
                            />
                        </MapView.Marker>
                    ))}
                    <MapView.Marker identifier="ETAMarker"
                                    coordinate={this.state.etaMarker.latlng}>
                        <BekonMapMarker distance={this.state.eta}/>
                    </MapView.Marker>
                </MapView>
                <View style={{position: 'absolute', top: 70, left: 0, right: 0, paddingTop: 10, justifyContent: 'center'}}>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 10, borderTopColor: '#333', borderTopWidth: .5, borderBottomColor: 'rgba(40, 40, 40, 0.55)', borderBottomWidth: .4, position: 'absolute', bottom: 100, right: 0, left: 0, height: 50, backgroundColor: '#ffffff'}}>
                    <Image style={{backgroundColor: 'rgba(200, 200, 200, 0.5)', marginRight: 10, height: 40, width: 40, borderRadius: 20, borderColor: 'rgba(100, 100, 100, 0.3)', borderWidth: 1}}
                           source={{uri: this.state.patient.uri}}/>
                    <View style={{marginLeft: 10, marginRight:10, borderLeftColor: 'rgba(40, 40, 40, 0.35)', borderLeftWidth: .65, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 5, paddingTop: 5}}>
                        <Text style={{fontWeight: 'bold', color: '#333', fontSize: 14}}>PATIENT NAME</Text>

                        <Text style={{color: '#333', fontSize: 12}}>{this.props.patient ? this.props.patient.firstName.toUpperCase() : 'Rick'}</Text>

                    </View>
                    <View style={{marginLeft: 10, marginRight:10, borderLeftColor: 'rgba(40, 40, 40, 0.35)', borderLeftWidth: .65, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 5, paddingTop: 5}}>
                        <Text style={{fontWeight: 'bold', color: '#333', fontSize: 14}}>CONDITION</Text>
                        <Text style={{color: '#333', fontSize: 12}}>{this.state.currentCondition} - HAS MEDICATION</Text>
                    </View>
                </View>
                {/*<BekonIconHeader
                 textColor="#333333"
                 title={this.state.status === 'on-scene' ? 'En Route' : 'On Scene'}
                 titleColor="#333333"
                 rightButtonLabel={this.state.status !== 'on-scene' ? '' : 'Done'}
                 leftButtonStyle={{color: 'red'}}
                 rightButtonStyle={{color: 'blue'}}
                 onLeftButtonPress={this.cancelTrip.bind(this)}
                 onRightButtonPress={this.getDirections.bind(this)}
                 style={[{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 1.0)'} , this.state.status === 'En Route' ? styles.cancelButton : styles.settingsButton]}
                 />*/}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container:  {
        flex: 1,
        flexDirection: 'column',
    },
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, .85)'
    },
    userInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingLeft: 10
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#FFFFFF',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 20
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // height: height,
        // width: width
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textInput: {
        width: 150,
        height: 20,
        borderWidth: 0.5,
        borderColor: '#aaaaaa',
        fontSize: 13,
        padding: 4
    },
    changeButton: {
        alignSelf: 'center',
        marginTop: 5,
        padding: 3,
        borderWidth: 0.5,
        borderColor: '#777777'
    },
    cancelButton: {
        color: 'snow'
    },
    settingsButton: {
        // color: 'pink'
    },
    status: {
        position: 'absolute',
        height: 120,
        borderRadius: 9,
        bottom: 30,
        left: 10,
        right: 10,
        backgroundColor: 'white'
    },
    statusButton: {
        backgroundColor: 'black',
        borderRadius: 20,
        // borderBottomLeftRadius: 20,
        alignItems: 'center',
        padding: 10
    },
    footer: {
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: height - 197,
        left: 0,
        right: 0,
        height: 246,
        backgroundColor: '#fefefa',
        borderColor: 'rgba(40, 40, 37, 0.25)',
        borderWidth: .55,
        borderRadius: 10
    },
    logo: {
        backgroundColor: 'transparent',
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: colorForTopic(6, 4),
        marginLeft: 10
    }
});
