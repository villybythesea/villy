import * as React from "react"
import { navigate } from "gatsby"
import { Paper, Box, Button } from "@material-ui/core"
import { TextField } from "formik-material-ui"
import { Formik, Form } from "formik"

import MomentUtils from "@date-io/moment"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import { DatePicker } from "formik-material-ui-pickers"
import * as Yup from "yup"
import moment from "moment"
import "moment/locale/bg" // without this line it didn't work
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

const IndexPage = () => {
  return (
    <Paper>
      <Formik
        initialValues={{
          arrivalDate: null,
          departureDate: null,
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false)
            alert(JSON.stringify(values, null, 2))
          }, 500)
        }}
        validationSchema={Yup.object().shape({
          arrivalDate: Yup.date().required(REQUIRED_FIELD),
          departureDate: Yup.date().required(REQUIRED_FIELD),
          first_name: Yup.string().required(REQUIRED_FIELD),
          last_name: Yup.string().required(REQUIRED_FIELD),
          email: Yup.string()
            .email(INVALID_EMAIL)
            .required(REQUIRED_FIELD),
          phone_number: Yup.number().required(REQUIRED_FIELD),
        })}
      >
        <Form noValidate autoComplete="off">
          <Box p={2} display="flex" flexDirection="column">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                name="arrivalDate"
                label={ARRIVAL_DATE_LABEL}
                inputVariant="outlined"
                style={{ marginTop: 15 }}
                required
              />
              <DatePicker
                name="departureDate"
                label={DEPARTURE_DATE_LABEL}
                inputVariant="outlined"
                required
                style={{ marginTop: 15 }}
              />
            </MuiPickersUtilsProvider>
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
              name="email"
              type="email"
              label={EMAIL_LABEL}
              variant="outlined"
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 15 }}
            >
              {REGISTRATION_SUBMIT_LABEL}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Paper>
  )
}

export default IndexPage
