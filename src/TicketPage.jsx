import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

export default function TicketPage() {
  const ticketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const storedData = localStorage.getItem('ticketData');
  const formData = location.state || (storedData ? JSON.parse(storedData) : {});

  const generateTicketImage = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'my_ticket.png';
        link.click();
      } catch (error) {
        console.error('Error generating ticket image:', error);
      }
    }
  };

  const handleBookAnother = () => {
    navigate('/'); // Adjust this path to match your booking form route
  };

  if (!formData || Object.keys(formData).length === 0) {
    return <p className="text-white text-center">No ticket data available.</p>;
  }

  return (
    <div className="bg-teal-950 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Your Ticket is Booked!</h1>
        <p className="text-gray-300">Check your email for a copy or you can download it below.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div ref={ticketRef} className="bg-teal-900 rounded-2xl p-6 shadow-lg w-full max-w-md">
          <h2 className="text-white text-lg font-bold text-center mb-4">Techember Fest '25</h2>
          <p className="text-gray-300 text-center text-sm mb-6">
            📍 04 Runners Road, Ikoyi, Lagos<br />📅 March 13, 2025 | 7:00 PM
          </p>
          <div className="flex items-center justify-center">
              <div className="w-40 h-40 rounded-md overflow-hidden border-4 border-teal-800 mb-4">
                <img
                  src={formData.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              </div>

          <div className="grid grid-cols-2 gap-4 py-7 border border-gray-500 bg-teal-800 p-4 rounded-lg text-white text-sm">
              <p className="border-b border-gray-500 pb-2">
                <span className="block text-gray-400 text-xs">Enter your name</span>
                <span className="font-semibold">{formData.fullName || 'N/A'}</span>
              </p>
              <p className="border-b border-gray-500 pb-2 ">
                <span className="block text-gray-400 text-xs">Enter your email *</span>
                <span className="font-semibold">{formData.email || 'N/A'}</span>
              </p>
              <p className="border-b border-gray-500 pb-2">
                <span className="block text-gray-400 text-xs">Ticket Type:</span>
                <span className="font-semibold">{formData.ticketType || 'VIP'}</span>
              </p>
              <p className="border-b border-gray-500 pb-2">
                <span className="block text-gray-400 text-xs">Ticket for:</span>
                <span className="font-semibold">1</span>
              </p>
              <p className="col-span-2">
                <span className="block text-gray-400 text-xs">Special request?</span>
                <span className="font-semibold">
                  {formData.about || 'Nil ? Or the users sad story they write in here gets this whole space, Max of three rows'}
                </span>
              </p>
   </div>

          <div className="mt-4">
            <div className="w-full h-12 bg-white rounded flex items-center justify-center">
              <div className="w-4/5 h-8">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="inline-block w-1 h-full mx-px bg-black"
                    style={{ opacity: Math.random() * 0.5 + 0.5 }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between space-x-4">
            <button
              className="border-2 border-teal-600 text-white px-4 py-2 rounded-md"
              onClick={handleBookAnother}
            >
              Book Another Ticket
            </button>
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-500 transition-colors"
              onClick={generateTicketImage}
            >
              Download Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
