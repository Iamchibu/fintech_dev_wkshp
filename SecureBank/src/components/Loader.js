import React, { Component } from 'react';
import { StyleSheet, Modal, ActivityIndicator, View, Text } from 'react-native';

const Loader = props => {
    const {loading, ...attributes} = props;

    return(
        <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() =>
            {console.log('close modal');}
        }>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <View>
                    <ActivityIndicator size="large" animating={loading} color="#808080" />
                    </View>
                </View>

            </View>
        </Modal>

    )
}
  

export default Loader;
const styles = StyleSheet.create({

    modalBackground:{
        flex:1,
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'space-around',
        backgroundColor:'#00000040'
    },
    activityIndicatorWrapper:{
        backgroundColor:'#ffffff',
        height:100,
        width:100,
        borderRadius:10,
        display:'flex',
        alignItems:'center',
        opacity: 0.7,
        justifyContent:'space-around'
    }
});