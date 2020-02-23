import React from "react"
import qs from "query-string"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { TextField, Paper, Box } from "@material-ui/core"
import { useReservationCalc } from "../utils/useReservationCalc"

export default props => {
  const { id } = qs.parse(props.location.search)
  const { data, loading, error } = useQuery(
    gql`
      query ReservationById($id: uuid!) {
        reservation_by_pk(id: $id) {
          departure_date
          arrival_date
          note
          reservation_rooms {
            room {
              room_type {
                id
                room_type
              }
            }
          }
        }
      }
    `,
    { variables: { id } }
  )
  if (loading) return "loading"
  if (error) return error.message
  const { total, deposit, nights } = useReservationCalc({
    rooms: data.reservation_by_pk.reservation_rooms,
    arrival_date: data?.reservation_by_pk.arrival_date,
    departure_date: data?.reservation_by_pk.departure_date,
  })

  return (
    <>
      <h1>Резервация: </h1>
      <Paper>
        <Box mb={1.5} p={2}>
          <div>
            <b>ID:</b> {id}
          </div>
          <div>
            <b>Arrival date:</b> {data.reservation_by_pk.arrival_date}
          </div>
          <div>
            <b>Departure date:</b> {data.reservation_by_pk.departure_date}
          </div>
          <div>
            <b>Days:</b> {nights}
          </div>
          <div>
            <b>Price:</b> {total} lv.
          </div>
          <div>
            <b>Deposit:</b> {deposit} lv.
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
        </Box>
      </Paper>
    </>
  )
}
