import AlarmNotifier from "./components/AlarmNotifier";
import AppointmentScheduler from "./components/AppointmentScheduler";
function App() {
  return (
    <main className="container ">
      <AppointmentScheduler />
      <AlarmNotifier />
    </main>
  );
}

export default App;
