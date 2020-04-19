import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repos, setRepos] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  useEffect(function() {
    api.get("/repositories").then((response) => {
      setRepos(response.data);
    }, (_error) => {
      alert("Server not found!");
    });
  }, []);

  async function handleAddRepository(event) {
    event.preventDefault();
    if (name && description && link) {
      try {
        const data = { name, description, link };
        const response = await api.post("/repositories", data);
        setName("");
        setDescription("");
        setLink("");
        setRepos([...repos, response.data]);
      } catch(ex) {
        alert("Não foi possível criar o repositório, Tente novamente!");
      }
    } else {
      alert("Preencha todos os campos.");
    }
  }

  async function handleRemoveRepository(id) {
    try {
      const response = await api.delete(`/repositories/${id}`);
      if (response.status === 204) {
        setRepos(repos.filter((repo) => repo.id !== id));
      } else {
        alert("Não foi possível excluir o repositório. Tente novamente!")
      }
    } catch(ex) {
      alert("Não foi possível excluir o repositório. Tente novamente!")
    }
  }

  return (
    <div className="container">
      <h1>Desafio JS</h1>

      <ul data-testid="repository-list">
        {
          repos.map((repo) => (
            <li key={repo.id}>
              {repo.name}

              <button onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </li>
          ))
        }
      </ul>


      <form onSubmit={handleAddRepository}>
        <input
          type="text"
          placeholder="Nome"
          name="name"
          maxLength={50}
          value={name}
          onChange={(event) => { setName(event.target.value) }} />

        <input
          type="text"
          placeholder="Descrição"
          name="description"
          maxLength={50}
          value={description}
          onChange={(event) => { setDescription(event.target.value) }} />

        <input
          type="text"
          placeholder="Link"
          name="link"
          maxLength={250} 
          value={link}
          onChange={(event) => { setLink(event.target.value) }}/>

        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
}

export default App;
