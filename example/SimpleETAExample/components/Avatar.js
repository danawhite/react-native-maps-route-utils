import React, { Component } from 'react';

import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    StyleSheet,
    Animated
} from 'react-native';

import { colorForTopic } from '../common/BekonColors';

export default class Avatar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uri: props.uri || null,
            // onSelect
            selectedStyle: props.selectedStyle,
            borderStyle: props.borderStyle,
            aviStyle: props.aviStyle,
            animatedValue: new Animated.Value(1000)
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps !== this.props) {
            this.setState({
                uri: nextProps.uri
            })
        }
    }

    getUriForAvatar(uri) {
        // console.log('getUriForAvatar', uri);
        return uri ? uri : 'http://www.dfhtechnologies.com/images/user.png'
    }

    render() {
        return (

            <TouchableWithoutFeedback style={{marginRight: 10}}
                                      onPress={() => this.props.onSelect()}>
                <Image style={[styles.logo, this.props.selectedStyle, this.props.borderStyle, this.props.aviStyle]}
                       source={{uri: this.getUriForAvatar(this.state.uri)}}
                />
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        backgroundColor: 'transparent',
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: colorForTopic(4, 3),
        marginLeft: 10
    }
});
