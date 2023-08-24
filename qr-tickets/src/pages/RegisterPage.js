import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-top: 10px;
`;

function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerateQRCode = async () => {
    try {
      // Gerar um ID único e aleatório usando a biblioteca uuid
      const uniqueId = uuidv4();

      // Generate QR code data (using uniqueId)
      const qrCodeData = `${name}_${phone}_${email}_${uniqueId}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
      setQRCodeDataURL(qrCodeDataURL);

      // Enviar dados para o backend
      const data = {
        name,
        phone,
        email,
        qrCode: qrCodeData,
        id: uniqueId, // Enviar o ID para o backend
      };

      await axios.post('http://localhost:5000/api/generate-ticket', data);

      // Exibir mensagem de sucesso e limpar campos
      setSuccessMessage('INGRESSO REGISTRADO COM SUCESSO');
      setName('');
      setPhone('');
      setEmail('');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleSaveQRCode = () => {
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeDataURL;
    link.click();
  };

  return (
    <Container>
      <h2>Registro de Comprador</h2>
      <Input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleGenerateQRCode}>Gerar QR Code</Button>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {qrCodeDataURL && (
        <div>
          <img src={qrCodeDataURL} alt="QR Code" />
          <Button onClick={handleSaveQRCode}>Salvar</Button>
        </div>
      )}
    </Container>
  );
}

export default RegisterPage;
