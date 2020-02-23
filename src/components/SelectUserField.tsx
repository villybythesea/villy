import React from "react"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { SelectField } from "./SelectField"
import { MenuItem } from "@material-ui/core"

export const SelectUserField = () => {
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
