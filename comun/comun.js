import firebase from 'firebase';

export const baseUrl = "https://andoni-react-native.firebaseio.com/";

export const colorGaztaroaOscuro = '#015afc';
export const colorGaztaroaClaro = '#c2d3da';

export const email = "gaztaroa@gaztaroa.com";

export const firebaseConfig = {
  apiKey: "AIzaSyCmXNNDrRLEUIPq39gzZ1Q7Jsw0VBf2RWg",
  authDomain: "andoni-react-native.firebaseapp.com",
  databaseURL: "https://andoni-react-native.firebaseio.com",
  projectId: "andoni-react-native",
  storageBucket: "andoni-react-native.appspot.com",
  messagingSenderId: "729997754954",
  appId: "1:729997754954:web:9dc33645a2b89dd6e91cb3"
};

export const ANDROID_CLIENT_ID = "729997754954-5p4inr1v4mlpdaa0p40ad53c251lfj4l.apps.googleusercontent.com"
export const IOS_CLIENT_ID = "729997754954-ih5o02h79f3urpdkanlpl6kspp46qjj3.apps.googleusercontent.com"

export const obtenerURL = async (direccion) => {
  let storage = firebase.storage();
  let storageRef = storage.ref();
  let spaceRef = storageRef.child(direccion);
  let url = await spaceRef.getDownloadURL();
  return url
}