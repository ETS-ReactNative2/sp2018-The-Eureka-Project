import React, { Component } from "react";
import {
  StyleSheet,
  Platform,
  Text,
  View,
  ScrollView,
  Image
} from "react-native";
import LessonSelection from "./components/LessonSelection";
import forwordsStyles from "../../constants/forwordsStyles";

export default class GameSetUpScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
  }

  render() {
    const playerType = this.props.navigation.state.params.playerType; // host, member, or solo
    let content;

    // If the user is playing solo
    if (playerType == "solo") {
      content = (
        <ScrollView>
          <View style={forwordsStyles.container}>
            <View style={forwordsStyles.headingView}>
              <Text style={forwordsStyles.headingText}>Single Player Mode</Text>
              <Image
                style={forwordsStyles.playerImage}
                source={require("../../assets/images/person.png")}
              />
            </View>
            <LessonSelection
              navigation={this.props.navigation}
              playerType={playerType}
            />
          </View>
        </ScrollView>
      );
    }
    // If the user is a HOST (playing with others)
    else if (playerType == "host") {
      content = (
        <ScrollView>
          <View style={forwordsStyles.container}>
            <View style={forwordsStyles.headingView}>
              <Text style={forwordsStyles.headingText}>Multiplayer Mode</Text>
              <Image
                style={forwordsStyles.playerImage}
                source={require("../../assets/images/people.png")}
              />
              <Text style={forwordsStyles.mainText}>
                You will receive a group code once you select a lesson!
              </Text>
              <Text style={forwordsStyles.mainText}>
                Select a lesson for your group to play with!
              </Text>
            </View>

            <LessonSelection
              navigation={this.props.navigation}
              playerType={playerType}
            />
          </View>
        </ScrollView>
      );
    }
    return <View>{content}</View>;
  }
}
