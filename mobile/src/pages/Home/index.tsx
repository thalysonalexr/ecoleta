import React, { useEffect, useState } from 'react';
import { Feather as FeatherIcon } from '@expo/vector-icons';
import { View, Image, Text, ImageBackground, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import { getAllStates, getCitiesByState } from '../../services/api-ibge';
import { City } from '../../models/City';
import { State } from '../../models/State';

import styles from './styles';

const Home: React.FC = () => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const { navigate } = useNavigation();

  useEffect(() => {
    getAllStates<State[]>().then(({ data }) => setStates(data));
  }, []);

  useEffect(() => {
    if (!selectedUf) return;

    getCitiesByState<City[]>(selectedUf).then(({ data }) => setCities(data));
  }, [selectedUf]);

  return (
    <ImageBackground
      imageStyle={{ width: 274, height: 368 }}
      source={require('../../assets/home-background.png')}
      style={styles.container}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          Icon={() => (
            <FeatherIcon name="chevron-down" color="#A0A0B2" size={24} />
          )}
          useNativeAndroidPickerStyle={false}
          style={{
            inputAndroid: styles.inputAndroid,
            iconContainer: styles.iconContainer,
          }}
          placeholder={{
            label: 'Selecione o estado',
            color: '#A0A0B2',
          }}
          value={selectedUf}
          onValueChange={(value) => setSelectedUf(value)}
          items={states.map(({ id, sigla }) => ({
            key: id,
            label: sigla,
            value: sigla,
            color: '#6C6C80',
          }))}
        />
        <RNPickerSelect
          Icon={() => (
            <FeatherIcon name="chevron-down" color="#A0A0B2" size={24} />
          )}
          useNativeAndroidPickerStyle={false}
          style={{
            inputAndroid: styles.inputAndroid,
            iconContainer: styles.iconContainer,
          }}
          placeholder={{
            label: 'Selecione a cidade',
            color: '#A0A0B2',
          }}
          disabled={!selectedUf}
          value={selectedCity}
          onValueChange={(value) => setSelectedCity(value)}
          items={cities.map(({ id, nome }) => ({
            key: id,
            label: nome,
            value: nome,
            color: '#6C6C80',
          }))}
        />
        <RectButton
          style={styles.button}
          onPress={() => {
            if (selectedUf && setSelectedCity) {
              navigate('Points', { uf: selectedUf, city: selectedCity });
            } else {
              Alert.alert(
                'Oooops!',
                'Precisamos que você selecione a UF e cidade para que possa ver os pontos de coleta disponíveis'
              );
            }
          }}
        >
          <View style={styles.buttonIcon}>
            <Text>
              <FeatherIcon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;
