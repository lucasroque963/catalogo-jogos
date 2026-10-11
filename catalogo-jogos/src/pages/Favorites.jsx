import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function Favorites() {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites')

    return savedFavorites
      ? JSON.parse(savedFavorites)
      : []
  })

  function removeFavorite(gameId) {
    const updatedFavorites = favorites.filter(
      (game) => game.id !== gameId
    )

    setFavorites(updatedFavorites)

    localStorage.setItem(
      'favorites',
      JSON.stringify(updatedFavorites)
    )
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <Link
          to="/"
          className="back-button"
        >
          ← Voltar
        </Link>

        <h1>Meus Favoritos</h1>

        <p>
          Jogos que você salvou para ver depois.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <h2>Nenhum jogo favoritado</h2>

          <p>
            Volte para o catálogo e favorite alguns jogos.
          </p>

          <Link
            to="/"
            className="details-button"
          >
            Explorar jogos
          </Link>
        </div>
      ) : (
        <div className="games-grid">
          {favorites.map((game) => (
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

                <div className="card-actions">
                  <Link
                    to={`/game/${game.id}`}
                    className="details-button"
                  >
                    Ver detalhes
                  </Link>

                  <button
                    className="remove-favorite-button"
                    onClick={() =>
                      removeFavorite(game.id)
                    }
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites