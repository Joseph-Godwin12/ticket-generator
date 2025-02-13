import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./Header"
import BookTicket from './BookTicket';
import AttendeeDetails from './AttendeeDetails';
import TicketPage from './TicketPage';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<BookTicket />} />
        <Route path="/attendee" element={<AttendeeDetails />} />
        <Route path="/ticket" element={<TicketPage />} />
      </Routes>
    </Router>
  );
}


