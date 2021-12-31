import React, { ReactNode } from "react"

import Search from "./search"
import Footer from "./footer"

type Props = {
  children: ReactNode
}

const Layout: React.VFC<Props> = ({children}) => (
  <>
    <Search />

    {children}

    <Footer />
  </>
)

export default Layout
