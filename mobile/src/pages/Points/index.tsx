import React, { useEffect, useState } from 'react';
import { Feather as FeatherIcon } from '@expo/vector-icons';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import { getAllItems, getAllPoints, BASE_URL } from '../../services/api-core';
import { Item } from '../../models/Item';
import { Point } from '../../models/Point';

import styles from './styles';

interface RouteParams {
  uf: string;
  city: string;
}

const Points: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();

  const parsedParams = params as RouteParams;

  useEffect(() => {
    try {
      getAllItems<{ items: Item[] }>().then(({ data }) => setItems(data.items));
    } catch {
      Alert.alert('Oooops!', 'Houve um erro ao carregar o app', [
        {
          onPress: () => goBack(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Oooops!',
          'Precisamos de sua permisão para obter a localização',
          [
            {
              onPress: () => goBack(),
            },
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    getAllPoints<{ points: Point[] }>({
      uf: parsedParams.uf,
      city: parsedParams.city,
      items: selectedItems || undefined,
    })
      .then(({ data }) => setPoints(data.points))
      .catch(() =>
        Alert.alert(
          'Oooops!',
          'Não existe nenhum ponto de coleta cadastrado para a região selecionada. Por favor, selecione outra.',
          [{ onPress: () => goBack() }]
        )
      );
  }, [selectedItems]);

  function handleSelectItem(id: string) {
    const alreadyIndex = selectedItems.findIndex((item) => item === id);

    if (alreadyIndex >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => goBack()}>
          <FeatherIcon
            name="log-out"
            size={24}
            color="#34cb79"
            style={{
              transform: [{ rotateY: '180deg' }],
              width: 24,
            }}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color="#E6E6E6" />
            </View>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map(({ id, latitude, longitude, image, name }) => (
                <Marker
                  key={id}
                  style={styles.mapMarker}
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  onPress={() => navigate('Detail', { id })}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: `${BASE_URL}/uploads/${image}`,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{name}</Text>
                  </View>
                  <View style={styles.mapMarkerIndicator} />
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(({ id, title, image_url }) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.item,
                selectedItems.includes(id) ? styles.selectedItem : {},
              ]}
              activeOpacity={0.6}
              onPress={() => handleSelectItem(id)}
            >
              <SvgUri width={42} height={42} uri={image_url} />
              <Text style={styles.itemTitle}>{title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Points;
