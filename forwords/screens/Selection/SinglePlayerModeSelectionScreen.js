import React, { Component } from "react";
import axios from "axios";
import { Button, StyleSheet, Text, View, ActivityIndicator, Platform, ScrollView, } from "react-native";
import { httpRoute } from "../../constants/API";

export default class SinglePlayerModeSelectionScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      lessonList: []
    };
  }

  async componentWillMount() {
    try {
      axios
        .get(httpRoute + "/lesson-list")
        .then(res => {
          const lessons = res.data;
          this.setState({
            isLoading: false,
            lessonList: lessons
          });
        });
    } catch (err) {
      throw new Error("/lesson-list did not work");
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const titles = this.state.lessonList;
    const buttons = titles.map(element => (
      <Button
        key={element.ID}
        color="#5b3b89"
        title={'Lesson ' + element.ID + ': ' + element.Title}
        onPress={() => navigate("Instruction", { lesson: element.ID })}
      />
    ));

    if (this.state.isLoading) {
      return (
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Single Player Mode</Text>
          <Text style={styles.icon}>👤</Text>
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
              <Text style={styles.headingText}>Single Player Mode</Text>
              <Text style={styles.icon}>👤</Text>
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
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: '#fff'
  },
  headingText: {
    fontWeight: "bold",
    fontSize: 30,
    color: '#5b3b89',
  },
  headingView: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  icon: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 80,
  }
});
