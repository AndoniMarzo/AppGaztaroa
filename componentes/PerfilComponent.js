import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Modal, Switch } from 'react-native';
import { Avatar, SocialIcon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

class Perfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      showModal: false,
      edad: 18,
      federado: false,
      fecha: "2020-06-01"
    };
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {

    console.log("this.state.user")
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

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

  render() {
    let image = this.state.image;
    const { user } = this.props.route.params
    return (
      <View style={styles.contianer}>
        <View style={styles.cabecera}>
          <View>
            <Avatar
              rounded
              showAccessory
              size="large"
              source={{ uri: this.state.image }}
              onPress={() => this._pickImage()}
            />
          </View>
          <View>
            <Text style={styles.nombre}>{user.nombre}</Text>
            <Text style={styles.nombre}>Edad: {this.state.edad}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.nombre}>Email: {user.email}</Text>
        </View>

        <View>
          <Text style={styles.nombre}>Federado: {this.state.federado ? 'Si' : 'No'}</Text>
        </View>
        <View style={styles.button}>
          <Button title="Configurar" onPress={() => this.toggleModal()} />
        </View>

        <Modal animationType={"slide"} transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
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
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
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
              onPress={() => this.toggleModal()}
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
  nombre: {
    paddingTop: 5,
    paddingLeft: 20,
    paddingBottom: 5,
    fontSize: 20,
  },
  button: {
    marginTop: 15,
    marginBottom: 15,
    alignItems: "center"
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

export default Perfil;