import { Station } from '../models/station.model.js';
import { Booking } from '../models/booking.model.js';

export const getNearbyStations = async (req, res) => {
  try {
    const { latitude, longitude, distance, startTime, endTime } = req.query;

    // Validate input
    if (!latitude || !longitude || !distance || !startTime || !endTime) {
      return res.status(400).send('All query parameters are required');
    }

    // Convert query parameters to appropriate types
    const userCoordinates = [parseFloat(longitude), parseFloat(latitude)];
    const maxDistance = parseFloat(distance) * 1000; // Convert to meters
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Find nearby stations within the specified distance
    const nearbyStations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: userCoordinates,
          },
          $maxDistance: maxDistance,
        },
      },
    });

    // Filter stations based on availability during the specified time slot
    const availableStations = await Promise.all(
      nearbyStations.map(async (station) => {
        const overlappingBookings = await Booking.find({
          station: station._id,
          $or: [
            { startTime: { $lte: end }, endTime: { $gte: start } },
            { startTime: { $lte: end }, endTime: { $gte: start } },
          ],
        });

        return overlappingBookings.length === 0 ? station : null;
      })
    );

    // Remove null values from the array
    const filteredStations = availableStations.filter((station) => station !== null);

    res.status(200).json(filteredStations);
  } catch (error) {
    res.status(500).send(error.message);
  }
};