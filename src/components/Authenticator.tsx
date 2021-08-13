import React from "react"
import { TextField, Dialog, Box, Button } from "@material-ui/core"
import createPersistedState from "use-persisted-state"

const useIsAuth = createPersistedState("isAuth")

export const Authenticator = () => {
  const [isAuth, setIsAuth] = useIsAuth(false)
  const [pass, setPass] = React.useState("")
  const { isServer } = useSSR()
  if (isServer) return null
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
          Влез
        </Button>
      </Box>
    </Dialog>
  )
}
function useSSR(): { isServer: any } {
  throw new Error("Function not implemented.")
}
