import React from "react"
import { Reservations } from "./../components/Reservations"
import CreateReservationForm from "./../components/CreateReservationForm"

export default () => {
  return (
    <div>
      <h1>Резервации: </h1>
      <CreateReservationForm />
      <Reservations />
    </div>
  )
}
