import { useParams } from 'react-router-dom'
import DetailsView from '../components/DetailsView'

export default function TvDetails() {
  const { id } = useParams()
  return <DetailsView type="tv" id={id} />
}