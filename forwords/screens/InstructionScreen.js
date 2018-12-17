import React from 'react';
import {
    Button,
    Image,
    Platform,
    StyleSheet,
    Text,
    View
  } from 'react-native';

  export default class InstructionScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };
    constructor(props) {
        super(props);
      }
    render(){
        const {navigate} = this.props.navigation;
        return(
            <View style= {styles.container}>
                <Text style= {styles.headingText}>
                    How To Play
                </Text>
                <Text style= {styles.bulletText}>
                    1.  Look at the choices
                </Text>
                <Text style= {styles.bulletText}>
                    2.  Read the pinyin
                </Text>
                <Text style= {styles.bulletText}>
                    3.  Press the coressponding button that matches
                </Text>
                <Text style= {styles.bulletText}>
                    4.  Play till timer runs out
                </Text>

                <Button style={styles.button}
                title = 'Proceed'
                onPress = {() => navigate('GamePlay')}
                color = 'green'
                />
            </View>
        )
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    headingText: {
        marginTop: 30,
        marginBottom: 50,
        marginLeft: 50,
        fontSize: 50,
        color: 'purple',
      },
    bulletText: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        fontSize: 20,
        color: 'purple',
    },
    button: {
        alignItems: 'center',
        color: '#800080',
        borderRadius: 50,
        width: 160,
        },
});