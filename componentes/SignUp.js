import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firebaseConfig } from '../comun/comun';

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
    };
  }

  comprobarPassword = () => {
    console.log("compobando...")
    console.log(this.state.password)
    console.log(this.state.confirmPassword)
    if ((this.state.password.length > 0) && (this.state.password === this.state.confirmPassword)) {

      this.setState({ valid: true })
    } else {
      this.setState({ valid: false })
    }
  }

  signupHandler = ({ navigate }) => {
    const url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + firebaseConfig.apiKey;

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password.val,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .catch(err => {
        console.log(err);
        alert("Authentication failed, please try again!");
      })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        if (!parsedRes.idToken) {
          alert("An error occured, please check your data!");
        } else {
          navigate('Inicio', { user: this.state.email })
        }
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.contianer}>
        <View style={styles.headerView}>
          <Text style={styles.header}>Sign Up</Text>
        </View>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          underlineColorAndroid="#1E90FF"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password: password }, this.comprobarPassword)}
          underlineColorAndroid="#1E90FF"
          style={styles.input}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm password"
          autoCapitalize="none"
          value={this.state.confirmPassword}
          onChangeText={(confirmPassword) => this.setState({ confirmPassword }, this.comprobarPassword)}
          underlineColorAndroid="#1E90FF"
          style={styles.input}
          secureTextEntry
        />

        <View style={styles.button} >
          <Button title="SignUp" onPress={() => this.signupHandler({ navigate })} disabled={(this.state.email === "" || !this.state.valid)} />
        </View>

        <Text style={styles.text}>Already have an account? <Text onPress={() => navigate('Login')} style={styles.navigateText}>Login</Text></Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerView: {
    marginBottom: 25
  },
  header: {
    fontWeight: "bold",
    fontSize: 26,
    color: "#1E90FF"
  },
  text: {
    color: "black"
  },
  navigateText: {
    color: "#1E90FF"
  },
  input: {
    width: "70%"
  },
  button: {
    marginTop: 15,
    marginBottom: 15
  }
});

export default SignUpScreen;
