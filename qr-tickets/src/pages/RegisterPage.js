import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom'
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 320px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #663399;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px 0;
  width: 100%;
  border: 1px solid ${props => props.invalid ? 'red' : '#ccc'};
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #663399;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const QRCodeImage = styled.img`
  width: 200px;
  height: 200px;
`;

const ReturnButton = styled.button`
  background-color: #ccc;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Popup = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  animation: ${fadeIn} 0.5s ease-in-out;
  animation-fill-mode: forwards;
  opacity: 0;
`;

function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    let popupTimeout;

    if (successMessage) {
      setPopupVisible(true);
      popupTimeout = setTimeout(() => {
        setPopupVisible(false);
        setSuccessMessage('');
      }, 4000);
    }

    return () => clearTimeout(popupTimeout);
  }, [successMessage]);

  const handleGenerateQRCode = async () => {
    const uniqueId = uuidv4();

    setInvalidEmail(false);
    setInvalidPhone(false);

    if (!isValidEmail(email)) {
      setInvalidEmail(true);
      return;
    }

    if (!isValidPhone(phone)) {
      setInvalidPhone(true);
      return;
    }

    try {
      const qrCodeData = `${name}_${phone}_${email}_${uniqueId}`;
      const qrCodeSize = 600; // Resolução maior (por exemplo)
const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, { width: qrCodeSize, height: qrCodeSize });

      setQRCodeDataURL(qrCodeDataURL);

      const data = {
        id: uniqueId,
        name,
        phone,
        email,
        qrCode: uniqueId,
      };

      await axios.post('http://localhost:5000/api/generate-ticket', data);

      setSuccessMessage('Ticket Registered Successfully');
      setName('');
      setPhone('');
      setEmail('');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleSaveQRCode = () => {
    const link = document.createElement('a');
    link.download = 'qrcode_high_res.png';
    link.href = qrCodeDataURL.replace('data:image/png', 'data:application/octet-stream');
    link.click();
  };
  

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidPhone = (phone) => {
    const phonePattern = /^\d{11}$/;
    return phonePattern.test(phone);
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/\D/g, ''); // Remove non-numeric characters
    setPhone(sanitizedInput.substr(0, 11)); // Limit to maximum 11 characters
  };

  return (
    <Container>
      <Content>
        <Title>Registro de Ingressos</Title>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={handlePhoneChange}
          invalid={invalidPhone}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalid={invalidEmail}
        />
        <Button onClick={handleGenerateQRCode}>Generate QR Code</Button>
        {qrCodeDataURL && (
          <QRCodeContainer>
            <QRCodeImage src={qrCodeDataURL} alt="QR Code" />
            <Button onClick={handleSaveQRCode}>Save QR Code</Button>
          </QRCodeContainer>
        )}
      </Content>
      {popupVisible && (
        <Popup>{successMessage}</Popup>
      )}
     <ReturnButton>
  <Link to="/">Return</Link>
</ReturnButton>
    </Container>
  );
}

export default RegisterPage;
