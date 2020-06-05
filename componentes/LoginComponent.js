import React, { Component } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { SocialIcon } from 'react-native-elements';

import { connect } from 'react-redux';
import { fetchUsuario } from '../redux/ActionCreators';

import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';

import { colorGaztaroaOscuro, firebaseConfig, ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '../comun/comun';

const mapStateToProps = state => {
  return {
    usuario: state.usuario,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUsuario: (usuarioID) => dispatch(fetchUsuario(usuarioID)),
})

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  // Comprobamos si el usuario introducido es correcto
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
        Alert.alert("La autenticación ha fallado", "Por favor, reinicia la aplicación");
      })
      .then(res => res.json())
      .then(parsedRes => {
        //console.log(parsedRes);
        if (!parsedRes.idToken) {
          Alert.alert("Error en la autenticación", "Email o contraseña incorrectos");
        } else {

          // El usuario es correcto y se va a obtener su índice en la base de datos
          firebase.database()
            .ref('/usuarios')
            .once('value')
            .then(snapshot => {
              let usuario = snapshot.val().filter((usuarios) => usuarios.email === this.state.email)
              this.props.fetchUsuario(usuario[0].indice);
              navigate('Inicio')
            });
        }
      });
  };

  // Comprobamos si el usuario Google es correcto
  signInWithGoogleAsync = async ({ navigate }) => {
    try {
      const result = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {

        // Comprobamos si el usuario de Google tenía una cuenta registrada
        firebase.database()
          .ref('/usuarios')
          .once('value')
          .then(snapshot => {
            if (snapshot.val() == null) {

              // No hay usuarios en la base de datos y se va a añadir el usuario
              const indice = 0
              this.registrarUsuario(indice, result, { navigate })

            } else {

              // Hay usuarios en la base de datos
              let usuario = snapshot.val().filter((usuarios) => usuarios.email === result.user.email)

              if (usuario.length > 0) {

                // El usuario ya existe en la base de datos
                this.props.fetchUsuario(usuario[0].indice);
                navigate('Inicio')

              } else {

                // El usuario no existe en la base de datos y se va a añadir
                let indice = 0;
                if (snapshot.val() !== null) {
                  indice = snapshot.val().length
                }
                this.registrarUsuario(indice, result, { navigate })
              }
            }
          });
      } else {
        Alert.alert("Correo no válido");
      }
    } catch (e) {
      Alert.alert("Error al intentar hacer login con Google");
    }
  }

  // Creamos el array y lo añadimos a la base de datos
  registrarUsuario = (indice, result, { navigate }) => {
    const user = {
      "email": result.user.email,
      "nombre": result.user.name,
      "indice": indice,
      "favoritos": [-1],
      "edad": "",
      "federado": false
    }

    firebase.database().ref("usuarios/" + indice)
      .set(user)
      .then(() => {
        this.props.fetchUsuario(indice),
          navigate('Inicio')
      })
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.contianer}>
        <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/andoni-react-native.appspot.com/o/imagenes%2Flogo.png?alt=media&token=944a89fc-5330-43cc-a471-329207a6ba96" }} style={styles.cabeceraImagen} />
        <Text style={styles.cabeceraTexto}> AppGaztaroa</Text>

        <View style={styles.inputGroup}>
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
            onChangeText={(password) => this.setState({ password })}
            underlineColorAndroid={colorGaztaroaOscuro}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.button}>
          <Button title="INICIAR SESIÓN" onPress={() => this.loginHandler({ navigate })} color={colorGaztaroaOscuro} disabled={(this.state.email === "" || this.state.password === "")} />
        </View>

        <View style={styles.google}>
          <SocialIcon
            button
            title="Iniciar sesión con Google"
            type='google'
            onPress={() => this.signInWithGoogleAsync({ navigate })}
          />
        </View>

        <Text style={styles.text}>¿No tienes cuenta? <Text onPress={() => navigate('SignUp')} style={{ color: colorGaztaroaOscuro }}>Regístrate!</Text></Text>

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
    marginBottom: 15,
  },
  google: {
    marginTop: 15,
    marginBottom: 15,
    width: 300,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);