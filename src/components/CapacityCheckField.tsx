import React from "react"
import { gql } from "apollo-boost"
import { useFormikContext } from "formik"
import { useQuery } from "@apollo/react-hooks"
import { SelectField } from "./SelectField"
import { MenuItem, FormHelperText } from "@material-ui/core"

const CAPACITY_CHECK = gql`
  query($arrival_date: String!, $departure_date: String!) {
    capacity_check(
      arrival_date: $arrival_date
      departure_date: $departure_date
    ) @client
  }
`

export const CapacitySelectField = () => {
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
