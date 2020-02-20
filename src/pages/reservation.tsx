import React from "react"
import qs from "query-string"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { TextField } from "@material-ui/core"

export default props => {
  const { id } = qs.parse(props.location.search)
  const { data, loading, error } = useQuery(
    gql`
      query ReservationById($id: uuid!) {
        reservation_by_pk(id: $id) {
          departure_date
          arrival_date
          note
        }
      }
    `,
    { variables: { id } }
  )
  if (loading) return "loading"
  if (error) return "error"
  console.log(data)
  return (
    <div>
      <div>
        <b>ID:</b> {id}
      </div>
      <div>
        <b>Arrival date:</b> {data.reservation_by_pk.arrival_date}
      </div>
      <div>
        <b>Departure date:</b> {data.reservation_by_pk.departure_date}
      </div>
      <br />
      <div>
        <TextField
          label="Note"
          variant="outlined"
          value={data.reservation_by_pk.note}
          disabled
          multiline
          rows={4}
        />
      </div>
    </div>
  )
}
