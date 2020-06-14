import React, { useEffect, useState, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import Dropzone from '../../components/Dropzone';
import DoneCreate from '../../components/DoneCreate';

import { getAllItems, createNewPoint } from '../../services/api-core';
import { getAllStates, getCitiesByState } from '../../services/api-ibge';
import { Item } from '../../models/Item';
import { State } from '../../models/State';
import { Point } from '../../models/Point';
import { City } from '../../models/City';

import './styles.css';

import logo from '../../assets/logo.svg';

const CreatePoint: React.FC = () => {
  const [isDone, setIsDone] = useState(false);
  const [redirectTime, setRedirectTime] = useState(5);

  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedName, setSelectedName] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedWhatsapp, setSelectedWhatsapp] = useState('');
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    getAllItems<{ items: Item[] }>().then(({ data }) => setItems(data.items));
  }, []);

  useEffect(() => {
    getAllStates<State[]>().then(({ data }) => setStates(data));
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    getCitiesByState<City[]>(selectedUf).then(({ data }) => setCities(data));
  }, [selectedUf]);

  useEffect(() => {
    if (isDone) {
      const redirect = setInterval(
        () => setRedirectTime(redirectTime - 1),
        1000
      );
      const timeRedirect = setTimeout(
        () => history.push('/'),
        redirectTime * 1000
      );

      return () => {
        clearTimeout(redirect);
        clearTimeout(timeRedirect);
      };
    }
  }, [history, isDone, redirectTime]);

  function handleSelectItem(id: string) {
    const alreadyIndex = selectedItems.findIndex((item) => item === id);

    if (alreadyIndex >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  function validateInputFields() {
    const messageErrors: string[] = [];

    if (!selectedFile) {
      messageErrors.push('Selecione a imagem para upload');
    }

    if (!selectedWhatsapp || selectedWhatsapp.length < 13) {
      messageErrors.push('Insira um número de celular válido');
    }

    if (selectedPosition[0] === 0) {
      messageErrors.push('Selecione no mapa seu ponto de coleta');
    }

    if (selectedUf === '0') {
      messageErrors.push('Selecione o estado do ponto de coleta');
    }

    if (selectedCity === '0') {
      messageErrors.push('Selecione a cidade do ponto de coleta');
    }

    if (!selectedItems.length) {
      messageErrors.push(
        'Selecione ao menos um tipo de item que seu ponto coleta'
      );
    }

    return messageErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const messageErrors = validateInputFields();

    if (messageErrors.length) {
      setErrors(messageErrors);
      setShowErrors(true);
      window.scrollTo({ top: 0 });
      return;
    }

    const sendData = new FormData();

    sendData.append('name', selectedName);
    sendData.append('email', selectedEmail);
    sendData.append('whatsapp', selectedWhatsapp);
    sendData.append('uf', selectedUf);
    sendData.append('city', selectedCity);
    sendData.append('latitude', String(selectedPosition[0]));
    sendData.append('longitude', String(selectedPosition[1]));
    sendData.append('items', selectedItems.join(','));

    if (selectedFile) sendData.append('image', selectedFile);

    try {
      await createNewPoint<{ point: Point }>(sendData);
      setIsDone(true);
    } catch ({ response }) {
      setErrors([response.data.message || response.data.error]);
      window.scrollTo({ top: 0 });
    }
  }

  return (
    <>
      <DoneCreate show={isDone} time={redirectTime} />
      <div id="page-create-point">
        <header>
          <img src={logo} alt="Ecoleta" />

          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          {showErrors && (
            <ul className="list-errors">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          <h1>Cadastro do ponto de coleta</h1>

          <Dropzone onSelectedFile={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados essenciais</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                required
                type="text"
                name="name"
                id="name"
                title="Nome da entidade"
                maxLength={255}
                onChange={({ target }) => setSelectedName(target.value)}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  required
                  type="email"
                  name="email"
                  id="email"
                  title="E-mail de contato"
                  maxLength={100}
                  onChange={({ target }) => setSelectedEmail(target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <PhoneInput
                  country={'br'}
                  onlyCountries={['br']}
                  inputClass="field"
                  containerClass="container-phone"
                  inputProps={{
                    name: 'whatsapp',
                    required: true,
                  }}
                  onChange={(phone) => setSelectedWhatsapp(`+${phone}`)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map
              center={initialPosition}
              zoom={15}
              onClick={({ latlng }: LeafletMouseEvent) =>
                setSelectedPosition([latlng.lat, latlng.lng])
              }
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedPosition} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select
                  name="uf"
                  id="uf"
                  required
                  title="Selecione uma UF"
                  value={selectedUf}
                  onChange={(e) => setSelectedUf(e.target.value)}
                >
                  <option value="0">Selecione uma UF</option>
                  {states.map((uf) => (
                    <option key={uf.id} value={uf.sigla}>
                      {uf.sigla}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  required
                  title="Selecione uma cidade"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="0">Selecione uma cidade</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.nome}>
                      {city.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais ítens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map((item) => (
                <li
                  key={item.id}
                  title={item.title}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt="Item de coleta" />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit" title="Cadastrar ponto de coleta">
            Cadastrar ponto de coleta
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePoint;
