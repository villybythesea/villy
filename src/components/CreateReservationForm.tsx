import * as React from "react"
import { navigate } from "gatsby"
import {
  Paper,
  Box,
  Button,
  InputLabel,
  FormControl,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core"
import { TextField, Select } from "formik-material-ui"
import { Formik, Form, useFormikContext } from "formik"
import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/react-hooks"

import MomentUtils from "@date-io/moment"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import { DatePicker } from "formik-material-ui-pickers"
import * as Yup from "yup"
import moment from "moment"
import "moment/locale/bg" // without this line it didn't work
import { Reservations } from "../components/Reservations"

moment.locale("bg")

const {
  REQUIRED_FIELD,
  INVALID_EMAIL,
  EMAIL_LABEL,
  ARRIVAL_DATE_LABEL,
  DEPARTURE_DATE_LABEL,
  REGISTRATION_SUBMIT_LABEL,
} = {
  REQUIRED_FIELD: "Полето е задължително",
  INVALID_EMAIL: "Полето трябва да е валиден емайл",
  EMAIL_LABEL: "Емайл",
  ARRIVAL_DATE_LABEL: "Настаняване",
  DEPARTURE_DATE_LABEL: "Напускане",
  REGISTRATION_SUBMIT_LABEL: "Запиши",
}

const SelectField = props => {
  const inputLabel = React.useRef(null)
  const [labelWidth, setLabelWidth] = React.useState(0)
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth)
  }, [])
  return (
    <FormControl variant="outlined" style={{ marginTop: 15 }}>
      <InputLabel ref={inputLabel} id={`select-label-${props.name}`}>
        {props.label} {props.required && "*"}
      </InputLabel>
      <Select
        labelId={`select-label-${props.name}`}
        labelWidth={labelWidth}
        {...props}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
      >
        {props.children}
      </Select>
    </FormControl>
  )
}
const RESERVATION_MUTATION = gql`
  mutation CreateReservation(
    $arrival_date: date!
    $departure_date: date!
    $data: [reservation_room_insert_input!]!
    $userData: client_insert_input!
    $note: String
  ) {
    insert_reservation(
      objects: {
        arrival_date: $arrival_date
        departure_date: $departure_date
        reservation_rooms: { data: $data }
        client: { data: $userData }
        note: $note
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

const CapacitySelectField = () => {
  const {
    values: { arrival_date, departure_date },
  } = useFormikContext()
  const { data, loading, error } = useQuery(CAPACITY_CHECK, {
    variables: { arrival_date, departure_date },
  })
  if (loading) return "loading..."
  if (error) return error.message
  return (
    <>
      <SelectField
        multiple
        required
        name="roomIds"
        label={`Стай (${data?.capacity_check.length | 0})`}
        error={data?.capacity_check.length === 0}
        disabled={data?.capacity_check.length === 0}
      >
        {data.capacity_check.map(({ room_number, id }) => (
          <MenuItem value={id}>{room_number}</MenuItem>
        ))}
      </SelectField>
      {data?.capacity_check.length === 0 && (
        <FormHelperText error>Няма свободни стаи</FormHelperText>
      )}
    </>
  )
}
const SelectUserField = () => {
  const { data, loading, error } = useQuery(gql`
    query {
      client {
        id
        first_name
        last_name
      }
    }
  `)
  if (loading) return <div>loading</div>
  if (error) return <div>{error.message}</div>
  return (
    <SelectField name="userId" label={"Клиентско име"} required>
      {data.client.map(({ first_name, last_name, id }) => (
        <MenuItem key={id} value={id}>
          {first_name} {last_name}
        </MenuItem>
      ))}
    </SelectField>
  )
}

const DateRangePickers = () => {
  const {
    values: { arrival_date },
  } = useFormikContext()
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        autoOk
        disablePast
        name="arrival_date"
        label={ARRIVAL_DATE_LABEL}
        inputVariant="outlined"
        style={{ marginTop: 15 }}
        required
      />
      <DatePicker
        autoOk
        disablePast
        name="departure_date"
        label={DEPARTURE_DATE_LABEL}
        inputVariant="outlined"
        required
        style={{ marginTop: 15 }}
        minDate={moment(arrival_date).add("days", 1)}
      />
    </MuiPickersUtilsProvider>
  )
}

const IndexPage = () => {
  const [value, setValue] = React.useState("new")
  const handleRadio = event => {
    setValue(event.target.value)
  }
  const [
    addReservationWithExistingClient,
    { error, loading, data },
  ] = useMutation(CREATE_RESERVATION_UPDATE_CLIENT_MUTATION)
  const [addReservationWithNewUser, { error: newUserError }] = useMutation(
    RESERVATION_MUTATION
  )
  console.log(data)

  return (
    <>
      <Paper>
        <Formik
          initialValues={{
            arrival_date: moment(),
            departure_date: moment().add(3, "days"),
            first_name: "",
            last_name: "",
            email: null,
            phone_number: null,
            roomIds: [],
            note: "",
            userId: null,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (values.userId) {
              addReservationWithExistingClient({
                variables: {
                  arrival_date: values.arrival_date,
                  departure_date: values.departure_date,
                  data: values.roomIds.map(room_id => ({ room_id })),
                  userId: values.userId,
                  note: values.note,
                },
              })
            } else {
              addReservationWithNewUser({
                variables: {
                  arrival_date: values.arrival_date,
                  departure_date: values.departure_date,
                  data: values.roomIds.map(room_id => ({ room_id })),
                  userData: {
                    email: values.email,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    phone_number: values.phone_number,
                  },
                  note: values.note,
                },
              })
            }
            resetForm()
            setSubmitting(false)
          }}
          validationSchema={Yup.object().shape({
            arrival_date: Yup.date().required(REQUIRED_FIELD),
            departure_date: Yup.date().required(REQUIRED_FIELD),
            ...(value === "new" && {
              first_name: Yup.string().required(REQUIRED_FIELD),
              last_name: Yup.string().required(REQUIRED_FIELD),
              email: Yup.string()
                .nullable()
                .email(INVALID_EMAIL),
              phone_number: Yup.number()
                .nullable()
                .required(REQUIRED_FIELD),
            }),
            ...(value === "existing" && { userId: Yup.string().required() }),
            roomIds: Yup.array()
              .of(Yup.string())
              .min(1),
            note: Yup.string(),
          })}
        >
          <Form noValidate autoComplete="off">
            <Box p={2} display="flex" flexDirection="column">
              <DateRangePickers />
              <CapacitySelectField />
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
              {value === "existing" && <SelectUserField />}
              {value === "new" && (
                <>
                  <TextField
                    variant="outlined"
                    name="first_name"
                    type="text"
                    label="Собствено име"
                    style={{ marginTop: 15 }}
                    required
                    autoComplete="off"
                  />
                  <TextField
                    variant="outlined"
                    name="last_name"
                    type="text"
                    label="Фамилно име"
                    style={{ marginTop: 15 }}
                    required
                    autoComplete="off"
                  />
                  <TextField
                    variant="outlined"
                    name="phone_number"
                    type="number"
                    label="Мобилен номер"
                    style={{ marginTop: 15 }}
                    required
                    autoComplete="off"
                  />
                  <TextField
                    name="email"
                    type="email"
                    label={EMAIL_LABEL}
                    variant="outlined"
                    style={{ marginTop: 15 }}
                    autoComplete="off"
                  />
                </>
              )}
              <TextField
                variant="outlined"
                name="note"
                type="text"
                label="Забележка"
                style={{ marginTop: 15 }}
                autoComplete="off"
                multiline
                rows="4"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: 15 }}
              >
                {REGISTRATION_SUBMIT_LABEL}
                {loading && <CircularProgress size={24} color="secondary" />}
              </Button>
              {error ||
                (newUserError && (
                  <FormHelperText error>
                    Резервацията не беше регистрирана!
                  </FormHelperText>
                ))}
              {data?.insert_reservation.affected_rows && (
                <FormHelperText style={{ color: "green" }}>
                  Резервацията беше успешно регистрирана!
                </FormHelperText>
              )}
            </Box>
          </Form>
        </Formik>
      </Paper>
    </>
  )
}

const CREATE_RESERVATION_UPDATE_CLIENT_MUTATION = gql`
  mutation CreateReservation(
    $arrival_date: date!
    $departure_date: date!
    $data: [reservation_room_insert_input!]!
    $userId: uuid!
    $note: String
  ) {
    insert_reservation(
      objects: {
        arrival_date: $arrival_date
        departure_date: $departure_date
        reservation_rooms: { data: $data }
        client_id: $userId
        note: $note
      }
    ) {
      affected_rows
    }
  }
`

export default IndexPage
