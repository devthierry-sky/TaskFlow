import Statcard from './components/StatCard'
import { useState } from 'react';
import './App.css'



function App() {

  const [tarefas, setTarefas] = useState([
    {texto: "Estudar React", concluida: false },
    {texto: "Praticar JavaScript", concluida: false },
    {texto: "Revisar o CSS", concluida: false },
  ]);

  const [novaTarefa, setNovaTarefas] = useState("");
  const [filtro, setFiltro] = useState("Todas");

  function removerTarefa(tarefaRemover) {
    const novaLista = tarefas.filter(
      (tarefa) => tarefa.texto !== tarefaRemover.texto
    );
    setTarefas(novaLista);
  }

  function adicionarTarefa(evento) {
    evento.preventDefault();

    if (novaTarefa.trim() === "") {
      return;
    }
    const tarefaNova = {
      texto: novaTarefa.trim(),
      concluida: false
    };

    setTarefas([...tarefas, tarefaNova]);
    setNovaTarefa("");
  }

  function alternarConclusao(textoTarefa) {
    const novaLista = tarefas.map((tarefa) => 
      tarefa.texto === textoTarefa
        ? {...tarefa, concluida: !tarefa.concluida}
      : tarefa
    );
    setTarefas(novaLista);
  }

    const totalTarefas = tarefas.length;

    const tarefasConcluidas = tarefas.filter(
      (tarefa) => tarefa.concluida
    ).length;

    const tarefasPendentes = totalTarefas - tarefasConcluidas;

    const tarefasFiltradas = tarefas.filter ((tarefa) => {
      return (
        filtro === "Todas" ||
        (filtro === "Pendentes" && tarefa.concluida === false) ||
        (filtro === "Concluídas" && tarefa.concluida === true)
      );
    });

  return (
    <>
    <main className='dashboard'>
      <header className='header'>
        <h1>TaskFlow</h1>
        <p>Organize suas tarefas e acompanhe seu progresso.</p>
      </header>

      <section className='stats'>
        <Statcard title= "Total de tarefas" value={totalTarefas} />
        <Statcard title= "Tarefas pendentes" value= {tarefasPendentes} />
        <Statcard title= "Tarefas concluidas" value= {tarefasConcluidas} />
      </section>

      <section className='task-list'>
        <h2>Minhas tarefas</h2>
        
        <form className='task-form' onSubmit={adicionarTarefa}>
          <input type="text" placeholder='Digite uma nova tarefa...' value={novaTarefa} onChange={(evento) => setNovaTarefas(evento.target.value)} />
          <button type='submit'>Adicionar</button>
        </form>
        <div className='task-filters'>
          <button
            className={filtro === "Todas" ? "active" : ""} 
            onClick={() => setFiltro("Todas")}>
              Todas
          </button>
          <button
            className={filtro === "Pendentes" ? "active" : ""}
            onClick={() => setFiltro("Pendentes")}>
              Pendentes
          </button>
          <button 
            className={filtro === "Concluídas" ? "active" : ""}
            onClick={() => setFiltro("Concluídas")}>
              Concluídas
          </button>
        </div>
        {tarefasFiltradas.map((tarefa) => (
          <div className={`task-item ${tarefa.concluida ?"completed" : ""}`} key={tarefa.texto}>
            <p>{tarefa.texto}</p>

            <button type='button'                          className='remove-button' onClick={() => removerTarefa(tarefa)}>
              Remover
            </button>

            <button type="button" className='complete-button' onClick={() => alternarConclusao(tarefa.texto)}>
              {tarefa.concluida ? "Desmarcar" : "Concluir"}
            </button>
          </div>
        ))}
      </section>

    </main>
    </>
  )
}

export default App
