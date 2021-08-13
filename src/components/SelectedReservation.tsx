import React from "react"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import { Box, Typography, Button } from "@material-ui/core"
import { navigate } from "gatsby"
import Popover from "@material-ui/core/Popover"
import { useReservationCalc } from "./../utils/useReservationCalc"

export const SelectedReservation = ({ id, anchorEl, handleClose, open }) => {
  const { data, loading, error } = useQuery(
    gql`
      query GetReservation($id: uuid!) {
        reservation_by_pk(id: $id) {
          arrival_date
          departure_date
          client {
            first_name
            last_name
            phone_number
          }
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

  const { total, deposit, balance, nights } = useReservationCalc({
    rooms: data.reservation_by_pk.reservation_rooms,
    arrival_date: data?.reservation_by_pk.arrival_date,
    departure_date: data?.reservation_by_pk.departure_date,
  })
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box p={2}>
        <Box>
          <Typography>
            Настаняване: {data?.reservation_by_pk.arrival_date}
          </Typography>
          <Typography>
            Освобождаване: {data?.reservation_by_pk.departure_date}
          </Typography>
          <Typography>
            Клиентско име: {data?.reservation_by_pk.client.first_name}{" "}
            {data?.reservation_by_pk.client.last_name}
          </Typography>
          <Typography>
            Клиентски тел. номер: 0{data?.reservation_by_pk.client.phone_number}
          </Typography>
          <Typography>Нощувки: {nights}</Typography>
          <Typography>Цена: {total} лв.</Typography>
          <Typography>Депозит: {deposit} лв.</Typography>
          <Typography>Остатък: {balance} лв.</Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate(`reservation?id=${id}`)}
          >
            Виж повече
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}
