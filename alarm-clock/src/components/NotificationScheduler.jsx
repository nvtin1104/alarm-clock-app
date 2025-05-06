import { useState } from 'react';
import { motion } from 'framer-motion';

const NotificationScheduler = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [repeatCount, setRepeatCount] = useState(1);
  const [notification, setNotification] = useState(null);

  const handleSetNotification = () => {
    if (selectedTime) {
      setNotification({ time: selectedTime, repeat: repeatCount });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-auto mt-6"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Cài Đặt Thông Báo</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Chọn thời gian
        </label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Số lần lặp lại
        </label>
        <select
          value={repeatCount}
          onChange={(e) => setRepeatCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} lần
            </option>
          ))}
        </select>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSetNotification}
        disabled={!selectedTime}
        className="w-full bg-indigo-600 text-white p-2 rounded-md disabled:bg-gray-400"
      >
        Xác Nhận
      </motion.button>

      {notification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-gray-100 rounded-md text-center"
        >
          <p>Thông báo được đặt lúc {notification.time}, lặp lại {notification.repeat} lần.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotificationScheduler;