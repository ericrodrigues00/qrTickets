const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://adminticket:admin@clusterblazed.3ea9fri.mongodb.net/qrTickets', {

  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TicketSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  qrCode: String,
});

const Ticket = mongoose.model('Ticket', TicketSchema);

app.post('/api/generate-ticket', async (req, res) => {
  const { name, phone, email } = req.body;
  const qrCodeData = `${name}_${phone}_${email}`;

  try {
    const newTicket = new Ticket({
      name,
      phone,
      email,
      qrCode: qrCodeData,
    });

    await newTicket.save();

    res.json({ qrCode: qrCodeData });
  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({ error: 'Error generating ticket' });
  }
});

app.post('/api/validate-ticket', async (req, res) => {
  const { qrCode } = req.body;

  try {
    const ticket = await Ticket.findOne({ qrCode });

    if (ticket) {
      await Ticket.deleteOne({ qrCode });

      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    console.error('Error validating ticket:', error);
    res.status(500).json({ error: 'Error validating ticket' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
