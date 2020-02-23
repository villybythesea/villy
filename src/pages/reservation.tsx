import React from "react"
import qs from "query-string"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { TextField, Paper, Box } from "@material-ui/core"
import { extendMoment } from "moment-range"

const Moment = require("moment")
const moment = extendMoment(Moment)

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
  console.log(data)
  const start = moment(data.reservation_by_pk.arrival_date)
  const end = moment(data.reservation_by_pk.departure_date).endOf("day")

  const range = moment.range(start, end)

  const arrayOfDates = Array.from(range.by("days")).map(m =>
    m.format("YYYY-MM-DD")
  )

  const pricing = {
    double: {
      MAY: 40,
      JUNE: 46,
      JULY: 60,
      AUGUST: 60,
      SEPTEMBER: 50,
    },
    tripple: {
      MAY: 60,
      JUNE: 69,
      JULY: 90,
      AUGUST: 90,
      SEPTEMBER: 75,
    },
    apartment: {
      MAY: 90,
      JUNE: 92,
      JULY: 120,
      AUGUST: 120,
      SEPTEMBER: 100,
    },
  }
  const roomsArr = data.reservation_by_pk.reservation_rooms.reduce(
    (total, { room }) => {
      return (
        total +
        arrayOfDates.reduce((acc, day) => {
          const containsMay =
            moment()
              .month(4)
              .range("month")
              .contains(moment(day)) && "MAY"
          const containsJune =
            moment()
              .month(5)
              .range("month")
              .contains(moment(day)) && "JUNE"
          const containsJuly =
            moment()
              .month(6)
              .range("month")
              .contains(moment(day)) && "JULY"
          const containsAugust =
            moment()
              .month(7)
              .range("month")
              .contains(moment(day)) && "AUGUST"
          const containsSeptember =
            moment()
              .month(8)
              .range("month")
              .contains(moment(day)) && "SEPTEMBER"
          return (
            acc +
            pricing[room.room_type.room_type][
              containsMay ||
                containsJune ||
                containsJuly ||
                containsAugust ||
                containsSeptember
            ]
          )
        }, 0)
      )
    },
    0
  )
  console.log(roomsArr)

  // const pricing = range.contains(moment().month(4))

  return (
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
          <b>Days:</b> {range.diff("days") + 1}
        </div>
        <div>
          <b>Price:</b> {roomsArr} lv.
        </div>
        <div>
          <b>Deposit:</b> {roomsArr - roomsArr * (1 - 0.35)} lv.
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
  )
}
