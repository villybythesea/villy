import * as React from "react"
import { useSubscription } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

const USER_DETAILS = gql`
  subscription ClientDetails {
    client {
      first_name
    }
  }
`

const IndexPage = () => {
  const { loading, data, error } = useSubscription<{ client: Array<any> }>(
    USER_DETAILS
  )
  return (
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      {data?.client.map(({ first_name }) => first_name)}
    </div>
  )
}

export default IndexPage
