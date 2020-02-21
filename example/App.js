import React from 'react'
import { Dimensions, View, Image, Text, TouchableOpacity, SafeAreaView, StyleSheet, Modal } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ExpoImageManipulator } from 'react-native-expo-image-cropper'

export default class App extends React.Component {
    state = {
        showModal: false,
        uri: null,
    }
    _pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync()
            if (!result.cancelled) {
                this.setState({
                    uri: result.uri,
                }, () => this.setState({ showModal: true }))
            }
        }
    };

    _pickCameraImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync()

            if (!result.cancelled) {                
                this.setState({
                    uri: result.uri,
                }, () => this.setState({ showModal: true }))
            }
        }
    };

    render() {
        const { uri, showModal } = this.state
        const { width, height } = Dimensions.get('window')
        return (
            <SafeAreaView style={{backgroundColor: 'white', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1}}>                
                <View style={{width: width, flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                    {uri ? (
                        <Image resizeMode="contain"
                            style={{
                                width: '80%', height: '100%', marginBottom: 0, backgroundColor: '#fcfcfc',
                            }}
                            source={{ uri }}
                        />
                    ) : 
                    <Image resizeMode={'contain'} source={require('./assets/icon.png')} style={{alignSelf: 'center', width: '80%', height: '100%'}} />
                    }
                </View>
                <TouchableOpacity onPress={() => this._pickImage()} style={{marginTop: 20, width: 200, borderRadius: 10, height: 60, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon size={30} name="photo" color="white" />
                    <Text style={{ color: 'white', fontSize: 18 }}>Galery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._pickCameraImage()} style={{marginTop: 20, borderRadius: 10, width: 200, height: 60, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon size={30} name="photo-camera" color="white" />
                    <Text style={{ color: 'white', fontSize: 18 }}>Photo</Text>
                </TouchableOpacity>
                {
                    uri
                && (
                    <ExpoImageManipulator
                        photo={{ uri }}
                        isVisible={showModal}
                        onPictureChoosed={(data) => {
                            this.setState({ uri: data.uri })
                        }}
                        onToggleModal={() => this.setState({ showModal: !showModal })}
                        saveOptions={{
                            compress: 1,
                            format: 'png',
                            base64: true,
                        }}
                    />
                )
                }
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
