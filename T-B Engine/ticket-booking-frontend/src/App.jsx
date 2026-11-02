
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://ticket-booking-engine.onrender.com/api/tickets';
const AUTH_URL = 'https://ticket-booking-engine.onrender.com/api/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Check persisted session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('ticketUser');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setCurrentUser(userObj);
      setEmail(userObj.email);
    }
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      console.log("backend se aaya data:",response.data);
      if (response.data && response.data.length > 0) {
        setSeats(response.data);
      } else {
        setDefaultSeats();
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      
    }
  };

  const setDefaultSeats = () => {
    setSeats([
      { id: 1, seatNumber: 'A1', status: 'AVAILABLE', price: 500 },
      { id: 2, seatNumber: 'A2', status: 'AVAILABLE', price: 500 },
      { id: 3, seatNumber: 'A3', status: 'AVAILABLE', price: 650 },
      { id: 4, seatNumber: 'B1', status: 'AVAILABLE', price: 500 },
      { id: 5, seatNumber: 'B2', status: 'AVAILABLE', price: 500 },
      { id: 6, seatNumber: 'B3', status: 'AVAILABLE', price: 650 },
      { id: 7, seatNumber: 'C1', status: 'AVAILABLE', price: 800 },
      { id: 8, seatNumber: 'C2', status: 'AVAILABLE', price: 800 },
      { id: 9, seatNumber: 'C3', status: 'AVAILABLE', price: 800 },
    ]);
  };

  useEffect(() => {
    if (currentUser) {
      fetchSeats();
    }
  }, [currentUser]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const endpoint = authMode === 'signup' ? `${AUTH_URL}/signup` : `${AUTH_URL}/signin`;
      const response = await axios.post(endpoint, authForm);
      const user = response.data;
      
      setCurrentUser(user);
      setEmail(user.email);
      localStorage.setItem('ticketUser', JSON.stringify(user));
    } catch (error) {
      setAuthError(error.response?.data?.message || error.response?.data || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ticketUser');
    setSelectedSeat(null);
  };

  const handleLockSeat = async (seat) => {
    if (seat.status !== 'AVAILABLE') return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/lock?seatId=${seat.id}`);
      setSelectedSeat(seat);
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'LOCKED' } : s));
      setMessage(typeof response.data === 'string' ? response.data : 'Seat locked successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to lock seat';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (status) => {
    if (!selectedSeat || !email) {
      alert('Please enter your email!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment?seatId=${selectedSeat.id}&customerEmail=${email}&paymentStatus=${status}`
      );
      
      setMessage(typeof response.data === 'string' ? response.data : 'Transaction completed');
      if (status === 'SUCCESS') setSelectedSeat(null);
      fetchSeats();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // 1. If user is not logged in, render Sign In / Sign Up View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-indigo-400">🎟️ Ticket Booking Engine</h1>
            <p className="text-xs text-slate-400 mt-1">
              {authMode === 'signup' ? 'Create a new account' : 'Sign in to book your tickets'}
            </p>
          </div>

          {authError && (
            <div className="bg-rose-950/80 border border-rose-500 text-rose-300 px-4 py-2.5 rounded-xl mb-4 text-xs text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={authForm.fullName}
                  onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold text-sm transition mt-2 shadow-lg shadow-indigo-950/50"
            >
              {loading ? 'Please wait...' : authMode === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-slate-400">
            {authMode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button onClick={() => setAuthMode('signin')} className="text-indigo-400 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setAuthMode('signup')} className="text-indigo-400 font-bold hover:underline">
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Booking Dashboard View (Logged In)
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-6 font-sans">
      
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-sm font-bold text-indigo-400">{currentUser.fullName || currentUser.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 transition"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-extrabold text-indigo-400 mb-2">🎟️ Ticket Booking Engine</h1>
      <p className="text-slate-400 text-sm mb-8">Optimistic Locking & Dynamic Seat Matrix</p>

      {/* Screen Display */}
      <div className="w-full max-w-md bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-center py-1.5 rounded-t-xl mb-8 shadow-lg shadow-indigo-500/30 text-xs font-bold tracking-widest uppercase">
        SCREEN THIS WAY
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-md">
        {seats.map((seat) => {
          let seatStyle = "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-900/40";
          if (seat.status === 'LOCKED') seatStyle = "bg-amber-500 text-slate-900 cursor-not-allowed animate-pulse shadow-amber-900/40";
          if (seat.status === 'BOOKED') seatStyle = "bg-rose-600 text-white cursor-not-allowed opacity-40 shadow-none";

          return (
            <button
              key={seat.id}
              disabled={seat.status !== 'AVAILABLE' || loading}
              onClick={() => handleLockSeat(seat)}
              className={`${seatStyle} h-20 rounded-xl flex flex-col items-center justify-center font-bold transition-all shadow-md transform hover:scale-105 p-2`}
            >
              <span className="text-lg">{seat.seatNumber}</span>
              <span className="text-xs font-normal">₹{seat.price}</span>
              <span className="text-[10px] uppercase font-bold mt-1 tracking-wide">{seat.status}</span>
            </button>
          );
        })}
      </div>

      {/* Status Legends */}
      <div className="flex gap-6 mb-8 text-sm">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-600 rounded"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-500 rounded"></div> Locked</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rose-600 rounded"></div> Booked</div>
      </div>

      {/* Alert Banner */}
      {message && (
        <div className="bg-slate-900 border border-indigo-500/50 text-indigo-300 px-4 py-3 rounded-xl mb-6 max-w-md text-center text-sm shadow-lg">
          {message}
        </div>
      )}

      {/* Payment Box */}
      {selectedSeat && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Complete Payment for Seat {selectedSeat.seatNumber}</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white mb-4 text-sm focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-4">
            <button
              onClick={() => handlePayment('SUCCESS')}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl font-bold text-sm transition"
            >
              Pay Success
            </button>
            <button
              onClick={() => handlePayment('FAILED')}
              disabled={loading}
              className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-sm transition"
            >
              Simulate Fail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/*const API_BASE_URL = 'http://localhost:8080/api/tickets';
//const AUTH_BASE_URL = 'http://localhost:8080/api/auth';

export default function App() {
  
  //Booking State
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  



useEffect(() => {

    setSeats([
      { id: 1, seatNumber: 'A1', status: 'AVAILABLE', price: 500 },
      { id: 2, seatNumber: 'A2', status: 'AVAILABLE', price: 500 },
      { id: 3, seatNumber: 'A3', status: 'AVAILABLE', price: 650 },
      { id: 4, seatNumber: 'B1', status: 'BOOKED', price: 500 },
      { id: 5, seatNumber: 'B2', status: 'AVAILABLE', price: 500 },
      { id: 6, seatNumber: 'B3', status: 'AVAILABLE', price: 650 },
      { id: 7, seatNumber: 'C1', status: 'AVAILABLE', price: 800 },
      { id: 8, seatNumber: 'C2', status: 'AVAILABLE', price: 800 },
      { id: 9, seatNumber: 'C3', status: 'AVAILABLE', price: 800 },
    ]);
  }, []);

  // Step 1: Lock Seat API Call
  const handleLockSeat = async (seat) => {
    if (seat.status !== 'AVAILABLE') return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/lock?seatId=${seat.id}`);
      setSelectedSeat(seat);
      
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'LOCKED' } : s));
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to lock seat');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Payment API Call
  const handlePayment = async (status) => {
    if (!selectedSeat || !email) {
      alert('Please enter your email!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment?seatId=${selectedSeat.id}&customerEmail=${email}&paymentStatus=${status}`
      );
      
      const newStatus = status === 'SUCCESS' ? 'BOOKED' : 'AVAILABLE';
      setSeats(seats.map(s => s.id === selectedSeat.id ? { ...s, status: newStatus } : s));
      setMessage(response.data);
      if (status === 'SUCCESS') setSelectedSeat(null);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick Stats
  const availableCount = seats.filter(s => s.status === 'AVAILABLE').length;
  const bookedCount = seats.filter(s => s.status === 'BOOKED').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8 font-sans selection:bg-indigo-500 selection:text-white">*/
      
      {/* Header */}
      /*<header className="text-center max-w-xl mb-8">
        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 inline-block">
          Enterprise Demo
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
          Ticket Booking Engine
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          High-Concurrency Seat Reservation System built with Spring Boot & Optimistic Locking.
        </p>
      </header>*/

      {/* Main Container Card */}
      /*<main className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 flex flex-col items-center">*/
        
        {/* Stats Row */}
        /*<div className="flex justify-between w-full max-w-md bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-8 text-xs text-slate-400">
          <div className="text-center flex-1 border-r border-slate-800">
            <p className="text-lg font-bold text-emerald-400">{availableCount}</p>
            <p>Available</p>
          </div>
          <div className="text-center flex-1 border-r border-slate-800">
            <p className="text-lg font-bold text-amber-400">{seats.filter(s => s.status === 'LOCKED').length}</p>
            <p>Locked</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-rose-400">{bookedCount}</p>
            <p>Booked</p>
          </div>
        </div>*/

        {/* Theater Screen Arc */}
        /*<div className="w-full max-w-md flex flex-col items-center mb-10">
          <div className="w-full h-3 bg-gradient-to-r from-indigo-500/10 via-indigo-500 to-indigo-500/10 rounded-t-full shadow-[0_-10px_25px_rgba(99,102,241,0.5)]"></div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-slate-500 mt-2 font-medium">
            SCREEN THIS WAY
          </span>
        </div>*/

        {/* Seat Grid */}
        /*<div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 w-full max-w-md">
          {seats.map((seat) => {
            let statusStyles = 'bg-slate-800/80 hover:bg-emerald-600/90 text-emerald-300 hover:text-white border-slate-700/60 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/40 hover:-translate-y-1'; 
            
            if (seat.status === 'LOCKED') {
              statusStyles = 'bg-amber-500/20 text-amber-300 border-amber-500/40 cursor-not-allowed animate-pulse shadow-md shadow-amber-950/50';
            } else if (seat.status === 'BOOKED') {
              statusStyles = 'bg-rose-950/30 text-rose-500/60 border-rose-900/20 cursor-not-allowed opacity-50';
            }

            return (
              <button
                key={seat.id}
                disabled={seat.status !== 'AVAILABLE' || loading}
                onClick={() => handleLockSeat(seat)}
                className={`relative group h-20 rounded-2xl border flex flex-col items-center justify-center transition-all duration-200 font-semibold ${statusStyles}`}
              >
                <span className="text-base font-bold tracking-wide">{seat.seatNumber}</span>
                <span className="text-xs opacity-75 font-normal">₹{seat.price}</span>
                <span className="text-[9px] uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full bg-slate-950/40">
                  {seat.status}
                </span>
              </button>
            );
          })}
        </div>*/

        {/* Status Legends */}
        /*<div className="flex gap-6 mb-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> Available
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span> Locked
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 opacity-60"></span> Booked
          </div>
        </div>*/

        {/* Notification Toast */}
        /*{message && (
          <div className="w-full max-w-md bg-indigo-950/80 border border-indigo-500/30 text-indigo-200 px-4 py-3 rounded-xl mb-6 text-xs text-center backdrop-blur-md shadow-lg animate-fade-in">
            {message}
          </div>
        )}*/

        {/* Checkout Modal / Box */}
       /* {selectedSeat && (
          <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 p-6 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Checkout</h3>
                <p className="text-xs text-slate-400">Seat <span className="text-indigo-400 font-bold">{selectedSeat.seatNumber}</span> Selected</p>
              </div>
              <span className="text-lg font-bold text-emerald-400">₹{selectedSeat.price}</span>
            </div>

            <div className="mb-4">
              <label className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">Customer Email</label>
              <input
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/70 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handlePayment('SUCCESS')}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-medium text-xs tracking-wide transition shadow-lg shadow-indigo-950/50 hover:shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
              >
                Pay & Confirm
              </button>
              <button
                onClick={() => handlePayment('FAILED')}
                disabled={loading}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium text-xs tracking-wide transition active:scale-95 disabled:opacity-50"
              >
                Simulate Fail
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}*/



//-----------------------------------------------------------------------------------------------------





/*import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

export default function App() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSeats([
      { id: 1, seatNumber: 'A1', status: 'AVAILABLE', price: 500 },
      { id: 2, seatNumber: 'A2', status: 'AVAILABLE', price: 500 },
      { id: 3, seatNumber: 'A3', status: 'AVAILABLE', price: 650 },
      { id: 4, seatNumber: 'B1', status: 'BOOKED', price: 500 },
      { id: 5, seatNumber: 'B2', status: 'AVAILABLE', price: 500 },
      { id: 6, seatNumber: 'B3', status: 'AVAILABLE', price: 650 },
    ]);
  }, []);

  const handleLockSeat = async (seat) => {
    if (seat.status !== 'AVAILABLE') return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/lock?seatId=${seat.id}`);
      setSelectedSeat(seat);
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'LOCKED' } : s));
      setMessage(response.data);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || error.response?.data?.error || 'Failed to lock seat (Backend offline or ID mismatch)');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (status) => {
    if (!selectedSeat || !email) {
      alert('Please enter your email!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment?seatId=${selectedSeat.id}&customerEmail=${email}&paymentStatus=${status}`
      );
      
      const newStatus = status === 'SUCCESS' ? 'BOOKED' : 'AVAILABLE';
      setSeats(seats.map(s => s.id === selectedSeat.id ? { ...s, status: newStatus } : s));
      setMessage(response.data);
      if (status === 'SUCCESS') setSelectedSeat(null);
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-6">*/
      
      {/* Title */}
      /*<h1 className="text-3xl font-extrabold text-indigo-400 mb-2">🎟️ Ticket Booking Engine</h1>
      <p className="text-slate-400 text-sm mb-8">Optimistic Locking & State Lifecycle</p>*/

      {/* Screen Arc */}
      /*<div className="w-full max-w-md bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-center py-1.5 rounded-t-xl mb-8 shadow-lg shadow-indigo-500/30 text-xs font-bold tracking-widest uppercase">
        SCREEN THIS WAY
      </div>*/

      {/* Seat Grid with Proper Gap */}
      /*<div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-md">
        {seats.map((seat) => {
          let seatStyle = "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-900/40";
          if (seat.status === 'LOCKED') seatStyle = "bg-amber-500 text-slate-900 cursor-not-allowed animate-pulse shadow-amber-900/40";
          if (seat.status === 'BOOKED') seatStyle = "bg-rose-600 text-white cursor-not-allowed opacity-40 shadow-none";

          return (
            <button
              key={seat.id}
              disabled={seat.status !== 'AVAILABLE' || loading}
              onClick={() => handleLockSeat(seat)}
              className={`${seatStyle} h-20 rounded-xl flex flex-col items-center justify-center font-bold transition-all shadow-md transform hover:scale-105 p-2`}
            >
              <span className="text-lg">{seat.seatNumber}</span>
              <span className="text-xs font-normal">₹{seat.price}</span>
              <span className="text-[10px] uppercase font-bold mt-1 tracking-wide">{seat.status}</span>
            </button>
          );
        })}
      </div>*/

      {/* Status Legends */}
      /*<div className="flex gap-6 mb-8 text-sm">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-600 rounded"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-500 rounded"></div> Locked</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rose-600 rounded"></div> Booked</div>
      </div>*/

      {/* Alert Message */}
      /*{message && (
        <div className="bg-slate-900 border border-indigo-500/50 text-indigo-300 px-4 py-3 rounded-xl mb-6 max-w-md text-center text-sm shadow-lg">
          {message}
        </div>
      )}*/

      {/* Payment Box */}
      /*{selectedSeat && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Complete Payment for Seat {selectedSeat.seatNumber}</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white mb-4 text-sm focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-4">
            <button
              onClick={() => handlePayment('SUCCESS')}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl font-bold text-sm transition"
            >
              Pay Success
            </button>
            <button
              onClick={() => handlePayment('FAILED')}
              disabled={loading}
              className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-sm transition"
            >
              Simulate Fail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}*/
