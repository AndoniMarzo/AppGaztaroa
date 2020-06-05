import * as ActionTypes from './ActionTypes';
import firebase from 'firebase';

export const usuario = (state = [], action) => {
    let favoritos = 0
    switch (action.type) {
        case ActionTypes.CARGAR_USUARIO:
            //console.log(action.payload)
            return { ...state, ...action.payload }

        case ActionTypes.ACTUALIZAR_USUARIO:
            //console.log(state)
            firebase.database()
                .ref('usuarios/' + action.payload[0])
                .update(
                    {
                        edad: action.payload[1],
                        federado: action.payload[2]
                    }
                )
            return { ...state, edad: action.payload[1], federado: action.payload[2] }

        case ActionTypes.ACTUALIZAR_FAVORITOS:
            //console.log(state)
            //console.log(state.favoritos)
            //console.log(action.payload[0].favoritos.concat(action.payload[1]).sort())
            favoritos = action.payload[0].favoritos.concat(action.payload[1]).sort()
            firebase.database()
                .ref('usuarios/' + action.payload[0].indice)
                .update({ favoritos: favoritos })

            return { ...state, favoritos: favoritos }


        case ActionTypes.BORRAR_FAVORITOS:
            //console.log(state.favoritos)
            favoritos = 0;

            // En firebase no es posible añadir un array vacío, por lo que lo sigo manteniendo añadiendo [-1]
            if (action.payload[0].favoritos == action.payload[1]) {
                favoritos = [-1]
            } else {
                favoritos = action.payload[0].favoritos.filter(fav => fav !== action.payload[1])
                favoritos.concat([-1]).sort()
            }

            firebase.database()
                .ref('usuarios/' + action.payload[0].indice)
                .update({
                    favoritos: favoritos,
                })
            return { ...state, favoritos: favoritos }

        default:
            return state;
    }
};