import React, { useState } from 'react';
import { CafeTableOption, SeatReservation, StoreLocation } from '../types/cafe';

interface SeatReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStore: StoreLocation;
  tables: CafeTableOption[];
  reservations: SeatReservation[];
  onConfirmReservation: (reservation: SeatReservation) => void;
  onCancelReservation: (reservationId: string) => void;
  onCheckInReservation: (reservationId: string) => void;
}

export const SeatReservationModal: React.FC<SeatReservationModalProps> = ({
  isOpen,
  onClose,
  currentStore,
  tables,
  reservations,
  onConfirmReservation,
  onCancelReservation,
  onCheckInReservation,
}) => {
  const [activeTab, setActiveTab] = useState<'reserve' | 'my-reservations'>('reserve');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedPartySize, setSelectedPartySize] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [selectedDuration, setSelectedDuration] = useState<string>('1.5 Hours');
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || 'table-booth-07');
  const [guestName, setGuestName] = useState<string>('Alex');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [confirmedPass, setConfirmedPass] = useState<SeatReservation | null>(null);

  if (!isOpen) return null;

  const timeSlots = [
    { time: '9:00 AM', status: 'available' },
    { time: '9:30 AM', status: 'available' },
    { time: '10:00 AM', status: 'busy' },
    { time: '10:30 AM', status: 'available' },
    { time: '11:00 AM', status: 'busy' },
    { time: '11:30 AM', status: 'available' },
    { time: '12:00 PM', status: 'filling' },
    { time: '12:30 PM', status: 'filling' },
    { time: '1:00 PM', status: 'available' },
    { time: '1:30 PM', status: 'available' },
    { time: '2:00 PM', status: 'available' },
    { time: '3:00 PM', status: 'available' },
  ];

  const zones = [
    { id: 'all', label: 'All Spaces' },
    { id: 'Window Counter', label: 'Window Counter' },
    { id: 'Corner Booth Zone', label: 'Corner Booths' },
    { id: 'Espresso Bar Counter', label: 'Espresso Bar' },
    { id: 'Lounge Hearth', label: 'Lounge Hearth' },
    { id: 'Greenhouse Solarium', label: 'Solarium' },
    { id: 'Outdoor Courtyard', label: 'Courtyard' },
  ];

  const filteredTables = tables.filter((t) => {
    const matchesZone = selectedZone === 'all' || t.zone === selectedZone;
    const matchesCapacity = t.capacity >= selectedPartySize;
    return matchesZone && matchesCapacity;
  });

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  const handleBookSeat = (e: React.FormEvent) => {
    e.preventDefault();
    const codeNumber = Math.floor(100 + Math.random() * 900);
    const newReservation: SeatReservation = {
      id: `res-${Date.now()}`,
      tableId: selectedTable.id,
      tableName: selectedTable.name,
      zone: selectedTable.zone,
      partySize: selectedPartySize,
      timeSlot: selectedTime,
      date: selectedDate,
      duration: selectedDuration,
      reservationCode: `CB-SEAT-${codeNumber}`,
      status: 'active',
      storeId: currentStore.id,
      storeName: currentStore.name,
      guestName: guestName || 'Alex',
      specialRequests: specialRequests || 'Standard reservation',
      checkedIn: false,
      createdAt: 'Just now',
    };

    onConfirmReservation(newReservation);
    setConfirmedPass(newReservation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-[#1a1918] border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reserve-seat-title"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#211f1e]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#75daa8]/15 border border-[#75daa8]/30 flex items-center justify-center text-[#75daa8]">
              <span className="material-symbols-outlined text-xl">chair</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="reserve-seat-title" className="font-['Syne',sans-serif] text-lg font-bold text-[#e6e1df]">
                  Reserve Café Seat
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/20 text-[#75daa8] font-['Space_Grotesk',sans-serif] text-[10px] font-bold">
                  Live Seats
                </span>
              </div>
              <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                {currentStore.name} • Guaranteed Table Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-[#bdcac0] hover:text-[#e6e1df] flex items-center justify-center transition-colors"
            aria-label="Close reservation modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pt-3 pb-2 bg-[#211f1e]/40 border-b border-white/5 flex gap-2">
          <button
            onClick={() => {
              setActiveTab('reserve');
              setConfirmedPass(null);
            }}
            className={`flex-1 py-2 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reserve'
                ? 'bg-[#75daa8] text-[#003823] shadow-md'
                : 'text-[#bdcac0] hover:text-[#e6e1df] bg-[#2b2a28]/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Reserve a Spot</span>
          </button>
          <button
            onClick={() => setActiveTab('my-reservations')}
            className={`flex-1 py-2 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'my-reservations'
                ? 'bg-[#75daa8] text-[#003823] shadow-md'
                : 'text-[#bdcac0] hover:text-[#e6e1df] bg-[#2b2a28]/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">event_seat</span>
            <span>My Bookings ({reservations.filter((r) => r.status === 'active').length})</span>
            {reservations.filter((r) => r.status === 'active').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#ffb780] animate-ping ml-0.5" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* CONFIRMATION PASS VIEW */}
          {confirmedPass && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1d3d2e] to-[#211f1e] border border-[#75daa8]/40 shadow-xl text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#75daa8] text-[#003823] flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-2xl font-bold">check</span>
                </div>
                <div>
                  <span className="font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-wider text-[#75daa8] font-bold">
                    Reservation Confirmed
                  </span>
                  <h3 className="font-['Syne',sans-serif] text-xl font-bold text-[#e6e1df] mt-0.5">
                    {confirmedPass.tableName}
                  </h3>
                  <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                    {confirmedPass.storeName} • {confirmedPass.zone}
                  </p>
                </div>

                {/* Digital Boarding Pass Ticket */}
                <div className="p-3.5 rounded-xl bg-[#0f0e0d]/90 border border-white/10 text-left space-y-2.5">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div>
                      <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase">
                        Confirmation Code
                      </p>
                      <p className="font-['Syne',sans-serif] text-base font-extrabold text-[#75daa8] tracking-widest">
                        {confirmedPass.reservationCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase">
                        Party Size
                      </p>
                      <p className="font-['Space_Grotesk',sans-serif] text-xs font-bold text-[#e6e1df]">
                        {confirmedPass.partySize} {confirmedPass.partySize === 1 ? 'Guest' : 'Guests'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#bdcac0] block font-['Space_Grotesk',sans-serif]">Date</span>
                      <span className="font-bold text-[#e6e1df]">{confirmedPass.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#bdcac0] block font-['Space_Grotesk',sans-serif]">Time</span>
                      <span className="font-bold text-[#75daa8]">{confirmedPass.timeSlot}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#bdcac0] block font-['Space_Grotesk',sans-serif]">Duration</span>
                      <span className="font-bold text-[#e6e1df]">{confirmedPass.duration}</span>
                    </div>
                  </div>

                  {/* QR Simulation Barcode */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#bdcac0]">
                      <span className="material-symbols-outlined text-[#75daa8] text-base">qr_code_2</span>
                      <span>Show to host upon arrival</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/20 text-[#75daa8] text-[10px] font-bold">
                      Valid Today
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      onCheckInReservation(confirmedPass.id);
                      setConfirmedPass({ ...confirmedPass, checkedIn: true });
                    }}
                    className={`flex-1 py-2.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      confirmedPass.checkedIn
                        ? 'bg-[#52b788] text-[#003823]'
                        : 'bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {confirmedPass.checkedIn ? 'how_to_reg' : 'login'}
                    </span>
                    <span>{confirmedPass.checkedIn ? 'Checked In!' : 'Check In at Counter'}</span>
                  </button>
                  <button
                    onClick={() => setConfirmedPass(null)}
                    className="px-4 py-2.5 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: BOOK A SEAT */}
          {activeTab === 'reserve' && !confirmedPass && (
            <form onSubmit={handleBookSeat} className="space-y-4">
              {/* Floor Plan Quick Overview */}
              <div className="p-3.5 rounded-2xl bg-[#211f1e]/90 border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#75daa8]">
                    <span className="material-symbols-outlined text-base">map</span>
                    <span className="font-['Space_Grotesk',sans-serif] text-[11px] font-bold uppercase tracking-wider">
                      Interactive Floor Zone
                    </span>
                  </div>
                  <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                    Select atmosphere
                  </span>
                </div>

                {/* Zone Filter Chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone.id)}
                      className={`px-3 py-1 rounded-full text-xs font-['Space_Grotesk',sans-serif] shrink-0 transition-all ${
                        selectedZone === zone.id
                          ? 'bg-[#75daa8] text-[#003823] font-bold shadow-sm'
                          : 'bg-[#2b2a28] text-[#bdcac0] hover:text-[#e6e1df]'
                      }`}
                    >
                      {zone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Party Size Selector */}
              <div>
                <label className="block font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold mb-1.5">
                  Party Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedPartySize(size)}
                      className={`py-2 px-1 rounded-xl text-center font-['Space_Grotesk',sans-serif] text-xs transition-all flex flex-col items-center gap-0.5 border ${
                        selectedPartySize === size
                          ? 'bg-[#75daa8]/15 border-[#75daa8] text-[#75daa8] font-bold'
                          : 'bg-[#211f1e] border-white/5 text-[#bdcac0] hover:text-[#e6e1df]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {size === 1 ? 'person' : size === 2 ? 'group' : 'groups'}
                      </span>
                      <span>{size} {size === 1 ? 'Person' : size === 4 ? '4+ Guests' : 'Guests'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Duration Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold mb-1.5">
                    Reservation Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-2.5 text-xs text-[#e6e1df] font-['Space_Grotesk',sans-serif] focus:outline-none focus:border-[#75daa8]"
                  >
                    <option value="Today">Today (Oct 11)</option>
                    <option value="Tomorrow">Tomorrow (Oct 12)</option>
                    <option value="Monday">Monday (Oct 13)</option>
                    <option value="Tuesday">Tuesday (Oct 14)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold mb-1.5">
                    Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-2.5 text-xs text-[#e6e1df] font-['Space_Grotesk',sans-serif] focus:outline-none focus:border-[#75daa8]"
                  >
                    <option value="1 Hour">1 Hour (Quick work)</option>
                    <option value="1.5 Hours">1.5 Hours (Popular)</option>
                    <option value="2 Hours">2 Hours (Study session)</option>
                    <option value="3 Hours">3 Hours (Work block)</option>
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold">
                    Select Time Slot
                  </label>
                  <span className="text-[10px] text-[#75daa8] font-['Space_Grotesk',sans-serif]">
                    Instant Confirmation
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 rounded-xl text-center text-xs font-['Space_Grotesk',sans-serif] transition-all border ${
                          isSelected
                            ? 'bg-[#75daa8] text-[#003823] border-[#75daa8] font-bold shadow-sm'
                            : slot.status === 'busy'
                            ? 'bg-[#1a1918] text-[#88948b] border-white/5 opacity-70'
                            : 'bg-[#211f1e] text-[#e6e1df] border-white/5 hover:border-[#75daa8]/30'
                        }`}
                      >
                        <span className="block font-medium">{slot.time}</span>
                        <span
                          className={`text-[9px] block ${
                            isSelected
                              ? 'text-[#003823] font-bold'
                              : slot.status === 'busy'
                              ? 'text-[#ffb780]'
                              : 'text-[#75daa8]'
                          }`}
                        >
                          {slot.status === 'busy' ? 'Busy' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table Selection Cards */}
              <div>
                <label className="block font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold mb-1.5">
                  Available Tables ({filteredTables.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {filteredTables.map((table) => {
                    const isSelected = selectedTableId === table.id;
                    return (
                      <div
                        key={table.id}
                        onClick={() => setSelectedTableId(table.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all border flex gap-3 items-center ${
                          isSelected
                            ? 'bg-[#2b2a28] border-[#75daa8] shadow-md ring-1 ring-[#75daa8]'
                            : 'bg-[#211f1e]/80 border-white/5 hover:bg-[#211f1e]'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0f0e0d] shrink-0">
                          <img
                            src={table.image}
                            alt={table.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#e6e1df] truncate">
                              {table.name}
                            </h4>
                            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] font-bold">
                              Seats up to {table.capacity}
                            </span>
                          </div>
                          <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] line-clamp-1 mt-0.5">
                            {table.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {table.features.slice(0, 3).map((feat, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-[#0f0e0d]/70 text-[9px] text-[#bdcac0] font-['Space_Grotesk',sans-serif]"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#75daa8] border-[#75daa8] text-[#003823]'
                                : 'border-[#bdcac0]/40'
                            }`}
                          >
                            {isSelected && <span className="material-symbols-outlined text-xs font-bold">check</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-[11px] text-[#bdcac0] font-semibold mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Alex"
                    className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-2 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                  />
                </div>
                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-[11px] text-[#bdcac0] font-semibold mb-1">
                    Special Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Laptop power outlet, quiet zone..."
                    className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-2 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Syne',sans-serif] text-sm font-bold shadow-lg shadow-[#75daa8]/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-lg">event_available</span>
                <span>Confirm {selectedTable.name} • {selectedTime}</span>
              </button>
            </form>
          )}

          {/* TAB 2: MY RESERVATIONS */}
          {activeTab === 'my-reservations' && (
            <div className="space-y-3 animate-fadeIn">
              {reservations.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#211f1e]/80 border border-white/5 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-[#bdcac0]">chair_alt</span>
                  <p className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                    No Active Reservations
                  </p>
                  <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                    Select a table and time to guarantee your spot in the café.
                  </p>
                  <button
                    onClick={() => setActiveTab('reserve')}
                    className="mt-3 px-4 py-2 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold"
                  >
                    Book a Table Now
                  </button>
                </div>
              ) : (
                reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-[#211f1e]/90 border border-white/5 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-['Syne',sans-serif] text-sm font-bold text-[#e6e1df]">
                            {res.tableName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full font-['Space_Grotesk',sans-serif] text-[10px] font-bold ${
                              res.checkedIn
                                ? 'bg-[#75daa8]/20 text-[#75daa8]'
                                : res.status === 'active'
                                ? 'bg-[#ffb780]/20 text-[#ffb780]'
                                : 'bg-[#363433] text-[#bdcac0]'
                            }`}
                          >
                            {res.checkedIn ? 'Checked In' : 'Active Pass'}
                          </span>
                        </div>
                        <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                          {res.storeName || currentStore.name} • {res.zone}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] block">
                          Pass Code
                        </span>
                        <span className="font-['Syne',sans-serif] text-sm font-bold text-[#75daa8]">
                          {res.reservationCode}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#0f0e0d]/80 text-xs">
                      <div>
                        <span className="text-[10px] text-[#bdcac0] block">Date</span>
                        <span className="font-bold text-[#e6e1df]">{res.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#bdcac0] block">Time</span>
                        <span className="font-bold text-[#75daa8]">{res.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#bdcac0] block">Duration</span>
                        <span className="font-bold text-[#e6e1df]">{res.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onCheckInReservation(res.id)}
                        className={`px-3 py-1.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center gap-1 ${
                          res.checkedIn
                            ? 'bg-[#52b788]/20 text-[#75daa8] border border-[#75daa8]/30'
                            : 'bg-[#75daa8] text-[#003823] hover:bg-[#92f7c3]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {res.checkedIn ? 'check_circle' : 'login'}
                        </span>
                        <span>{res.checkedIn ? 'At Table' : 'Check In'}</span>
                      </button>

                      <button
                        onClick={() => onCancelReservation(res.id)}
                        className="text-xs font-['Space_Grotesk',sans-serif] text-[#ff8080] hover:underline"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
