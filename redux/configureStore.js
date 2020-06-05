import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist'
//import storage from 'redux-persist/lib/storage'
import { AsyncStorage } from 'react-native';

import { excursiones } from './excursiones';
import { comentarios } from './comentarios';
import { cabeceras } from './cabeceras';
import { actividades } from './actividades';
import { usuario } from './usuario';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ["excursiones", "comentarios", "cabeceras", "actividades"]
}

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        excursiones,
        comentarios,
        cabeceras,
        actividades,
        usuario,
    }))

export const ConfigureStore = () => {
    const store = createStore(
        persistedReducer,
        applyMiddleware(thunk, logger),
    );

    const persistor = persistStore(store)
    return { store, persistor }
}