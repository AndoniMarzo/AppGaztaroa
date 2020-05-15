import React, { Component, useRef } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, PanResponder, Alert, Animated } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { baseUrl, colorGaztaroaOscuro } from '../comun/comun';
import { connect } from 'react-redux';
import { postFavorito, postComentario } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        comentarios: state.comentarios,
        favoritos: state.favoritos
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorito: (excursionId) => dispatch(postFavorito(excursionId)),
    postComentario: (excursionId, valoracion, autor, comentario) => dispatch(postComentario(excursionId, valoracion, autor, comentario))
})

function RenderExcursion(props) {

    const excursion = props.excursion;

    const cardAnimada = useRef(null);

    const reconocerDragDerechaIzquierda = ({ moveX, moveY, dx, dy }) => {
        if (dx < -50)
            return true;
        else
            return false;
    }

    const reconocerDragIzquierdaDerecha = ({ moveX, moveY, dx, dy }) => {
        if (dx > 50)
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            cardAnimada.current.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'terminado' : 'cancelado'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("PanResponder finalizado", gestureState);
            if (reconocerDragDerechaIzquierda(gestureState))
                Alert.alert(
                    'Añadir favorito',
                    'Confirmar que desea añadir' + excursion.nombre + ' a favoritos:',
                    [
                        { text: 'Cancelar', onPress: () => console.log('Excursión no añadida a favoritos'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorita ? console.log('La excursión ya se encuentra entre las favoritas') : efectoFavoritos() } },
                    ],
                    { cancelable: false }
                );

            if (reconocerDragIzquierdaDerecha(gestureState))
                setTimeout(() => {
                    props.comentarExcursion();
                }, 600);

            return true;
        }
    })

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const efectoFavoritos = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 2000
        }).start();
        props.onPress()
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200
            }).start();
        }, 2000);
    };


    if (excursion != null) {
        return (
            <Animatable.View
                animation="fadeInDown"
                duration={2000}
                delay={500}
                ref={cardAnimada}
                {...panResponder.panHandlers}>
                <Card
                    featuredTitle={excursion.nombre}
                    image={{ uri: baseUrl + excursion.imagen }}>
                    <Text style={{ margin: 10 }}>
                        {excursion.descripcion}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <Icon
                                raised
                                reverse
                                name={props.favorita ? 'heart' : 'heart-o'}
                                type='font-awesome'
                                color='#f50'
                                onPress={() => props.favorita ? console.log('La excursión ya se encuentra entre las favoritas') : efectoFavoritos()}
                            />
                        </Animated.View>
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color={colorGaztaroaOscuro}
                            onPress={() => props.comentarExcursion()}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComentario(props) {

    const comentarios = props.comentarios;

    const renderCommentarioItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comentario}</Text>
                <Text style={{ fontSize: 12 }}>{item.valoracion} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.autor + ', ' + item.dia} </Text>
            </View>
        );
    };

    return (
        <Card title='Comentarios' >
            <FlatList
                data={comentarios}
                renderItem={renderCommentarioItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DetalleExcursion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            valoracion: 3,
            autor: [],
            comentario: [],
            showModal: false
        }
    }

    marcarFavorito(excursionId) {
        this.props.postFavorito(excursionId);
    }

    comentarExcursion() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    resetearModal() {
        this.setState({
            valoracion: 3,
            autor: [],
            comentario: [],
            showModal: false
        });
    }

    gestionarComentario(excursionId) {
        console.log(excursionId, this.state.valoracion, this.state.autor, this.state.comentario);
        this.props.postComentario(excursionId, this.state.valoracion, this.state.autor, this.state.comentario);
        this.resetearModal();
    }

    render() {
        const { excursionId } = this.props.route.params;
        return (
            <ScrollView>
                <RenderExcursion
                    excursion={this.props.excursiones.excursiones[+excursionId]}
                    favorita={this.props.favoritos.some(el => el === excursionId)}
                    onPress={() => this.marcarFavorito(excursionId)}
                    comentarExcursion={() => this.comentarExcursion()}
                />
                <RenderComentario
                    comentarios={this.props.comentarios.comentarios.filter((comentario) => comentario.excursionId === excursionId)}
                />

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.resetearModal(); }}
                    onRequestClose={() => { this.resetearModal(); }}>

                    <View style={styles.modal}>

                        <View>
                            <Rating
                                showRating
                                fractions="{1}"
                                startingValue="{3}"
                                onFinishRating={rating => this.setState({ valoracion: rating })}
                            />
                        </View>

                        <View>
                            <Input
                                placeholder='Autor'
                                onChangeText={value => this.setState({ autor: value })}
                                leftIcon={
                                    <Icon name='user-o' type='font-awesome' />
                                }
                            />
                        </View>

                        <View>
                            <Input
                                placeholder='Comentario'
                                onChangeText={value => this.setState({ comentario: value })}
                                leftIcon={
                                    <Icon name='comment-o' type='font-awesome' />
                                }
                            />
                        </View>

                        <View>
                            <Text style={styles.modalText} onPress={() => this.gestionarComentario(excursionId)}>ENVIAR</Text>
                            <Text style={styles.modalText} onPress={() => this.resetearModal()}>CANCELAR</Text>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalText: {
        textAlign: 'center',
        color: colorGaztaroaOscuro,
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DetalleExcursion);