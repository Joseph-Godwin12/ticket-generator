import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookTicket() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [numTickets, setNumTickets] = useState(1);
  const navigate = useNavigate();

  const tickets = [
    { id: 'free', type: 'REGULAR ACCESS', price: 'Free', limit: 12 },
    { id: 'vip', type: 'VIP ACCESS', price: '$150', limit: 10 },
    { id: 'vvip', type: 'VVIP ACCESS', price: '$300', limit: 5 },
  ];

  const handleNext = () => {
    if (!selectedTicketId) {
      alert('Please select a ticket type.');
      return;
    }
    if (numTickets <= 0) {
      alert('Please select at least one ticket.');
      return;
    }

    const ticketTypes = {
      free: 'REGULAR ACCESS',
      vip: 'VIP ACCESS',
      vvip: 'VVIP ACCESS',
    };

    const ticketData = {
      ticketType: ticketTypes[selectedTicketId] || 'N/A',
      numTickets,
    };

    console.log('Navigating with data:', ticketData); // Debugging log
    navigate('/attendee', { state: ticketData });
  };

  return (
    <div className="min-h-screen bg-teal-950 p-6">
      <div className="max-w-md mx-auto bg-teal-900/30 rounded-xl border border-teal-800 shadow-2xl">
        <div className="p-6">
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl text-white font-medium">Ticket Selection</h1>
            <span className="text-teal-400 text-sm">Step 1/3</span>
          </div>
          <div className="w-full bg-teal-900 h-1 rounded-full overflow-hidden mb-8">
            <div className="bg-teal-400 h-full" style={{ width: '33%' }}></div>
        </div>


          <div className="bg-teal-900/50 rounded-xl p-6 mb-8">
            <h2 className="text-2xl text-white font-bold mb-2">Techember Fest '25</h2>
            <p className="text-teal-300 text-sm mb-4">
              Join us for an unforgettable experience! Secure your spot now.
            </p>
            <div className="flex flex-wrap text-sm text-teal-400 space-x-4">
              <span>📍 04 Runners Road, Ikoyi, Lagos</span>
              <span>|</span>
              <span>March 15, 2025 / 7:00 PM</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-teal-400 text-sm mb-4">Select Ticket Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedTicketId === ticket.id
                      ? 'border-teal-400 bg-teal-800/50'
                      : 'border-teal-800 bg-teal-900/30 hover:border-teal-700'
                  }`}
                  aria-label={`Select ${ticket.type}`}
                >
                  <div className="text-teal-400 text-xs mb-1">{ticket.type}</div>
                  <div className="text-white font-bold mb-1">{ticket.price}</div>
                  <div className="text-teal-500 text-xs">Limit: {ticket.limit}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-teal-400 text-sm mb-2">Number of Tickets</label>
            <div className="relative">
              <select
                value={numTickets}
                onChange={(e) => setNumTickets(Number(e.target.value))}
                className="w-full bg-teal-900/30 border border-teal-800 rounded-lg p-3 text-white appearance-none pr-10"
                aria-label="Select number of tickets"
              >
                {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse space-y-4 gap-col-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              className="flex-1 px-6 py-3 rounded-lg border border-teal-800 text-white hover:bg-teal-900/50 transition-colors"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-6 py-3 rounded-lg bg-teal-500 text-white hover:bg-teal-400 transition-colors"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
