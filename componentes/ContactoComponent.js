import React, { Component } from 'react';
import { Text, ScrollView, View, Button } from 'react-native';
import { Card, Input } from 'react-native-elements';
import * as MailComposer from 'expo-mail-composer';

class Contacto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: [],
            email: [],
            comentario: [],
        }
    }

    enviarCorreo = async () => {
        MailComposer.composeAsync({
            recipients: ["andonimarzo@gmail.com"],
            subject: 'Correo de ' + this.state.nombre + ' | ' + this.state.email,
            body: this.state.comentario,
        })
    }

    resetearCampos = () => {
        this.setState({
            nombre: [],
            email: [],
            comentario: [],
        })
    }

    render() {
        return (
            <ScrollView>
                <Card title="Información de contacto"
                    featuredTitle="Contacto">
                    <Text style={{ margin: 10 }}>
                        Kaixo Mendizale!{'\n'}{'\n'}
                Si quieres participar en las salidas de montaña que organizamos o quieres hacerte soci@ de Gaztaroa, puedes contactar con nosotros a través de diferentes medios. Puedes llamarnos por teléfono los jueves de las semanas que hay salida (de 20:00 a 21:00). También puedes ponerte en contacto con nosotros escribiendo un correo electrónico, o utilizando la aplicación de esta página web. Y además puedes seguirnos en Facebook.{'\n'}{'\n'}
                Para lo que quieras, estamos a tu disposición!{'\n'}{'\n'}
                Tel: +34 948 277151{'\n'}{'\n'}
                Email: gaztaroa@gaztaroa.com
                </Text>
                </Card>
                <Card title="Envíanos tu comentario!">
                    <Text style={{ margin: 10 }}>
                        Escríbenos un correo para cualquier duda o sugerencia que tengas.
                    </Text>
                    <Text style={{ margin: 10 }}>
                        Nombre:
                    </Text>
                    <Input
                        value={this.state.nombre}
                        onChangeText={value => this.setState({ nombre: value })}
                    />
                    <Text style={{ margin: 10 }}>
                        Email:
                    </Text>
                    <Input
                        value={this.state.email}
                        onChangeText={value => this.setState({ email: value })}
                    />
                    <Text style={{ margin: 10 }}>
                        Comentario:
                    </Text>
                    <Input
                        value={this.state.comentario}
                        onChangeText={value => this.setState({ comentario: value })}
                    />
                    <View >
                        <Button title="Enviar" onPress={() => (this.enviarCorreo(), this.resetearCampos())} />
                    </View>
                </Card>

            </ScrollView>
        );
    }
}

export default Contacto;