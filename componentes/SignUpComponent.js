import React, { Component } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { connect } from 'react-redux';
import { fetchUsuario } from '../redux/ActionCreators';

import firebase from 'firebase';

import { colorGaztaroaOscuro, firebaseConfig } from '../comun/comun';

const mapStateToProps = state => {
  return {
    usuario: state.usuario,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUsuario: (usuarioID) => dispatch(fetchUsuario(usuarioID)),
})

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

  // Comprobamos si las contraseñas introducidas coinciden para activar el botón
  comprobarPassword = () => {
    if ((this.state.password.length > 0) && (this.state.password === this.state.confirmPassword)) {
      this.setState({ valid: true })
    } else {
      this.setState({ valid: false })
    }
  }

  // Comprobamos si el usuario introducido cumple las reglas o ya existe
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
        //console.log(parsedRes);
        if (!parsedRes.idToken) {
          Alert.alert("Error en la autenticación", "Email o contraseña incorrectos");
        } else {

          // El usuario es correcto y se le va a asociar un índice
          firebase.database()
            .ref('/usuarios')
            .once('value')
            .then(snapshot => {

              // Comprobamos si el usuario se había registrado con Google
              let usuario = snapshot.val().filter((usuarios) => usuarios.email === this.state.email)
              if (usuario.length > 0) {

                // El usuario ya existía porque se había registrado con Google y se le asocia su índice
                this.props.fetchUsuario(usuario[0].indice);
                navigate('Inicio')

              } else {

                // El usuario no existe y se va a añadir a la base de datos
                let indice = 0;
                if (snapshot.val() !== null) {
                  indice = snapshot.val().length
                }

                const user = {
                  "email": this.state.email,
                  "nombre": this.state.nombre,
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
            }
            )
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);