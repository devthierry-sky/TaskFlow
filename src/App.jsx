import Statcard from './components/StatCard'
import { useState } from 'react';
import './App.css'



function App() {

    const [tarefas, setTarefas] = useState([
    "Estudar React",
    "Praticar JavaScript",
    "Revisar o CSS"
  ]);

  return (
    <>
    <main className='dashboard'>
      <header className='header'>
        <h1>TaskFlow</h1>
        <p>Organize suas tarefas e acompanhe seu progresso.</p>
      </header>

      <section className='stats'>
        <Statcard title= "Total de tarefas" value={12} />
        <Statcard title= "Tarefas pendentes" value= {8} />
        <Statcard title= "Tarefas concluidas" value= {4} />
      </section>

      <section className='task-list'>
        <h2>Minhas tarefas</h2>

        {tarefas.map((tarefa) => (
          <div className='task-item' key={tarefa}>
            <p>{tarefa}</p>
          </div>
        ))}
      </section>

    </main>
    </>
  )
}

export default App
