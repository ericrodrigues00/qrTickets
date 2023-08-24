import React, { useState } from 'react';
import styled from 'styled-components';
import { QrReader } from 'react-qr-reader'; // Correção aqui
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const QRReaderContainer = styled.div`
  width: 300px;
  height: 300px;
  border: 2px solid #ccc;
  margin-top: 20px;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
`;

function ScanPage() {
  const [scanResult, setScanResult] = useState('');

  const handleScan = async (data) => {
    if (data) {
      try {
        // Verificar o QR Code no backend
        const response = await axios.post('http://localhost:5000/api/validate-ticket', { qrCode: data });

        if (response.data.valid) {
          setScanResult('INGRESSO VALIDADO');
        } else {
          setScanResult('INGRESSO INVÁLIDO');
        }
      } catch (error) {
        console.error('Error validating ticket:', error);
        setScanResult('ERRO AO VALIDAR INGRESSO');
      }
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code:', error);
  };

  return (
    <Container>
      <h2>Verificação de Ingresso</h2>
      <QRReaderContainer>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </QRReaderContainer>
      <ResultContainer>
        {scanResult && <p>{scanResult}</p>}
      </ResultContainer>
    </Container>
  );
}

export default ScanPage;
