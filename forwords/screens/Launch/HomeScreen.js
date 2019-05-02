import React from "react";
import * as firebase from "firebase";
import course from "../../services/course";
import {
  Button,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Text
} from "react-native";
import forwordsStyles from "../../constants/forwordsStyles";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      myCourses: []
    };
  }

  // User wants to play solo
  onPressSinglePlayerMode = () => {
    const { navigate } = this.props.navigation;
    const playerType = "solo";
    navigate("GameSetUp", { playerType: playerType });
  };

  render() {
    const { navigate } = this.props.navigation;
    const email = firebase.auth().currentUser.email;
    return (
      <View style={forwordsStyles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Button
            style={forwordsStyles.textButton}
            title="My Profile"
            onPress={() => navigate("UserProfile", { email: email })}
            color="purple"
          />
          <View style={forwordsStyles.headingView}>
            <TouchableOpacity
              style={forwordsStyles.headingView}
              onPress={() => navigate("JoinOrCreate")}
            >
              <Text style={forwordsStyles.headingText}>Multiplayer Mode</Text>
              <Image
                style={{ width: 200, height: 200 }}
                source={require("../../assets/images/people.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={forwordsStyles.headingView}>
            <TouchableOpacity
              style={forwordsStyles.headingView}
              onPress={() => this.onPressSinglePlayerMode()}
            >
              <Text style={forwordsStyles.headingText}>Single Player Mode</Text>
              <Image
                style={{ width: 200, height: 200 }}
                source={require("../../assets/images/person.png")}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
