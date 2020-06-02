import React, { Component } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

import { connect } from 'react-redux';
import { borrarFavorito } from '../redux/ActionCreators';

import IndicadorActividad from './IndicadorActividadComponent';

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        favoritos: state.favoritos
    }
}

const mapDispatchToProps = dispatch => ({
    borrarFavorito: (excursionId) => dispatch(borrarFavorito(excursionId)),
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
                    onPress: () => this.props.borrarFavorito(item.id)
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
            if (this.props.favoritos.length > 0) {
                let favorito = [];
                this.props.favoritos.sort()
                this.props.favoritos.forEach(indice => {
                    favorito.push(this.props.excursiones.excursiones[indice])
                });
                return (
                    <FlatList
                        data={favorito}
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