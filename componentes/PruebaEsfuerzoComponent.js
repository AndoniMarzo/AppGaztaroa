import React, { Component } from 'react';
import { Button, Modal, Picker, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import DatePicker from 'react-native-datepicker'
import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';

import * as Calendar from 'expo-calendar';

import { colorGaztaroaOscuro } from '../comun/comun';

const mapStateToProps = state => {
    return {
        usuario: state.usuario,
    }
}

class PruebaEsfuerzo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edad: this.props.usuario.edad,
            federado: this.props.usuario.federado,
            fecha: new Date().toString(),
            showModal: false
        }
    }

    gestionarReserva() {
        console.log(JSON.stringify(this.state));
        this.addCalendario();
        this.toggleModal();
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    resetForm(usuario) {
        this.setState({
            edad: usuario.edad,
            federado: usuario.federado,
            fecha: new Date(),
            showModal: false
        });
    }

    // Calendario
    addCalendario = async () => {

        // Pedimos permiso para usar el calendario
        const { status } = await Calendar.requestCalendarPermissionsAsync();

        // Una vez que nos ha concedido permiso
        if (status === 'granted') {

            // Obtenemos todos los calendarios y comprobamos si existe ya uno con nombre Expo Calendar
            const calendarios = await Calendar.getCalendarsAsync();
            const calendarioExpo = calendarios.filter(calendario => calendario.source.name === 'Expo Calendar');

            let calendarioExpoID = 0;
            if (calendarioExpo.length > 0) {

                // En caso de que exista el calendario, obtenemos la ID
                calendarioExpoID = calendarioExpo[0].id
                //console.log(calendarioExpoID)
                //Calendar.deleteCalendarAsync(calendarioExpoID)

            } else {

                // En caso de que no exista, creamos el calendario y obtenemos la ID
                console.log("No existe ningún Expo Calendar")
                calendarioExpoID = await this.createCalendar();
                //console.log(calendarioExpoID)
            }

            // Añadimos la prueba en el calendario
            //console.log(calendarioExpoID)

            // La duración de la prueba es de 30 minutos
            let start = new Date(this.state.fecha);
            let finish = new Date(this.state.fecha);
            finish.setHours(start.getHours(), start.getMinutes() + 30, 0, 0)

            await Calendar.createEventAsync(calendarioExpoID, {
                startDate: start,
                endDate: finish,
                title: "Prueba de esfuerzo"
            }).then(event => {
                console.log('success', event);
                console.log(start);
            }).catch(error => {
                console.log('failure', error);
            });
        }
    }

    // En caso de que no exista, creamos el calendario
    createCalendar = async () => {
        const defaultCalendarSource =
            Platform.OS === 'ios'
                ? await getDefaultCalendarSource()
                : { isLocalAccount: true, name: 'Expo Calendar' };
        const newCalendarID = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        console.log(`Your new calendar ID is: ${newCalendarID}`);
        return newCalendarID
    }

    // Obtiene los calendarios por defecto
    getDefaultCalendarSource = async () => {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars[0].source;
    }

    // Asignamos el rango correspondiente a la edad del usuario
    valorInicial = () => {
        let edad = this.state.edad
        if (edad < 20 || edad == "< 20") {
            return "< 20"
        } else if (edad <= 30 || edad == "20 - 30") {
            return "20 - 30"
        } else if (edad <= 40 || edad == "31 - 40") {
            return "31 - 40"
        } else if (edad <= 50 || edad == "41 - 50") {
            return "41 - 50"
        } else if (edad <= 60 || edad == "51 - 60") {
            return "51 - 60"
        } else if (edad > 60 || edad == "51 - 60") {
            return "> 60"
        } else {
            return "< 20"
        }
    }

    render() {
        let usuario = this.props.usuario
        return (
            <ScrollView>
                <Animatable.View
                    style={styles.formRow}
                    animation="bounceInRight"
                    duration={1200}>
                    <Text style={styles.formLabel}>Edad</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.valorInicial()}
                        onValueChange={(itemValue, itemIndex) => this.setState({ edad: itemValue })}>
                        <Picker.Item label="< 20" value="< 20" />
                        <Picker.Item label="20 - 30" value="20 - 30" />
                        <Picker.Item label="31 - 40" value="31 - 40" />
                        <Picker.Item label="41 - 50" value="41 - 50" />
                        <Picker.Item label="51 - 60" value="51 - 60" />
                        <Picker.Item label="> 60" value="> 60" />
                    </Picker>
                </Animatable.View>

                <Animatable.View
                    style={styles.formRow}
                    animation="bounceInRight"
                    duration={1300}>
                    <Text style={styles.formLabel}>Federado/No-federado?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.federado}
                        trackColor={colorGaztaroaOscuro}
                        onValueChange={(value) => this.setState({ federado: value })}>
                    </Switch>
                </Animatable.View>

                <Animatable.View
                    style={styles.formRow}
                    animation="bounceInRight"
                    duration={1400}>
                    <Text style={styles.formLabel}>Día y hora</Text>
                    <DatePicker
                        style={{ flex: 2, marginRight: 20 }}
                        date={this.state.fecha}
                        format=''
                        mode="datetime"
                        placeholder="Seleccionar fecha y hora"
                        minDate="2020-01-01"
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
                        onDateChange={(date) => { this.setState({ fecha: date }) }}
                    />
                </Animatable.View>

                <Animatable.View
                    style={styles.formRow}
                    animation="bounceIn"
                    duration={2000}>
                    <Button
                        onPress={() => this.gestionarReserva()}
                        title="Reservar"
                        color={colorGaztaroaOscuro}
                        accessibilityLabel="Gestionar reserva..."
                    />
                </Animatable.View>

                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.toggleModal(); this.resetForm(usuario); }}
                    onRequestClose={() => { this.toggleModal(); this.resetForm(usuario); }}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Detalle de la reserva</Text>
                        <Text style={styles.modalText}>Edad: {this.state.edad}</Text>
                        <Text style={styles.modalText}>Federado?: {this.state.federado ? 'Si' : 'No'}</Text>
                        <Text style={styles.modalText}>Día y hora: {this.state.fecha}</Text>

                        <Button
                            onPress={() => { this.toggleModal(); this.resetForm(usuario); }}
                            color={colorGaztaroaOscuro}
                            title="Cerrar"
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1.1,
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
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps)(PruebaEsfuerzo);