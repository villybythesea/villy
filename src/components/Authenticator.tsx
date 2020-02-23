import React from "react"
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
            if (pass === process.env.GATSBY_ADMIN_PASS) {
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
