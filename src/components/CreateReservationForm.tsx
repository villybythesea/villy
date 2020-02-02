import * as React from "react"
import { useFormik } from "formik"
import { useMutation, useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import TextField from "@material-ui/core/TextField"
import moment from "moment"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import Input from "@material-ui/core/Input"
import MenuItem from "@material-ui/core/MenuItem"
import Chip from "@material-ui/core/Chip"
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import MomentUtils from "@date-io/moment"
import Box from "@material-ui/core/Box"
import Radio from "@material-ui/core/Radio"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import RadioGroup from "@material-ui/core/RadioGroup"

const RESERVATION_MUTATION = gql`
  mutation CreateReservation(
    $arrival_date: date!
    $departure_date: date!
    $data: [reservation_room_insert_input!]!
    $userData: client_insert_input!
  ) {
    insert_reservation(
      objects: {
        arrival_date: $arrival_date
        departure_date: $departure_date
        reservation_rooms: { data: $data }
        client: { data: $userData }
      }
    ) {
      affected_rows
    }
  }
`
const CREATE_RESERVATION_UPDATE_CLIENT_MUTATION = gql`
  mutation CreateReservation(
    $arrival_date: date!
    $departure_date: date!
    $data: [reservation_room_insert_input!]!
    $userId: uuid!
  ) {
    insert_reservation(
      objects: {
        arrival_date: $arrival_date
        departure_date: $departure_date
        reservation_rooms: { data: $data }
        client_id: $userId
      }
    ) {
      affected_rows
    }
  }
`

const CAPACITY_CHECK = gql`
  query($arrival_date: String!, $departure_date: String!) {
    capacity_check(
      arrival_date: $arrival_date
      departure_date: $departure_date
    ) @client
  }
`

const USER_QUERY = gql`
  query {
    client {
      id
      first_name
      last_name
    }
  }
`

const DATE_FORMAT = "YYYY-MM-DD"
const initialValues = {
  arrival_date: moment().format(DATE_FORMAT),
  departure_date: moment()
    .add("days", 3)
    .format(DATE_FORMAT),
  data: [],
  userId: null,
  first_name: null,
  last_name: null,
  email: null,
  phone_number: null,
}

const useCreateReservation = () => {
  const [addReservationWithExistingClient] = useMutation(
    CREATE_RESERVATION_UPDATE_CLIENT_MUTATION
  )
  const [addReservationWithNewUser] = useMutation(RESERVATION_MUTATION)
  const {
    handleChange,
    handleSubmit,
    isSubmitting,
    values,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: async ({
      arrival_date,
      departure_date,
      data,
      email,
      first_name,
      last_name,
      phone_number,
      userId,
    }) => {
      const userData = {
        email,
        first_name,
        last_name,
        phone_number,
      }
      if (userId) {
        addReservationWithExistingClient({
          variables: {
            arrival_date,
            departure_date,
            data: data.map(room_id => ({ room_id })),
            ...(userId ? { userId } : {}),
          },
        })
      } else {
        addReservationWithNewUser({
          variables: {
            arrival_date,
            departure_date,
            data: data.map(room_id => ({ room_id })),
            ...(email && first_name && last_name && phone_number
              ? { userData }
              : {}),
            ...(userId ? { userId } : {}),
          },
        })
      }

      resetForm()
    },
  })
  return { handleChange, handleSubmit, isSubmitting, values, setFieldValue }
}

const CreateReservationFrom = () => {
  const {
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    values: { arrival_date, departure_date, ...values },
  } = useCreateReservation()

  const { data, loading, error } = useQuery(CAPACITY_CHECK, {
    variables: { arrival_date, departure_date },
  })
  const [value, setValue] = React.useState("new")

  const handleRadio = event => {
    setValue(event.target.value)
  }
  if (error) return <div>{`Error! ${error.message}`}</div>
  return (
    <Paper>
      <Box mb={1.5} p={2}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                autoOk
                disablePast
                label="Настаняване"
                value={arrival_date}
                format={DATE_FORMAT}
                onChange={date => {
                  setFieldValue("arrival_date", date.format(DATE_FORMAT))
                }}
              />
              <DatePicker
                autoOk
                label="Освобождаване"
                format={DATE_FORMAT}
                value={departure_date}
                onChange={date => {
                  setFieldValue("departure_date", date.format(DATE_FORMAT))
                }}
                minDate={moment(arrival_date)
                  .add("days", 1)
                  .format(DATE_FORMAT)}
              />
            </MuiPickersUtilsProvider>
            {!loading && data && (
              <>
                <InputLabel id="select-label" shrink>
                  Стаи
                </InputLabel>
                <Select
                  disabled={data.capacity_check.length === 0}
                  labelId="select-label"
                  id="data"
                  name={"data"}
                  multiple
                  onChange={handleChange}
                  input={<Input id="select-multiple-chip" />}
                  value={values.data}
                  autoWidth
                  renderValue={selectedRooms => {
                    const roomNumbers = data.capacity_check.reduce(
                      (rooms, { id, room_number }) => ({
                        ...rooms,
                        [id]: room_number,
                      }),
                      {}
                    )
                    return (
                      <div>
                        {selectedRooms.map(selectedRoomId => (
                          <Chip
                            key={selectedRoomId}
                            label={roomNumbers[selectedRoomId]}
                            size="small"
                          />
                        ))}
                      </div>
                    )
                  }}
                >
                  {data.capacity_check.map(room => (
                    <MenuItem
                      key={room.id}
                      name={room.room_number}
                      value={room.id}
                      size="small"
                    >
                      {room.room_number}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={value}
              onChange={handleRadio}
              color="primary"
            >
              <Box display="flex" flexDirection="row">
                <FormControlLabel
                  value="new"
                  control={<Radio color="primary" />}
                  label="Нов клиент"
                />
                <FormControlLabel
                  value="existing"
                  control={<Radio color="primary" />}
                  label="Клиент"
                />
              </Box>
            </RadioGroup>
            {value === "new" ? (
              <>
                <TextField
                  id="first_name"
                  name="first_name"
                  type="text"
                  label="Собствено име"
                  onChange={handleChange}
                  value={values.first_name}
                />
                <TextField
                  id="last_name"
                  name="last_name"
                  type="text"
                  label="Фамилно име"
                  onChange={handleChange}
                  value={values.last_name}
                />
                <TextField
                  id="email"
                  name="email"
                  type="text"
                  label="Имейл"
                  onChange={handleChange}
                  value={values.email}
                />
                <TextField
                  id="phone_number"
                  name="phone_number"
                  type="number"
                  label="Мобилен номер"
                  onChange={handleChange}
                  value={values.phone_number}
                />
              </>
            ) : (
              <SelectUserField
                name="userId"
                id="userId"
                onChange={handleChange}
                value={values.userId}
                autoWidth
              />
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: 10 }}
          >
            регистрация
          </Button>
        </form>
      </Box>
    </Paper>
  )
}

const SelectUserField = props => {
  const { data, loading, error } = useQuery(USER_QUERY)
  if (loading) return <div>loading</div>
  if (error) return <div>{error.message}</div>
  return (
    <Select {...props}>
      {data.client.map(({ first_name, last_name, id }) => (
        <MenuItem key={id} value={id}>
          {first_name} {last_name}
        </MenuItem>
      ))}
    </Select>
  )
}

export default CreateReservationFrom
