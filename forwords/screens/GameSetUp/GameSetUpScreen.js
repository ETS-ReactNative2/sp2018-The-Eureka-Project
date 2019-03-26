import React, { Component } from "react";
import { Button, StyleSheet, Platform, Text, View, ScrollView, TextInput, Image, } from "react-native";
import LessonSelection from './components/LessonSelection';

export default class GameSetUpScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
  }

  render() {
    const isSinglePlayer = this.props.navigation.state.params.isSinglePlayer;
    const groupID = this.props.navigation.state.params.groupID;
    const playerType = this.props.navigation.state.params.playerType; // host or member
    let content;

    // If the user is playing solo
    if (isSinglePlayer) {
      content = (
        <ScrollView>
          <View style={styles.MainContainer}>
            <View style={styles.headingView}>
              <Text style={styles.headingText}>Single Player Mode</Text>
              <Image
                style={styles.singlePlayerImage}
                source={require("../../assets/images/person.png")}
              />
            </View>
            <LessonSelection
              navigation={this.props.navigation}
              isSinglePlayer={this.props.navigation.state.params.isSinglePlayer}
            />
          </View>
        </ScrollView>
      );
    }
    // If the user is a HOST (playing with others)
    else if (playerType == 'host') {
      content = (
        <ScrollView>
          <View style={styles.MainContainer}>
            <View style={styles.headingView}>
              <Text style={styles.headingText}>Multiplayer Mode</Text>
              <Image
                style={styles.multiplayerImage}
                source={require("../../assets/images/people.png")}
              />
              <Text style={styles.mainText}>Your Group Code is: {groupID}</Text>
              <Text style={styles.subheadingText}>Invite others to your group using this unique code!</Text>
              <Text style={styles.subheadingText}>Select a lesson for your group to play with!</Text>
            </View>

            <LessonSelection
              navigation={this.props.navigation}
              isSinglePlayer={isSinglePlayer}
              playerType={playerType}
              groupID={groupID}
            />
          </View>
        </ScrollView>
      );
    }
    return (
      <View>
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: '#fff'
  },
  mainText: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 25,
    color: 'black',
    fontWeight: "bold",
  },
  headingText: {
    fontWeight: "bold",
    fontSize: 30,
    color: 'black',
  },
  subheadingText: {
    alignItems: 'center',
    margin: 10,
    fontSize: 20,
    color: 'black',
  },
  multiplayerImage: {
    width: 50,
    height: 70,
    flex: 1,
    resizeMode: 'contain',
  },
  singlePlayerImage: {
    width: 30, 
    height: 55, 
    flex: 1,
    resizeMode: 'contain',
  },
  headingView: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
