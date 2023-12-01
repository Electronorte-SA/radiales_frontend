import React, { useEffect, useState } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import FormDataScreen from './FormData';
import { getRadialById } from "./services/database.service";

interface CamaraProps {
  navigation: any;
}

interface FormData {
  codigo: string;
  se: string;
  amt: string;
  marca: string;
  modelo_de_rele: string;
  nombre_de_radial: string;
  nivel_de_tension_kv: string;
  tipo: string;
  propietario: string;
  latitud: string;
  longitud: string;
  fec_instala: string;
  estado: string;
  fec_camb_bateria: string;
}

const Camara: React.FC<CamaraProps> = ({ navigation }) => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  
  const [showScanDataScreen, setShowScanDataScreen] = React.useState(false);
  // const [scannedData, setScannedData] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    se: '',
    amt: '',
    marca: '',
    modelo_de_rele: '',
    nombre_de_radial: '',
    nivel_de_tension_kv: '',
    tipo: '',
    propietario: '',
    latitud: '',
    longitud: '',
    fec_instala: '',
    estado: '',
    fec_camb_bateria: '',
  });

  const onBottomButtonPressed = (event) => {
    const captureImages = JSON.stringify(event.captureImages);
    console.log(event);
    console.log(captureImages);
    if (event.type === "capture") {
      var image = event.captureImages[event.captureImages.length - 1];
      console.log(image);
    } else if (event.type === "left") {
      navigation.pop();
    } else if (event.type === "right") {
      navigation.pop();
    }
  };

  const onReadCode = async (event) => {
    const codeValue = event.nativeEvent.codeStringValue;
    setScannedData(codeValue);

    try {
      let registro = await getRadialById(codeValue);
      console.log('registro', registro);
      if (registro.codigo) {
        setFormData({
          codigo: registro.codigo,
          se: registro.se,
          amt: registro.amt,
          marca: registro.marca,
          modelo_de_rele: registro.modelo_de_rele,
          nombre_de_radial: registro.nombre_de_radial,
          nivel_de_tension_kv: registro.nivel_de_tension_kv,
          tipo: registro.tipo,
          propietario: registro.propietario,
          latitud: registro.latitud,
          longitud: registro.longitud,
          fec_instala: registro.fec_instala,
          estado: registro.estado,
          fec_camb_bateria: registro.fec_camb_bateria,
        });

        if (navigation) {
          navigation.push('FormDataScreen', { formData });
        }
      }
    } catch (ex) {
      console.error(ex);
      Alert.alert('Error', 'Failed to fetch data from the database');
    }
    setShowCamera(false);

  };
  const resetScan = () => {
    // Función para reiniciar el escaneo y mostrar la cámara nuevamente
    setShowCamera(true);
    setFormData(null);
    setScannedData(null);
  };
  return (
    // <View style={{ flex: 1 }}>
    //   <CameraScreen
    //     actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
    //     onReadCode={(event) => onReadCode(event)}
    //     flashImages={{
    //       on: require('../assets/camera/flashOn.png'),
    //       off: require('../assets/camera/flashOff.png'),
    //       auto: require('../assets/camera/flashAuto.png'),
    //     }}
    //     cameraFlipImage={require('../assets/camera/cameraFlipIcon.png')}
    //     captureButtonImage={require('../assets/camera/cameraButton.png')}
    //     torchOnImage={require('../assets/camera/flashOn.png')}
    //     torchOffImage={require('../assets/camera/flashOff.png')}
    //     hideControls={false}
    //     showCapturedImageCount={false}
    //     style={{
    //       backgroundColor: 'black',
    //       width: Dimensions.get('window').width,
    //       flex: 1
    //     }}
    //     scanBarcode={true}
    //     showFrame={true}
    //     laserColor='red'
    //     frameColor='white'
    //   />
    //   {scannedData && (
    //     <FormDataScreen formData={formData} setShowScanDataScreen={setShowScanDataScreen} />
    //   )}
    // </View>
    <View style={{ flex: 1 }}>
    {showCamera && (
      <CameraScreen
        actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
        onReadCode={onReadCode}
        flashImages={{
          on: require('../assets/camera/flashOn.png'),
          off: require('../assets/camera/flashOff.png'),
          auto: require('../assets/camera/flashAuto.png'),
        }}
        cameraFlipImage={require('../assets/camera/cameraFlipIcon.png')}
        captureButtonImage={require('../assets/camera/cameraButton.png')}
        torchOnImage={require('../assets/camera/flashOn.png')}
        torchOffImage={require('../assets/camera/flashOff.png')}
        hideControls={false}
        showCapturedImageCount={false}
        style={{
          backgroundColor: 'black',
          width: Dimensions.get('window').width,
          flex: 1
        }}
        scanBarcode={true}
        showFrame={true}
        laserColor='red'
        frameColor='white'
      />
    )}
    {scannedData && !showCamera && (
      <FormDataScreen formData={formData} resetScan={resetScan} />
    )}
  </View>
  );
}

export default Camara;
