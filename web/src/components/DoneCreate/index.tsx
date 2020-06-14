import React from 'react';

import './styles.css';

import logo from '../../assets/done.png';

interface Props {
  show: boolean;
  time?: number;
}

const DoneCreate: React.FC<Props> = ({ show, time }) => {
  return (
    <div className="container">
      {show ? (
        <div className="overlay">
          <img src={logo} alt="Done created!" title="Ponto de coleta criado" />
          {time && <span>Redirecionando você em {time}s</span>}
        </div>
      ) : null}
    </div>
  );
};

export default DoneCreate;
