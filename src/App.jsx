import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCountries } from './hooks/useCountries'
import { useWeather } from './hooks/useWeather'
import Header from './components/Header'
import Controls from './components/Controls'
import WeatherDisplay from './components/WeatherDisplay'
import StatusBar from './components/StatusBar'
import Background from './components/Background'

function App() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const { countryData, status: globalStatus } = useCountries()
  const { weatherData, status: weatherStatus, isSyncing, fetchWeather, clearWeather } = useWeather()

  const [currentDate] = useState(() => new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }))

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value)
    setSelectedCity('')
    clearWeather()
  }

  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    fetchWeather(city, selectedCountry)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 font-sans antialiased text-white selection:bg-accent/30">
      <Background condition={weatherData?.condition} />
      
      <AnimatePresence>
        <motion.div 
          key="main-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[500px] bg-black/40 backdrop-blur-[40px] border border-white/10 rounded-[40px] p-10 py-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
          
          <Header date={currentDate} />

          <Controls 
            selectedCountry={selectedCountry}
            handleCountryChange={handleCountryChange}
            countryData={countryData}
            selectedCity={selectedCity}
            handleCityChange={handleCityChange}
          />

          <div className="relative">
            <WeatherDisplay 
              weatherData={weatherData}
              isSyncing={isSyncing}
            />

            <StatusBar 
              isSyncing={isSyncing}
              weatherData={weatherData}
              weatherStatus={weatherStatus}
              globalStatus={globalStatus}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
