import { useState } from 'react'
import Source from './Source'

function App() {
  const [count, setCount] = useState(0)

  return (<div className='mx-32 my-24'>
    <div className='px-12 py-10 bg-zinc-50 rounded-xl'>
      <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">
        Calculateur de Consommation
      </h1>
      <h2 className='text-lg font-semibold text-zinc-500'>Quelle conso pour mon cloud ?</h2>
    </div>
    <div className='grid grid-cols-3 gap-6 mt-6'>
      <Source
        title={'Stockage'}
        min={1}
        max={50}
        unit='Tb'
        impact={0.04}
      />
      <Source
        title={'Transferts de données / an'}
        min={10}
        max={1000}
        step={10}
        unit='Tb'
        impact={0.338}
      />
    </div>

  </div>
  )
}

export default App
