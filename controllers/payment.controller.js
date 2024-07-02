import { Payment } from '../models/Payment.js';
import { Booking } from '../models/Booking.js';

export const createPayment = async (req, res) => {
  try {
    const { bookingId, startTime, endTime } = req.body;

    // Validate the input
    if (!bookingId || !startTime || !endTime) {
      return res.status(400).send('All fields are required');
    }

    // Check if the booking exists
    const booking = await Booking.findById(bookingId).populate("station","price");
    if (!booking) {
      return res.status(400).send('Booking not found');
    }

    const amount = (endTime-startTime)*booking.station.price;

    // Create a new payment
    const payment = new Payment({
      booking: bookingId,
      amount,
    });

    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const completePayment = async (req, res) => {
  try {
    const { paymentId,bookingId } = req.params;

    // Check if the payment exists
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(400).send('Payment not found');
    }
    const booking = await Booking.findById(bookingId).populate("station","price");
    if (!booking) {
      return res.status(400).send('Booking not found');
    }
    booking.payment = paymentId;
    // Update payment status
    payment.status = 'completed';
    await payment.save();
    await booking.save();
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};