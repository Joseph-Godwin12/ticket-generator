// import ticket from "../img/ticket-01_.png";
import arrow from "../img/right-arrow_.png";
import { FaTicketAlt } from 'react-icons/fa'


export default function Header() {
    return (
      <div className="flex flex-wrap justify-center text-gray-300 bg-teal-950">
        <div className="flex flex-wrap items-center justify-between w-full max-w-5xl border p-3 m-3 rounded-lg">
          <div className="flex flex-row items-center gap-4">
            <p className="text-xl font-bold"><img src="https://img.icons8.com/fluency-systems-regular/50/FFFFFF/ticket.png" className="w-5 h-5"/>
            </p>
            <p className="text-lg font-bold text-white text-center">
                <span className="text-outline">ticz</span>
              </p>
          </div>
  
          <div className="hidden md:flex flex-row gap-4">
            <span>Events</span>
            <span>My tickets</span>
            <span>About project</span>
          </div>
  
          <div className="bg-white text-black px-4 py-1 rounded-lg">
            <h2 className="flex gap-4 text-sm font-medium">My Tickets <img src={arrow} className="w-5 h-5" /></h2>
          </div>
        </div>
      </div>
    );
  }
