import * as React from "react"
import { client } from "./../client"
import { ApolloProvider } from "@apollo/react-hooks"
import { CssBaseline, Box } from "@material-ui/core"
import { Navigation } from "./../components/Navigation"
import { Authenticator } from "./../components/Authenticator"
import moment from "moment"
import "moment/locale/bg" // without this line it didn't work

moment.locale("bg")

export const wrapRootElement = ({ element }: any) => (
  <ApolloProvider client={client}>
    <CssBaseline />
    <Navigation />
    <Box style={{ margin: 16 }}>{element}</Box>
    <Authenticator />
  </ApolloProvider>
)
