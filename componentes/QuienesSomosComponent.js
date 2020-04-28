import React, { Component } from 'react';
import { Text, ScrollView, View, FlatList } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { baseUrl } from '../comun/comun';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
      actividades: state.actividades
    }
  }

function Historia() {
    return (
        <Card
            title="Un poquito de historia"
            titleStyle={{ fontSize: 20 }}>
            <Text style={{ margin: 10 }}>El nacimiento del club de montaña Gaztaroa se remonta a la primavera de 1976 cuando jóvenes aficionados a la montaña y pertenecientes a un club juvenil decidieron crear la sección montañera de dicho club. Fueron unos comienzos duros debido sobre todo a la situación política de entonces. Gracias al esfuerzo económico de sus socios y socias se logró alquilar una bajera. Gaztaroa ya tenía su sede social.</Text>
            <Text style={{ margin: 10 }}>Desde aquí queremos hacer llegar nuestro agradecimiento a todos los montañeros y montañeras que alguna vez habéis pasado por el club aportando vuestro granito de arena.</Text>
            <Text style={{ margin: 10 }}>Gracias!</Text>
        </Card>
    );
}

class QuienesSomos extends Component {

    render() {

        const renderActividades = ({ item, index }) => {
            return (
                <ListItem
                    key={index}
                    title={item.nombre}
                    subtitle={item.descripcion}
                    hideChevron={true}
                    leftAvatar={{ source: { uri: baseUrl + item.imagen } }}
                />
            );
        }


        return (
            <ScrollView>
                <Historia />

                <Card
                    title="Actividades y recursos"
                    titleStyle={{ fontSize: 20 }}>
                    <FlatList
                        data={this.props.actividades.actividades}
                        renderItem={renderActividades}
                        keyExtractor={item => item.id.toString()}
                    />
                </Card>

            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(QuienesSomos);