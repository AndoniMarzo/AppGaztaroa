import React from 'react';
import Campobase from './componentes/CampobaseComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import {PersistGate} from 'redux-persist/es/integration/react';

const {store, persistor} = ConfigureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <Campobase />
        </PersistGate>
      </Provider>
    );
  }
}