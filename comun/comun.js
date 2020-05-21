import firebase from 'firebase';


export const baseUrl = "https://andoni-react-native.firebaseio.com/";
export const colorGaztaroaOscuro = '#015afc';
export const colorGaztaroaClaro = '#c2d3da';

export const firebaseConfig = {
  apiKey: "AIzaSyCmXNNDrRLEUIPq39gzZ1Q7Jsw0VBf2RWg",
  authDomain: "andoni-react-native.firebaseapp.com",
  databaseURL: "https://andoni-react-native.firebaseio.com",
  projectId: "andoni-react-native",
  storageBucket: "andoni-react-native.appspot.com",
  messagingSenderId: "729997754954",
  appId: "1:729997754954:web:9dc33645a2b89dd6e91cb3"
};

export const obtenerImagen = (imagen) => {
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  const b = null
  const storage = firebase.storage();
  const pathReference = storage.ref("imagenes/" + imagen);
  pathReference.getDownloadURL().then(function (url) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    console.log(url)
    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    b = url
  })
  console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
  console.log(b)
  return b
};