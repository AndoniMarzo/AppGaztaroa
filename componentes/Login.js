import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firebaseConfig, ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '../comun/comun';
import * as Google from 'expo-google-app-auth';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  loginHandler = ({ navigate }) => {
    const url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + firebaseConfig.apiKey;

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
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

  loginGoogle = () => {
    console.log("Te quieres registrar con google")
  }

  signInWithGoogleAsync = async ({navigate}) => {
    try {
      const result = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        console.log(result)
        navigate('Inicio', { user: result.user.email })
      } else {
        alert("Correo no válido");
      }
    } catch (e) {
      alert("Error al intentar hacer Login con Google");
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.contianer}>
        <View style={styles.headerView}>
          <Text style={styles.header}>Login</Text>
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
          onChangeText={(password) => this.setState({ password })}
          underlineColorAndroid="#1E90FF"
          style={styles.input}
          secureTextEntry
        />

        <View style={styles.button}>
          <Button title="Login" onPress={() => this.loginHandler({ navigate })} style={styles.button} disabled={(this.state.email === "" || this.state.password === "")} />
        </View>

        <Text style={styles.text}>Don't have an account? <Text onPress={() => navigate('SignUp')} style={styles.navigateText}>Sign Up</Text></Text>

        <View style={styles.button}>
          <Button title="GOOGLE" onPress={() => this.signInWithGoogleAsync({ navigate })} style={styles.button} />
        </View>
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
    marginBottom: 20
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

export default LoginScreen;
