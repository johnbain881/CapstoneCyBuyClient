import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';


const CyBuyNavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
      localStorage.clear()
  }

  return (
    <div>
      <Navbar color="light" light expand="sm">
        <NavbarBrand href="/"><span id="Cy">Cy</span><span id="Buy">Buy</span></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">Services</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/requests">Requests</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={logout} href="/">Logout</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default CyBuyNavBar