import * as React from "react"
import { client } from "./../client"
import { ApolloProvider } from "@apollo/react-hooks"
import { CssBaseline, Box } from "@material-ui/core"
import { Navigation } from "./../components/Navigation"

export const wrapRootElement = ({ element }: any) => (
  <ApolloProvider client={client}>
    <CssBaseline />
    <Navigation />
    <Box style={{ margin: 16 }}>{element}</Box>
  </ApolloProvider>
)
