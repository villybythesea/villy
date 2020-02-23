import * as React from "react"
import { InputLabel, FormControl } from "@material-ui/core"
import { Select } from "formik-material-ui"

export const SelectField = props => {
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
