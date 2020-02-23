import React from "react"
import gql from "graphql-tag"
import { useSubscription } from "@apollo/react-hooks"
import { Paper, Box, IconButton } from "@material-ui/core"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons"
import { extendMoment } from "moment-range"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import ColorHash from "color-hash"
import CreateReservationForm from "./../components/CreateReservationForm"
import { SelectedReservation } from "../components/SelectedReservation"

const Moment = require("moment")
const moment = extendMoment(Moment)

const colorHash = new ColorHash()

const ROOMS_SUBSCRIPTION = gql`
  {
    room {
      room_number
      reservation_rooms {
        reservation {
          id
          arrival_date
          departure_date
        }
      }
    }
  }
`

function Schedule() {
  const { loading, error, data } = useSubscription(ROOMS_SUBSCRIPTION)
  const [currentMonth, setCurrentMonth] = React.useState(Moment())
  const [selectedId, setSelectedId] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const calendarRange = Array.from(
    moment
      .range(
        Moment(currentMonth).startOf("month"),
        Moment(currentMonth).endOf("month")
      )
      .by("day")
  )
  const handleOnPrevMonth = () => {
    setCurrentMonth(Moment(currentMonth).subtract("month", 1))
  }
  const handleOnNextMonth = () => {
    setCurrentMonth(Moment(currentMonth).add("month", 1))
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{`Error! ${error.message}`}</div>
  return (
    <>
      <h1>График: </h1>
      <CreateReservationForm />
      <Paper>
        <Box m={1} p={2}>
          <Box display="flex" flexDirection="row">
            <Box flex={2}></Box>
            <Box
              flex={8}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {/* <Typography variant="h4">{"Schedule"}</Typography> */}
            </Box>
            <Box flex={2} display="flex" justifyContent="flex-end">
              <IconButton onClick={handleOnPrevMonth}>
                <KeyboardArrowLeft />
              </IconButton>
              <Box display="flex" justifyContent="center" alignItems="center">
                {currentMonth.format("MMMM YYYY")}
              </Box>
              <IconButton onClick={handleOnNextMonth}>
                <KeyboardArrowRight />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                style={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
              >
                <TableCell>№</TableCell>
                {calendarRange.map(day => (
                  <TableCell
                    style={{
                      borderLeft: "1px solid rgba(224, 224, 224, 1)",
                      backgroundColor:
                        day.weekday() === 5 || day.weekday() === 6
                          ? "#ffffa8"
                          : "initial",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <div>{day.format("dd")}</div>
                      <div>{day.format("D")}</div>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.room.map(({ reservation_rooms, room_number }) => {
                const ranges = reservation_rooms.map(
                  ({ reservation: { arrival_date, departure_date, id } }) => ({
                    id,
                    range: moment.range(
                      Moment(arrival_date),
                      Moment(departure_date)
                    ),
                    color: colorHash.hex(id),
                  })
                )
                return (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {room_number}
                    </TableCell>
                    {calendarRange.map(day => {
                      const reservedDay = ranges.find(({ range }) =>
                        range.contains(day)
                      )
                      return (
                        <TableCell
                          // onMouseEnter={() => setSelectedId(reservedDay?.id)}
                          aria-describedby={id}
                          onClick={e => {
                            setSelectedId(reservedDay?.id)
                            handleClick(e)
                          }}
                          style={{
                            borderLeft: "1px solid rgba(224, 224, 224, 1)",
                            backgroundColor:
                              reservedDay?.color ||
                              ((day.weekday() === 5 || day.weekday() === 6) &&
                                "#ffffa8") ||
                              "initial",
                          }}
                        ></TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedId && (
          <SelectedReservation
            id={selectedId}
            anchorEl={anchorEl}
            handleClose={handleClose}
            open={open}
          />
        )}
      </Paper>
    </>
  )
}

export default Schedule
