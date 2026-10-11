import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../App.css'

function GameDetails() {
  const { id } = useParams()

  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)

  const apiKey = import.meta.env.VITE_RAWG_API_KEY

  useEffect(() => {
    fetch(
      `https://api.rawg.io/api/games/${id}?key=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        setGame(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(
          'Erro ao buscar detalhes do jogo:',
          error
        )

        setLoading(false)
      })
  }, [id, apiKey])

  if (loading) {
    return (
      <div className="details-page">
        <p>Carregando detalhes...</p>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="details-page">
        <p>
          Não foi possível carregar os detalhes do jogo.
        </p>
      </div>
    )
  }

  return (
    <div className="details-page">
      <Link
        to="/"
        className="back-button"
      >
        ← Voltar
      </Link>

      <div className="details-content">
        {game.background_image && (
          <img
            className="details-image"
            src={game.background_image}
            alt={game.name}
          />
        )}

        <div className="details-info">
          <h1>{game.name}</h1>

          <p className="details-rating">
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

          <p>
            <strong>
              Desenvolvedoras:
            </strong>{' '}
            {game.developers?.length > 0
              ? game.developers
                  .map(
                    (developer) =>
                      developer.name
                  )
                  .join(', ')
              : 'Não informado'}
          </p>

          <p>
            <strong>
              Metacritic:
            </strong>{' '}
            {game.metacritic || 'Não informado'}
          </p>

          <div className="description">
            <h2>Sobre o jogo</h2>

            <p>
              {game.description_raw ||
                'Descrição não disponível.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetails