import React, { useState, useEffect } from 'react';
import { Feather as FeatherIcon, FontAwesome } from '@expo/vector-icons';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';

import { getPointById, BASE_URL } from '../../services/api-core';
import { Point } from '../../models/Point';

import styles from './styles';

interface RouteParams {
  id: string;
}

const Detail: React.FC = () => {
  const [point, setPoint] = useState<Point>({} as Point);

  const { params } = useRoute();
  const { goBack } = useNavigation();

  useEffect(() => {
    getPointById<{ point: Point }>(
      (params as RouteParams).id
    ).then(({ data }) => setPoint(data.point));
  }, []);

  function handleWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${point.whatsapp}&text=Tenho interesse em me desfazer de resíduos`
    );
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [point.email],
    });
  }

  function formatPhoneNumberBR(value: string) {
    const parsed = value[0] === '+' ? value : `+${value}`;

    const zipcode = parsed.substr(0, 3);
    const ddd = parsed.substr(3, 2);
    const number = parsed.substr(5, parsed.length);

    return `${zipcode} (${ddd}) ${number}`;
  }

  if (!point.id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E6E6E6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => goBack()}>
          <FeatherIcon
            name="arrow-left"
            size={24}
            color="#34cb79"
            style={{
              width: 24,
            }}
          />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{ uri: `${BASE_URL}/uploads/${point.image}` }}
        />
        <Text style={styles.pointName}>{point.name}</Text>
        <Text selectable style={styles.pointItems}>
          {point.items?.map((item) => item.title).join(', ')}
        </Text>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Endereço</Text>
          <Text selectable style={styles.infoContent}>
            {point.city}, {point.uf}
          </Text>
        </View>

        <View style={styles.info}>
          <Text selectable style={styles.infoTitle}>
            Contato
          </Text>
          <Text selectable style={styles.infoContent}>
            e-mail: {point.email}
          </Text>
          <Text selectable style={styles.infoContent}>
            telefone: {formatPhoneNumberBR(point.whatsapp)}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => handleWhatsapp()}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={() => handleComposeMail()}>
          <FeatherIcon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Detail;
