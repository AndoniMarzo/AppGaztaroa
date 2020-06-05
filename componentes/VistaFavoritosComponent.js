import React, { Component } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

import { connect } from 'react-redux';
import { borrarFavoritos } from '../redux/ActionCreators';

import IndicadorActividad from './IndicadorActividadComponent';

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        usuario: state.usuario,
    }
}

const mapDispatchToProps = dispatch => ({
    borrarFavoritos: (usuario, excursionId) => dispatch(borrarFavoritos(usuario, excursionId)),
})

class VistaFavoritos extends Component {
    mensajeAlert(item) {
        Alert.alert(
            "Borrar excursión favorita?",
            "Confirme que desea borrar la excursión: " + item.nombre,
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log(item.nombre + ' Favorito no borrado')
                },
                {
                    text: "OK",
                    onPress: () => this.props.borrarFavoritos(this.props.usuario, item.id)
                }
            ],
            { cancelable: false }
        );
    }

    render() {
        const { navigate } = this.props.navigation;
        const renderFavoritoItem = ({ item, index }) => {
            const rightButton = [
                {
                    text: 'Borrar',
                    type: 'delete',
                    onPress: () => this.mensajeAlert(item)
                }
            ];

            return (
                <Swipeout right={rightButton} autoClose={true}>
                    <ListItem
                        key={index}
                        title={item.nombre}
                        subtitle={item.descripcion}
                        hideChevron={true}
                        onPress={() => navigate('DetalleExcursion', { excursionId: item.id })}
                        onLongPress={() => this.mensajeAlert(item)}
                        leftAvatar={{ source: { uri: item.imagen } }}
                    />
                </Swipeout>
            );
        };

        if (this.props.excursiones.isLoading) {
            return (
                <IndicadorActividad />
            );
        } else if (this.props.excursiones.errMess) {
            return (
                <View>
                    <Text>{this.props.excursiones.errMess}</Text>
                </View>
            );
        } else {
            if (this.props.usuario.favoritos.length > 0) {
                let excurisones_favoritas = [];
                let array_favoritos = this.props.usuario.favoritos
                array_favoritos.forEach((valor) => {
                    console.log(valor)
                    if (valor !== -1){
                        excurisones_favoritas.push(this.props.excursiones.excursiones[valor])
                    }
                });
                console.log(array_favoritos)
                console.log(excurisones_favoritas)
                return (
                    <FlatList
                        data={excurisones_favoritas}
                        renderItem={renderFavoritoItem}
                        keyExtractor={item => item.id.toString()}
                    />
                );
            } else {
                return (<View></View>);
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VistaFavoritos);