import { Booking } from '../models/Booking.js';
import { Station } from '../models/Station.js';

export const bookSlot = async (req, res) => {
  try {
    const { stationId, startTime, endTime } = req.body;
    const userId = req.user._id;

    // Validate the input
    if (!userId || !stationId || !startTime || !endTime) {
      return res.status(400).send('All fields are required');
    }

    // Check if the station is not available
    const station = await Station.findById(stationId);
    if (!station || !station.isAvailable) {
      return res.status(400).send('Station is not available');
    }

    // Create a new booking
    const booking = new Booking({
      user: userId,
      station: stationId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'yet_to_charge', // Set initial status
    });

    await booking.save();

    // Update station availability
    station.isAvailable = false;
    await station.save();

    // Schedule a job to update station availability after the end time
    const endTimeDate = new Date(endTime);
    const delay = endTimeDate.getTime() - Date.now();
    setTimeout(async () => {
      station.isAvailable = true;
      await station.save();

      // Update booking status to 'charging_complete'
      booking.status = 'charging_complete';
      await booking.save();
    }, delay);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).send(error.message);
  }
};