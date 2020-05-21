import * as ActionTypes from './ActionTypes';
import firebase from 'firebase';

export const comentarios = (state = { errMess: null, comentarios: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMENTARIOS:
      return { ...state, errMess: null, comentarios: action.payload };

    case ActionTypes.COMENTARIOS_FAILED:
      return { ...state, errMess: action.payload };

    case ActionTypes.ADD_COMENTARIO:
      var comentario = action.payload;
      comentario.id = state.comentarios.length;
      firebase.database().ref("comentarios/" + comentario.id)
        .set({
          "autor": comentario.autor,
          "comentario": comentario.comentario,
          "dia": comentario.dia,
          "excursionId": comentario.excursionId,
          "id": comentario.id,
          "valoracion": comentario.valoracion,
        })
      return { ...state, errMess: null, comentarios: state.comentarios.concat(comentario) };

    default:
      return state;
  }
};