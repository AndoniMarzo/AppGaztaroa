import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Modal, Switch } from 'react-native';
import { Avatar, SocialIcon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'

import { connect } from 'react-redux';
import { actualizarUsuario } from '../redux/ActionCreators';

import firebase from 'firebase';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import { obtenerURL } from '../comun/comun'

const mapStateToProps = state => {
  return {
    usuario: state.usuario,
  }
}

const mapDispatchToProps = dispatch => ({
  actualizarUsuario: (usuarioId, edad, federado) => dispatch(actualizarUsuario(usuarioId, edad, federado)),
})

class Perfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      showModal: false,
      edad: this.props.usuario.edad,
      federado: this.props.usuario.federado,
      fecha: new Date()
    };
  }

  // Cargamos la foto en caso de que la haya nada mas renderizar el componente
  componentDidMount() {
    this.getPermissionAsync();
    this.actualizarFoto();
  }

  // Pedimos permiso para usar la galería
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  // Obtenemos la foto de perfil del almacenamiento de firebase
  actualizarFoto = async () => {
    obtenerURL('profile/' + this.props.usuario.indice + '.jpg')
      .then((result) => {
        this.setState({ image: result })
      })
  }

  // Cambiamos la foto de perfil del usuario y la subimos a firebase
  fotoPerfil = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then((result) => {
      if (!result.cancelled) {
        const { height, width, type, uri } = result;
        return this.uriToBlob(uri);
      }
    }).then((blob) => {
      return this.uploadToFirebase(blob);
    }).then((snapshot) => {
      console.log("Foto subida");
      this.actualizarFoto();
    }).catch((error) => {
      throw error;
    });
  }

  // Para subir la foto a firebase, se convierte a Blob
  uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };

      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }

  // Subimos la foto a firebase
  uploadToFirebase = (blob) => {
    return new Promise((resolve, reject) => {
      var storageRef = firebase.storage().ref();
      storageRef.child('profile/' + this.props.usuario.indice + '.jpg').put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot) => {
        blob.close();
        resolve(snapshot);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  // Volvemos a la pantalla de inicio de sesión 
  cerrarSesion = ({ navigate }) => {
    firebase.auth().signOut()
    navigate('Login')
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  // Calculamos la edad del usuario
  calcularEdad = (fecha) => {
    const hoy = new Date();
    const cumple = new Date(fecha);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mes = hoy.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
      edad = edad - 1;
    }
    this.setState({ edad: edad });
  }

  // Guardamos los nuevos datos del usuario
  guardarEstado = () => {
    this.props.actualizarUsuario(this.props.usuario.indice, this.state.edad, this.state.federado)
  }

  render() {
    let image = this.state.image;
    const user = this.props.usuario
    const { navigate } = this.props.navigation;
    
    return (
      <View style={styles.contianer}>
        <View style={styles.cabecera}>
          <View>
            <Avatar
              rounded
              showAccessory
              size="large"
              source={{ uri: image }}
              onPress={() => this.fotoPerfil()}
            />
          </View>
          <View>
            <Text style={styles.texto}>{user.nombre}</Text>
            <Text style={styles.texto}>Edad: {this.state.edad}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.texto}>Email: {user.email}</Text>
        </View>

        <View>
          <Text style={styles.texto}>Federado: {this.state.federado ? 'Si' : 'No'}</Text>
        </View>

        <View style={styles.botones}>

          <View style={styles.button}>
            <Button title="Configurar" onPress={() => this.toggleModal()} />
          </View>

          <View style={styles.button}>
            <Button title="Cerrar sesión" onPress={() => this.cerrarSesion({ navigate })} />
          </View>
        </View>
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.showModal}
          onDismiss={() => { this.toggleModal(); this.guardarEstado() }}
          onRequestClose={() => { this.toggleModal(); this.guardarEstado() }}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Datos del usuario</Text>

            <View style={styles.modalElemento}>
              <Text style={styles.modalText}>Edad: {this.state.edad}</Text>
              <DatePicker
                style={{ marginRight: 20 }}
                date={this.state.fecha}
                format='YYYY-MM-DD'
                mode="date"
                placeholder="Seleccionar fecha de nacimiento"
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                customStyles={{
                  dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0 },
                  dateInput: { marginLeft: 36 }
                }}
                onDateChange={(date) => { this.setState({ fecha: date }); this.calcularEdad(date) }}
              />
            </View>

            <View style={styles.modalElemento}>
              <Text style={styles.modalText}>Federado: {this.state.federado ? 'Si' : 'No'}</Text>
              <Switch
                value={this.state.federado}
                onValueChange={(value) => this.setState({ federado: value })}>
              </Switch>
            </View>

            <Button
              title="Guardar cambios"
              onPress={() => { this.toggleModal(); this.guardarEstado() }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contianer: {
    justifyContent: "center",
  },
  cabecera: {
    flexDirection: "row",
    height: 100,
    padding: 20,
  },
  texto: {
    paddingTop: 5,
    paddingLeft: 20,
    paddingBottom: 5,
    fontSize: 20,
  },
  botones: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center"
  },
  button: {
    marginTop: 15,
    marginBottom: 15,
    alignItems: "center",
    flex: 1,
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalElemento: {
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    paddingRight: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Perfil);