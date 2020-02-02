import React from "react"
import { Link } from "gatsby"
import { AppBar, Toolbar, Box, Menu, MenuItem } from "@material-ui/core"

const pages = [
  { to: "/reservations/", children: "Резерваций" },
  { to: "/schedule/", children: "График" },
]

export const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {pages.map(page => (
          <MenuItem key={page.to} style={{ marginLeft: 10 }}>
            <Link {...page} style={{ color: "white" }} />
          </MenuItem>
        ))}
      </Toolbar>
    </AppBar>
  )
}
