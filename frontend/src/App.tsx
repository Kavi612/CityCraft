import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChooseCity from '@/screens/ChooseCity'
import ChooseFounder from '@/screens/ChooseFounder'
import CityMapView from '@/screens/CityMapView'
import CompanySetup from '@/screens/CompanySetup'
import Dashboard from '@/screens/Dashboard'
import GameOverPage from '@/screens/GameOverPage'
import LandingPage from '@/screens/LandingPage'
import SolutionQuiz from '@/screens/SolutionQuiz'
import StyleGuide from '@/screens/StyleGuide'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/founder" element={<ChooseFounder />} />
        <Route path="/city" element={<ChooseCity />} />
        <Route path="/city-map" element={<CityMapView />} />
        <Route path="/quiz" element={<SolutionQuiz />} />
        <Route path="/company-setup" element={<CompanySetup />} />
        <Route path="/game-over" element={<GameOverPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/dev/styleguide" element={<StyleGuide />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
