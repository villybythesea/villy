import * as React from "react"
import { useMutation, useSubscription } from "@apollo/react-hooks"
import gql from "graphql-tag"
import moment from "moment"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import Box from "@material-ui/core/Box"

const DELETE_RESERVATION = gql`
  mutation DeleteReservation($id: uuid!) {
    delete_reservation_room(where: { reservation_id: { _eq: $id } }) {
      affected_rows
    }
    delete_reservation(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

const GET_RESERVATIONS = gql`
  subscription {
    reservation(order_by: { created_at: desc }) {
      id
      arrival_date
      departure_date
      created_at
      updated_at
      client {
        first_name
        last_name
      }
      rooms: reservation_rooms {
        room {
          room_number
        }
      }
    }
  }
`

export const Reservations = () => {
  const { loading, error, data } = useSubscription(GET_RESERVATIONS)
  const [deleteReservation] = useMutation(DELETE_RESERVATION)
  if (loading) return <div>Loading...</div>
  if (error) return <div>{`Error! ${error.message}`}</div>
  return data.reservation.length > 0 ? (
    <Paper>
      <Box mb={1.5}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Клиентско име</TableCell>
              <TableCell align="left">Настаняване</TableCell>
              <TableCell align="left">Освобождаване</TableCell>
              <TableCell align="left">Стай</TableCell>
              <TableCell align="left">Съставена</TableCell>
              <TableCell align="left">Редактирана</TableCell>
              <TableCell align="left">ИН</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.reservation.map(
              (
                {
                  id,
                  arrival_date,
                  departure_date,
                  rooms,
                  created_at,
                  updated_at,
                  client: { first_name, last_name },
                },
                index
              ) => (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">
                    {first_name} {last_name}
                  </TableCell>
                  <TableCell align="left">
                    {moment(arrival_date).format("DD MMMM YYYY")}
                  </TableCell>
                  <TableCell align="left">
                    {moment(departure_date).format("DD MMMM YYYY")}
                  </TableCell>
                  <TableCell align="left">
                    {rooms.map(({ room }) => (
                      <Chip
                        label={room.room_number}
                        style={{ marginRight: 5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="left">
                    {moment(created_at).format("DD MMMM YYYY")}
                  </TableCell>
                  <TableCell align="left">
                    {moment(updated_at).format("DD MMMM YYYY")}
                  </TableCell>
                  <TableCell align="left">{id}</TableCell>
                  <TableCell align="left">
                    <Button
                      size="small"
                      color="secondary"
                      variant="outlined"
                      onClick={() => {
                        alert("You are about to delete")
                        deleteReservation({ variables: { id } })
                      }}
                    >
                      изтрий
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  ) : (
    <h1>Няма текущи резерваций...</h1>
  )
}
