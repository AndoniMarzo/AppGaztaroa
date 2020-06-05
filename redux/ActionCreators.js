import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../comun/comun';

// Comentarios
export const fetchComentarios = () => (dispatch) => {
    return fetch(baseUrl + 'comentarios.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(comentarios => dispatch(addComentarios(comentarios)))
        .catch(error => dispatch(comentariosFailed(error.message)));
};

export const comentariosFailed = (errmess) => ({
    type: ActionTypes.COMENTARIOS_FAILED,
    payload: errmess
});

export const addComentarios = (comentarios) => ({
    type: ActionTypes.ADD_COMENTARIOS,
    payload: comentarios
});

export const postComentario = (excursionId, valoracion, autor, comentario) => (dispatch) => {
    let dia = new Date().toISOString();
    setTimeout(() => {
        dispatch(addComentario(excursionId, valoracion, autor, comentario, dia));
    }, 2000);
};

export const addComentario = (excursionId, valoracion, autor, comentario, dia) => ({
    type: ActionTypes.ADD_COMENTARIO,
    payload: { "autor": autor, "comentario": comentario, "dia": dia, "excursionId": excursionId, "id": "id", "valoracion": valoracion }
});

//Excursiones
export const fetchExcursiones = () => (dispatch) => {

    dispatch(excursionesLoading());

    return fetch(baseUrl + 'excursiones.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(excursiones => dispatch(addExcursiones(excursiones)))
        .catch(error => dispatch(excursionesFailed(error.message)));
};

export const excursionesLoading = () => ({
    type: ActionTypes.EXCURSIONES_LOADING
});

export const excursionesFailed = (errmess) => ({
    type: ActionTypes.EXCURSIONES_FAILED,
    payload: errmess
});

export const addExcursiones = (excursiones) => ({
    type: ActionTypes.ADD_EXCURSIONES,
    payload: excursiones
});

// Cabeceras
export const fetchCabeceras = () => (dispatch) => {

    dispatch(cabecerasLoading());

    return fetch(baseUrl + 'cabeceras.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(cabeceras => dispatch(addCabeceras(cabeceras)))
        .catch(error => dispatch(cabecerasFailed(error.message)));
};

export const cabecerasLoading = () => ({
    type: ActionTypes.CABECERAS_LOADING
});

export const cabecerasFailed = (errmess) => ({
    type: ActionTypes.CABECERAS_FAILED,
    payload: errmess
});

export const addCabeceras = (cabeceras) => ({
    type: ActionTypes.ADD_CABECERAS,
    payload: cabeceras
});

// Actividades
export const fetchActividades = () => (dispatch) => {

    dispatch(actividadesLoading());

    return fetch(baseUrl + 'actividades.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(actividades => dispatch(addActividades(actividades)))
        .catch(error => dispatch(actividadesFailed(error.message)));
};

export const actividadesLoading = () => ({
    type: ActionTypes.ACTIVIDADES_LOADING
});

export const actividadesFailed = (errmess) => ({
    type: ActionTypes.ACTIVIDADES_FAILED,
    payload: errmess
});

export const addActividades = (actividades) => ({
    type: ActionTypes.ADD_ACTIVIDADES,
    payload: actividades
});

// Usuario
export const fetchUsuario = (usuarioId) => (dispatch) => {
    return fetch(baseUrl + 'usuarios/' + usuarioId + '.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(usuario => dispatch(cargarUsuario(usuario)))
};

export const cargarUsuario = (usuario) => ({
    type: ActionTypes.CARGAR_USUARIO,
    payload: usuario
});

export const actualizarUsuario = (usuarioId, edad, federado) => ({
    type: ActionTypes.ACTUALIZAR_USUARIO,
    payload: [usuarioId, edad, federado]
});

export const actualizarFavoritos = (usuario, excursionId) => ({
    type: ActionTypes.ACTUALIZAR_FAVORITOS,
    payload: [usuario, excursionId]
});

export const borrarFavoritos = (usuario, excursionId) => ({
    type: ActionTypes.BORRAR_FAVORITOS,
    payload: [usuario, excursionId]
});