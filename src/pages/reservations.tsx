import React from "react"
import { Reservations } from "./../components/Reservations"
import CreateReservationForm from "./../components/CreateReservationForm"
import { TextField, Dialog, Paper, Box, Button } from "@material-ui/core"
import { useCookie } from "@use-hook/use-cookie"

export const Authenticator = () => {
  const [isAuth, setIsAuth] = useCookie("isAuth", false)
  const [pass, setPass] = React.useState("")
  return (
    <Dialog open={!isAuth}>
      <Box display="flex" flexDirection={"column"} p={2}>
        <h2>Влез</h2>
        <TextField
          variant="outlined"
          label={"Парола"}
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={() => {
            if (pass === "kokorok1") {
              setIsAuth(true)
            }
          }}
        >
          Влзез
        </Button>
      </Box>
    </Dialog>
  )
}

export default () => {
  return (
    <>
      <div>
        <h1>Резервации: </h1>
        <CreateReservationForm />
        <Reservations />
      </div>
    </>
  )
}
