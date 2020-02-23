import * as React from "react"
import {
  Paper,
  Box,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core"
import { TextField } from "formik-material-ui"
import { Formik, Form } from "formik"
import gql from "graphql-tag"
import { useMutation } from "@apollo/react-hooks"
import * as Yup from "yup"
import moment from "moment"
import { CapacitySelectField } from "./CapacityCheckField"
import { SelectUserField } from "./SelectUserField"
import { DateRangeFields } from "./DateRangeFields"

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
  const validationSchema = React.useMemo(
    () =>
      Yup.object().shape({
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
      }),
    [value]
  )

  const initialValues = React.useMemo(
    () => ({
      arrival_date: moment(),
      departure_date: moment().add(3, "days"),
      first_name: "",
      last_name: "",
      email: null,
      phone_number: null,
      roomIds: [],
      note: "",
      userId: null,
    }),
    []
  )

  const handleOnSubmit = (values, { setSubmitting, resetForm }) => {
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
  }

  return (
    <>
      <Paper>
        <Formik
          initialValues={initialValues}
          onSubmit={handleOnSubmit}
          validationSchema={validationSchema}
        >
          <Form noValidate autoComplete="off">
            <Box p={2} display="flex" flexDirection="column">
              <DateRangeFields
                startDateProps={{ label: ARRIVAL_DATE_LABEL }}
                endDateProps={{ label: DEPARTURE_DATE_LABEL }}
              />
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

export default IndexPage
