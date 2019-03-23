import React, { Component } from "react";
import axios from "axios";
import { Button, StyleSheet, Text, View, ActivityIndicator, Platform, ScrollView, } from "react-native";
import { fullRoutePrefix } from "../../constants/API";

export default class MultiPlayerModeSelectionScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      lessonList: [],
      groupID: '',
    };
  }

  async componentWillMount() {
    try {
      axios
        .get(fullRoutePrefix + "/lesson-list")
        .then(res => {
          const lessons = res.data;
          this.setState({
            isLoading: false,
            lessonList: lessons,
            // added to set groupID
            groupID: this.groupID
          });
        });
    } catch (err) {
      throw new Error("/lesson-list did not work");
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    var ws = this.props.navigation.state.params.ws;
    const titles = this.state.lessonList;
    const buttons = titles.map(element => (
      <Button
        key={element.ID}
        style={styles.button}
        title={'Lesson ' + element.ID + ': ' + element.Title}
        onPress={() => navigate("WaitingRoom", { lesson: element.ID, ws:ws, groupID: this.state.groupCode, playerType: 'host'})}
      />
    ));

    if (this.state.isLoading) {
      return (
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Multiplayer Mode</Text>
          <Text style={styles.icon}>👤👤</Text>
          <View style={{ flex: 1, paddingTop: 20 }}>
            <ActivityIndicator />
          </View>
        </View>
      );
    } else
      return (
        <ScrollView>
          <View style={styles.MainContainer}>
            <View style={styles.headingView}>
              <Text style={styles.headingText}>Multiplayer Mode</Text>
              <Text style={styles.icon}>👤👤</Text>
            </View>
            {buttons}
          </View>
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    margin: 10,
    paddingTop: Platform.OS === "ios" ? 20 : 0
  },
  headingText: {
    fontWeight: "bold",
    fontSize: 30
  },
  headingView: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  icon: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 80
  }
});
