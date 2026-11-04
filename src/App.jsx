import Statcard from './components/StatCard'
import { useEffect, useState } from 'react';
import './App.css'

function App() {

  const [tarefas, setTarefas] = useState(() => {
    try {
      const tarefasSalvas = localStorage.getItem("tarefas");

      if (tarefasSalvas !== null) {
        const tarefasConvertidas = JSON.parse(tarefasSalvas);

        if (Array.isArray(tarefasConvertidas)) {
          return tarefasConvertidas.map((tarefa) => ({
            ...tarefa,
            id: tarefa.id ?? crypto.randomUUID()
          }));
        }
      }
    } catch (erro) {
      console.error("Erro ao carregar tarefas:", erro);
    }

    return [
    {id: 1, texto: "Estudar React", concluida: false },
    {id: 2,texto: "Praticar JavaScript", concluida: false },
    {id: 3,texto: "Revisar o CSS", concluida: false },
    ];
  });

  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");

  function iniciarEdicao(tarefa) {
    setTarefaEditando(tarefa);
    setTextoEditado(tarefa.texto);
  }

  function removerTarefa(tarefaRemover) {
    if (tarefaEditando?.id === tarefaRemover.id) {
      setTarefaEditando(null);
      setTextoEditado("");
    }
    const novaLista = tarefas.filter(
      (tarefa) => tarefa.id !== tarefaRemover.id
    );
    setTarefas(novaLista);
  }

  function adicionarTarefa(evento) {
    evento.preventDefault();

    if (novaTarefa.trim() === "") {
      return;
    }

    const tarefaNova = {
      id: crypto.randomUUID(),
      texto: novaTarefa.trim(),
      concluida: false
    };

    const tarefaExiste = tarefas.some(
      (tarefa) => tarefa.texto.trim().replace(/\s+/g, " ").toLowerCase() ===
        novaTarefa.trim().replace(/\s+/g, " ").toLocaleLowerCase()
    );
    if (tarefaExiste){
      setSucesso("");
      setErro("Essa tarefa já existe!");
      return;
    }
    setErro("");
    setSucesso("Tarefa adicionada com sucesso!");

    setTarefas([...tarefas, tarefaNova]);

    setNovaTarefa("");
  }
  function salvarEdicao() {
    if (textoEditado.trim() === "") {
      return;
    }
    const nomeExiste = tarefas.some (
      (tarefa) =>
        tarefa.id !== tarefaEditando.id &&
      tarefa.texto.trim().replace(/\s+/g, " ").toLowerCase() ===
        textoEditado.trim().replace(/\s+/g, " ").toLowerCase()
    );
    if (nomeExiste) {
      setErro("Já existe uma tarefa com esse nome!");
      return;
    }

    setErro("");

    const novaLista = tarefas.map((tarefa) =>
      tarefa.id === tarefaEditando.id
        ?{ ...tarefa, texto: textoEditado.trim() }
      : tarefa
    );
    setTarefas(novaLista);
    setTarefaEditando(null);
    setTextoEditado(""); 
  }
  function alternarConclusao(idTarefa) {
    const novaLista = tarefas.map((tarefa) => 
      tarefa.id === idTarefa
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
  
  useEffect(() => {
    try {
      localStorage.setItem ('tarefas', JSON.stringify(tarefas));
    } catch (erro) {
      console.error("Erro ao salvar tarefas:", erro);
    }
  }, [tarefas]);

  useEffect(() => {
    if (sucesso === "") {
      return;
    }
    const temporizador = setTimeout(() => {
      setSucesso("");
    }, 2000);
    return () => clearTimeout(temporizador);
  }, [sucesso]);
  
  return (
    <>
  <div className="app-layout">

    <aside className="sidebar">

      <div className="brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M7 12.5L10.5 16L17.5 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="6"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h2>TaskFlow</h2>
      </div>

      <nav className="sidebar-nav">

        <p className="nav-label">MENU PRINCIPAL</p>

        <button
          type="button"
          className={filtro === "Todas" ? "nav-item active" : "nav-item"}
          onClick={() => setFiltro("Todas")}>
          <span>☷</span>
          Todas as tarefas
        </button>

        <button
          type="button"
          className={filtro === "Pendentes" ? "nav-item active" : "nav-item"}
          onClick={() => setFiltro("Pendentes")}>
          <span>◷</span>
          Pendentes
        </button>

        <button
          type="button"
          className={filtro === "Concluídas" ? "nav-item active" : "nav-item"}
          onClick={() => setFiltro("Concluídas")}>
          <span>✓</span>
          Concluídas
        </button>
      </nav>
      <div className="sidebar-footer">
        <span className="status-dot"></span>
        TaskFlow v1.0
      </div>

    </aside>

    <main className="dashboard">
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
          <input type="text" placeholder='Digite uma nova tarefa...' value={novaTarefa} required onChange={(evento) =>
            {setNovaTarefa(evento.target.value);
              setErro("");
            }
          } />
          <button type='submit' disabled={novaTarefa.trim() === ""}>
            Adicionar
          </button>
        </form>
        <p className={`error-message ${erro ? "visible" : ""}`}>
          {erro}
        </p>
        <p className={`success-message ${sucesso ? "visible" : ""}`}>
          {sucesso}
        </p>
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
        {tarefasFiltradas.length === 0 ? (
          <p className='empty-message'>
            Nenhuma tarefa encontrada
          </p>
        ) : (
        tarefasFiltradas.map((tarefa) => (
          <div className={`task-item ${tarefa.concluida ?"completed" : ""}`} key={tarefa.id}>
            {tarefaEditando?.id === tarefa.id ? (
              <input type='text' value={textoEditado} onChange={(evento) => setTextoEditado(evento.target.value)} onKeyDown={(evento) => {
                if (evento.key === "Enter") {
                  salvarEdicao();
                }
              }}
              />
            ) : (
              <p>{tarefa.texto}</p>
            )}
            {tarefaEditando?.id !== tarefa.id && (
            <button type='button' className='remove-button' onClick={() => removerTarefa(tarefa)}>
              Remover
            </button>
            )}
            
            {tarefaEditando?.id === tarefa.id ? (
              <button type='button' className='edit-button' onClick={salvarEdicao}>
                Salvar
              </button>
            ) : (
              <button type='button' className='edit-button' onClick={() => iniciarEdicao(tarefa)}>
              Editar
              </button>
            )}
            {tarefaEditando?.id === tarefa.id && (
              <button type='button' className='remove-button' onClick={() => {
                setTarefaEditando(null);
                setTextoEditado("");
                setErro("");
              }}>
                Cancelar
              </button>
            )}
            {tarefaEditando?.id !== tarefa.id && (
            <button type="button" className='complete-button' onClick={() => alternarConclusao(tarefa.id)}>
              {tarefa.concluida ? "Desmarcar" : "Concluir"}
            </button>
            )}
          </div>
          ))
        )}
      </section>

    </main>
    </div>
    </>
  )
}

export default App
