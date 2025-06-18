import Header from "./components/Header";
import Footer from "./components/Footer";
import Drinks from "./components/Drinks";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6 bg-gray-50">
        <Drinks />
      </main>
      <Footer />
    </div>
  );
};

export default App;
