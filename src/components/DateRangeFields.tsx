import * as React from "react"
import { useFormikContext } from "formik"
import MomentUtils from "@date-io/moment"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import { DatePicker } from "formik-material-ui-pickers"
import moment from "moment"

export const DateRangeFields = ({ startDateProps, endDateProps }) => {
  const {
    values: { arrival_date },
  } = useFormikContext()
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        autoOk
        name="arrival_date"
        inputVariant="outlined"
        style={{ marginTop: 15 }}
        required
        {...startDateProps}
      />
      <DatePicker
        autoOk
        name="departure_date"
        inputVariant="outlined"
        required
        style={{ marginTop: 15 }}
        minDate={moment(arrival_date).add("days", 1)}
        {...endDateProps}
      />
    </MuiPickersUtilsProvider>
  )
}
