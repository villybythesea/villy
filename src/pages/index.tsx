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
const RESERVATION_DETAILS = gql`
  query ReservationDetails {
    reservation {
      created_at
    }
  }
`

const IndexPage = () => {
  const { data: userData } = useSubscription<{ client: Array<any> }>(
    USER_DETAILS
  )
  const { data: reservationData } = useSubscription<{
    reservation: Array<any>
  }>(RESERVATION_DETAILS)
  return (
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      {userData?.client.map(({ first_name }) => first_name)}
      {reservationData?.reservation.map(({ created_at }) => created_at)}
    </div>
  )
}

export default IndexPage
