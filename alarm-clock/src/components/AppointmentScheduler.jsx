import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Tạo danh sách thời gian (30 phút/lần)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleBookAppointment = () => {
    if (selectedTime) {
      const newAppointment = {
        date: selectedDate.toDateString(),
        time: selectedTime,
      };
      setAppointments([...appointments, newAppointment]);
      setSelectedTime(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Đặt Lịch Hẹn</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Chọn ngày
        </label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Chọn giờ
        </label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {timeSlots.map((time) => (
            <motion.button
              key={time}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTime(time)}
              className={`p-2 rounded-md ${
                selectedTime === time
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {time}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBookAppointment}
        disabled={!selectedTime}
        className="w-full bg-indigo-600 text-white p-2 rounded-md disabled:bg-gray-400"
      >
        Đặt Lịch
      </motion.button>

      <AnimatePresence>
        {appointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold">Lịch Hẹn Đã Đặt</h3>
            <ul className="mt-2 space-y-2">
              {appointments.map((appt, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 bg-gray-100 rounded-md"
                >
                  {appt.date} - {appt.time}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AppointmentScheduler;