import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  margin-top: 100px;
  flex-direction:row;
`;

const Button = styled(Link)`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  text-decoration: none;
`;

function Home() {
  return (
    <Container>
      <h1>Bem-vindo ao Controle de Ingressos</h1>
      <Button to="/register">GERAR QR CODE</Button>
      <Button to="/scan">LER QR CODE</Button>
    </Container>
  );
}

export default Home;