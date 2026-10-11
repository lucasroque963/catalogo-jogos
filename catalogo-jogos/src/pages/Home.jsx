import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
  const [games, setGames] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites')

    return savedFavorites ? JSON.parse(savedFavorites) : []
  })

  const apiKey = import.meta.env.VITE_RAWG_API_KEY

  function buscarJogos(nome = '') {
    setLoading(true)

    let url = `https://api.rawg.io/api/games?key=${apiKey}`

    if (nome) {
      url += `&search=${nome}`
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setGames(data.results || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Erro ao buscar jogos:', error)
        setLoading(false)
      })
  }

  useEffect(() => {
    buscarJogos()
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    buscarJogos(search)
  }

  function toggleFavorite(game) {
    const isFavorite = favorites.some(
      (item) => item.id === game.id
    )

    let updatedFavorites

    if (isFavorite) {
      updatedFavorites = favorites.filter(
        (item) => item.id !== game.id
      )
    } else {
      updatedFavorites = [...favorites, game]
    }

    setFavorites(updatedFavorites)

    localStorage.setItem(
      'favorites',
      JSON.stringify(updatedFavorites)
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>GameHub</h1>

        <p>Encontre seu próximo jogo favorito</p>

        <Link
          to="/favorites"
          className="favorites-link"
        >
          ★ Meus Favoritos
        </Link>
      </header>

      <main className="container">
        <form
          className="search-area"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Pesquisar jogos..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button type="submit">
            Buscar
          </button>
        </form>

        <section className="games-section">
          <h2>
            {search
              ? 'Resultados da busca'
              : 'Jogos populares'}
          </h2>

          {loading ? (
            <p className="loading">
              Carregando jogos...
            </p>
          ) : (
            <div className="games-grid">
              {games.map((game) => (
                <div
                  className="game-card"
                  key={game.id}
                >
                  {game.background_image && (
                    <img
                      src={game.background_image}
                      alt={game.name}
                    />
                  )}

                  <div className="game-info">
                    <h3>{game.name}</h3>

                    <p className="rating">
                      ⭐ {game.rating}
                    </p>

                    <p>
                      <strong>
                        Lançamento:
                      </strong>{' '}
                      {game.released
                        ? new Date(
                            game.released
                          ).toLocaleDateString(
                            'pt-BR'
                          )
                        : 'Não informado'}
                    </p>

                    <p>
                      <strong>
                        Gêneros:
                      </strong>{' '}
                      {game.genres?.length > 0
                        ? game.genres
                            .map(
                              (genre) =>
                                genre.name
                            )
                            .join(', ')
                        : 'Não informado'}
                    </p>

                    <p>
                      <strong>
                        Plataformas:
                      </strong>{' '}
                      {game.platforms?.length > 0
                        ? game.platforms
                            .map(
                              (item) =>
                                item.platform.name
                            )
                            .join(', ')
                        : 'Não informado'}
                    </p>

                    <div className="card-actions">
                      <Link
                        to={`/game/${game.id}`}
                        className="details-button"
                      >
                        Ver detalhes
                      </Link>

                      <button
                        className="favorite-button"
                        onClick={() =>
                          toggleFavorite(game)
                        }
                      >
                        {favorites.some(
                          (item) =>
                            item.id === game.id
                        )
                          ? '★ Favoritado'
                          : '☆ Favoritar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Home