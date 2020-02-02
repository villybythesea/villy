import React from "react"
import { Reservations } from "./../components/Reservations"
import CreateReservationForm from "./../components/CreateReservationForm"

export default () => {
  return (
    <>
      <h1>Резерваций: </h1>
      <CreateReservationForm />
      <Reservations />
    </>
  )
}
