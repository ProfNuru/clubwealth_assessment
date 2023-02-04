import { useState } from 'react'
import MainFunctional from './components/MainFunctional'
import { StateProvider } from './hooks/StatesHook'

function App() {
  const [count, setCount] = useState(0)

  return (
    <StateProvider>
      <MainFunctional/>
    </StateProvider>
  )
}

export default App
