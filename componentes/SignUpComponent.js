import React, { Component } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import firebase from 'firebase';

import { colorGaztaroaOscuro, firebaseConfig } from '../comun/comun';

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
    };
  }

  comprobarPassword = () => {
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
        password: this.state.password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .catch(err => {
        console.log(err);
        Alert.alert("La autenticación ha fallado", "Por favor, reinicia la aplicación");
      })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        if (!parsedRes.idToken) {
          Alert.alert("Error en la autenticación", "Email o contraseña incorrectos");
        } else {
          firebase.database()
            .ref('/usuarios')
            .once('value')
            .then(snapshot => {
              let indice = 0;
              if (snapshot.val() !== null) {
                indice = snapshot.val().length
              }
              const user = { "email": this.state.email, "nombre": this.state.nombre }
              firebase.database().ref("usuarios/" + indice)
                .set(user)
              navigate('Inicio', { user: user })
            });

          /* user = { "email": this.state.email, "nombre": this.state.nombre }
          firebase.database().ref("usuarios/" + this.state.email)
            .set(user)
          navigate('Inicio', { user: user })*/
        }
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.contianer}>
        <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/andoni-react-native.appspot.com/o/imagenes%2Flogo.png?alt=media&token=944a89fc-5330-43cc-a471-329207a6ba96" }} style={styles.cabeceraImagen} />
        <Text style={styles.cabeceraTexto}> AppGaztaroa</Text>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Nombre"
            autoCapitalize="none"
            value={this.state.nombre}
            onChangeText={(nombre) => this.setState({ nombre })}
            underlineColorAndroid={colorGaztaroaOscuro}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            underlineColorAndroid={colorGaztaroaOscuro}
            style={styles.input}
          />

          <TextInput
            placeholder="Contraseña"
            autoCapitalize="none"
            value={this.state.password}
            onChangeText={(password) => this.setState({ password: password }, this.comprobarPassword)}
            underlineColorAndroid={colorGaztaroaOscuro}
            style={styles.input}
            secureTextEntry
          />

          <TextInput
            placeholder="Confirmar contraseña"
            autoCapitalize="none"
            value={this.state.confirmPassword}
            onChangeText={(confirmPassword) => this.setState({ confirmPassword }, this.comprobarPassword)}
            underlineColorAndroid={colorGaztaroaOscuro}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.button} >
          <Button title="REGISTRARSE" onPress={() => this.signupHandler({ navigate })} disabled={(this.state.nombre === "" || this.state.email === "" || !this.state.valid)} />
        </View>

        <Text style={styles.text}>¿Ya tienes cuenta? <Text onPress={() => navigate('Login')} style={{ color: colorGaztaroaOscuro }}>Iniciar sesión</Text></Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contianer: {
    justifyContent: "center",
    alignItems: "center"
  },
  cabeceraImagen: {
    marginTop: 50,
    width: 80,
    height: 60
  },
  cabeceraTexto: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  inputGroup: {
    marginTop: 20,
    width: "70%",
  },
  input: {
    textAlign: 'center',
    marginTop: 10,
  },
  text: {
    color: "black"
  },
  button: {
    marginTop: 15,
    marginBottom: 15
  }
});

export default SignUpScreen;
