import React, { useState } from 'react';
import {
  ScreenTab,
  StoreLocation,
  ActiveTicket,
  ParsedDrinkOrder,
  MenuItem,
  MenuItemReview,
  CartItem,
  SeatReservation,
  Patron,
  ConnectionRequest,
  CurrentUserProfile,
} from './types/cafe';
import {
  STORES,
  INITIAL_ACTIVE_TICKET,
  MENU_ITEMS,
  CAFE_TABLES,
  PATRONS,
  INITIAL_RESERVATIONS,
  INITIAL_INCOMING_REQUESTS,
  INITIAL_USER_PROFILE,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingTracker } from './components/FloatingTracker';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { StorePickerModal } from './components/StorePickerModal';
import { ProfileModal } from './components/ProfileModal';
import { SeatReservationModal } from './components/SeatReservationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { MenuModal } from './components/screens/MenuModal';
import { ItemReviewsModal } from './components/screens/ItemReviewsModal';
import { CartModal } from './components/screens/CartModal';
import { DiscoverScreen } from './components/screens/DiscoverScreen';
import { AiOrderScreen } from './components/screens/AiOrderScreen';
import { CommunityScreen } from './components/screens/CommunityScreen';
import { StaffHubScreen } from './components/screens/StaffHubScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('discover');
  const [stores, setStores] = useState<StoreLocation[]>(STORES);
  const [currentStore, setCurrentStore] = useState<StoreLocation>(STORES[0]);
  const [activeTicket, setActiveTicket] = useState<ActiveTicket>(INITIAL_ACTIVE_TICKET);

  // Menu and Reviews State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reviewModalItem, setReviewModalItem] = useState<MenuItem | null>(null);

  // Cart State for Multi-Item Selection & Continuous Ordering
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Seat Reservation State
  const [reservations, setReservations] = useState<SeatReservation[]>(INITIAL_RESERVATIONS);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  // Social Radar & Cafe Patrons State
  const [patrons, setPatrons] = useState<Patron[]>(PATRONS);
  const [presenceVisible, setPresenceVisible] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<CurrentUserProfile>(INITIAL_USER_PROFILE);
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>(INITIAL_INCOMING_REQUESTS);

  // Profile Viewer / Request Action Modal
  const [selectedPatronForProfile, setSelectedPatronForProfile] = useState<Patron | null>(null);
  const [selectedIncomingRequestForProfile, setSelectedIncomingRequestForProfile] = useState<ConnectionRequest | null>(null);
  const [isProfileViewerOpen, setIsProfileViewerOpen] = useState(false);

  // Core Modals
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isStorePickerOpen, setIsStorePickerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3600);
  };

  const handleSelectStore = (store: StoreLocation) => {
    setCurrentStore(store);
    setStores((prev) =>
      prev.map((s) => ({
        ...s,
        isCurrent: s.id === store.id,
      }))
    );
    showNotification(`Switched pickup store to ${store.name}`);
  };

  const handleSwitchStoreById = (storeId: string) => {
    const found = stores.find((s) => s.id === storeId);
    if (found) {
      handleSelectStore(found);
    }
  };

  // Cart Management
  const handleAddToCart = (menuItem: MenuItem) => {
    const priceNumber = parseFloat(menuItem.price.replace('$', '')) || 5.0;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          priceNumber: priceNumber,
          image: menuItem.image,
          quantity: 1,
          category: menuItem.category,
        },
      ];
    });
    showNotification(`Added ${menuItem.name} to cart`);
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId || item.menuItemId === itemId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id && i.menuItemId !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    showNotification('Cart cleared');
  };

  const handleCheckoutCart = (items: CartItem[], notes: string) => {
    const subtotal = items.reduce((sum, i) => sum + i.priceNumber * i.quantity, 0);
    const tax = subtotal * 0.08875;
    const totalFormatted = `$${(subtotal + tax).toFixed(2)}`;
    const newTicketNum = activeTicket.ticketNumber + 1;
    const itemSummary = items.map((i) => `${i.quantity}x ${i.name}`);

    setActiveTicket({
      ticketNumber: newTicketNum,
      step: 2,
      totalSteps: 3,
      statusDescription: notes
        ? `Barista Sam crafting: ${itemSummary.join(', ')} (${notes})`
        : `Barista Sam is preparing ${items.reduce((acc, i) => acc + i.quantity, 0)} items`,
      estimatedWait: '~4m',
      baristaName: 'Sam',
      items: itemSummary,
      totalAmount: totalFormatted,
      pickupStation: `${currentStore.name} Bar 1 Express`,
      timestamp: 'Just now',
    });

    setCartItems([]);
    setIsCartOpen(false);
    setIsMenuOpen(false);
    setIsTrackerOpen(true);
    showNotification(`Order dispatched! Ticket #${newTicketNum} queued at counter.`);
  };

  const handleQuickOrder = (itemName: string, price: string) => {
    const foundItem = menuItems.find((m) => m.name.toLowerCase().includes(itemName.toLowerCase()));
    if (foundItem) {
      handleAddToCart(foundItem);
    } else {
      setActiveTicket((prev) => ({
        ...prev,
        items: [itemName, ...prev.items.slice(0, 2)],
        totalAmount: price,
        statusDescription: `Barista Sam is preparing ${itemName}`,
        step: 2,
      }));
      showNotification(`Order placed: ${itemName} (${price})`);
    }
  };

  const handlePlaceOrder = (order: ParsedDrinkOrder, withPastry: boolean) => {
    const newTicketNum = activeTicket.ticketNumber + 1;
    const itemsList = [`1x ${order.name}`];
    if (withPastry) {
      itemsList.push(`1x ${order.pairing.name}`);
    }

    const basePrice = parseFloat(order.totalPrice.replace('$', '')) || 7.75;
    const pastryPrice = withPastry ? 4.5 : 0;
    const formattedTotal = `$${(basePrice + pastryPrice).toFixed(2)}`;

    setActiveTicket({
      ticketNumber: newTicketNum,
      step: 2,
      totalSteps: 3,
      statusDescription: `Barista Sam is steaming Califia oat milk for ${order.name}`,
      estimatedWait: order.prepTime.replace(' prep', ''),
      baristaName: 'Sam',
      items: itemsList,
      totalAmount: formattedTotal,
      pickupStation: `${currentStore.name} Bar 1 Express`,
      timestamp: 'Just now',
    });

    setIsTrackerOpen(true);
    showNotification(`Ticket #${newTicketNum} dispatched to ${currentStore.name}!`);
  };

  const handleAdvanceTicketStep = () => {
    setActiveTicket((prev) => {
      if (prev.step === 1) {
        return {
          ...prev,
          step: 2,
          statusDescription: 'Barista Sam is steaming Califia oat milk',
          estimatedWait: '~2m',
        };
      } else if (prev.step === 2) {
        return {
          ...prev,
          step: 3,
          statusDescription: 'Drink & pastry ready at pickup station counter',
          estimatedWait: 'READY NOW',
        };
      } else {
        return {
          ...prev,
          ticketNumber: prev.ticketNumber + 1,
          step: 1,
          statusDescription: 'Ticket received in espresso queue',
          estimatedWait: '~4m',
        };
      }
    });
  };

  const handleOpenReviews = (item: MenuItem) => {
    setReviewModalItem(item);
  };

  const handleOpenReviewsById = (itemId: string) => {
    const found = menuItems.find((m) => m.id === itemId);
    if (found) {
      setReviewModalItem(found);
    }
  };

  const handleAddReview = (itemId: string, newReview: MenuItemReview) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedReviews = [newReview, ...item.reviews];
          const newAvgRating = parseFloat(
            (
              updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
              updatedReviews.length
            ).toFixed(1)
          );
          const updated = {
            ...item,
            reviews: updatedReviews,
            rating: newAvgRating,
            reviewCount: updatedReviews.length,
          };
          setReviewModalItem(updated);
          return updated;
        }
        return item;
      })
    );
    showNotification('Review submitted with photo! Thank you for sharing.');
  };

  // Seat Reservation Handlers
  const handleConfirmReservation = (reservation: SeatReservation) => {
    setReservations((prev) => [reservation, ...prev]);
    showNotification(`Table Reserved! Pass #${reservation.reservationCode} generated.`);
  };

  const handleCancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );
    showNotification('Reservation cancelled.');
  };

  const handleCheckInReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, checkedIn: true } : r))
    );
    showNotification('Checked in! Welcome to your table at Craft & Bloom.');
  };

  // Social Radar & Connection Handlers
  const handleOpenPatronProfile = (patron: Patron) => {
    setSelectedPatronForProfile(patron);
    setSelectedIncomingRequestForProfile(null);
    setIsProfileViewerOpen(true);
  };

  const handleOpenIncomingRequest = (request: ConnectionRequest) => {
    setSelectedIncomingRequestForProfile(request);
    const foundPatron = patrons.find((p) => p.id === request.fromPatron.id) || null;
    setSelectedPatronForProfile(foundPatron);
    setIsProfileViewerOpen(true);
  };

  const handleSendConnectionRequest = (patronId: string, intent: string, message: string) => {
    const target = patrons.find((p) => p.id === patronId);
    if (!target) return;

    // Both must be visible!
    if (!presenceVisible || !target.isRadarVisible) {
      showNotification('Both parties must have Social Radar visible to connect.');
      return;
    }

    setPatrons((prev) =>
      prev.map((p) => (p.id === patronId ? { ...p, connectionStatus: 'pending' } : p))
    );
    showNotification(`Sent request to ${target.name}! They can review your bio & profile at ${currentUserProfile.tableNumber} and accept or decline.`);

    // Simulate reciprocal response from the patron after 4 seconds
    setTimeout(() => {
      setPatrons((prev) =>
        prev.map((p) => (p.id === patronId ? { ...p, connectionStatus: 'connected' } : p))
      );
      showNotification(`🎉 ${target.name} reviewed your bio & accepted! Connected at ${target.tableNumber || 'their table'}.`);
    }, 4000);
  };

  const handleAcceptRequest = (requestId: string) => {
    const req = incomingRequests.find((r) => r.id === requestId);
    setIncomingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r))
    );

    if (req) {
      setPatrons((prev) =>
        prev.map((p) => (p.id === req.fromPatron.id ? { ...p, connectionStatus: 'connected' } : p))
      );
      showNotification(`Accepted connection with ${req.fromPatron.name}! Table co-presence active.`);
    }
    setIsProfileViewerOpen(false);
  };

  const handleRejectRequest = (requestId: string) => {
    setIncomingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
    showNotification('Request declined quietly.');
    setIsProfileViewerOpen(false);
  };

  const handleSimulateIncomingRequest = () => {
    const newId = `req-sim-${Date.now()}`;
    const simulationPatrons = [
      {
        id: 'patron-4',
        name: 'Liam Wright',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        table: 'Table 12 • Courtyard Patio',
        drink: 'Double Ristretto Flat White',
        bio: 'Documentary photographer capturing Manhattan morning light with 35mm Leica.',
        tags: ['#FilmPhotography', '#SpecialtyCoffee', '#SoHoVibe'],
        loyaltyTier: 'Silver Member',
        activity: 'Editing Leica 35mm street film',
        affinityPercent: 92,
      },
      {
        id: 'patron-5',
        name: 'Chloe Valen',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        table: 'Table 08 • Velvet Booth',
        drink: 'Honey Lavender Cold Brew',
        bio: 'Essays on urban ecology and speculative futures. Always looking for book swaps.',
        tags: ['#CreativeWriting', '#Literature', '#ColdBrew'],
        loyaltyTier: 'Gold Roaster Member',
        activity: 'Writing speculative fiction essay',
        affinityPercent: 88,
      },
      {
        id: 'patron-6',
        name: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        table: 'Table 03 • Window Stool',
        drink: 'Dirty Matcha w/ Espresso Float',
        bio: 'Software engineer building distributed systems. Usually here for 8am roasts.',
        tags: ['#OpenSource', '#Rust', '#CoffeeGeek'],
        loyaltyTier: 'Founding Member',
        activity: 'Reviewing systems architecture code',
        affinityPercent: 82,
      },
    ];

    const pick = simulationPatrons[Math.floor(Math.random() * simulationPatrons.length)];
    const newReq: ConnectionRequest = {
      id: newId,
      fromPatron: pick,
      toPatronId: 'user-current',
      intent: 'Coffee Chat & Table Sharing',
      message: `Hey! Saw your presence on The Hearth radar. Would love to share table or chat about ${pick.tags[0]} if you are free for 10m!`,
      timestamp: 'Just now',
      status: 'pending',
    };

    setIncomingRequests((prev) => [newReq, ...prev]);
    showNotification(`🔔 Incoming connection request from ${pick.name} (${pick.table})!`);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartSubtotal = cartItems.reduce((acc, i) => acc + i.priceNumber * i.quantity, 0);
  const pendingRequestsCount = incomingRequests.filter((r) => r.status === 'pending').length;
  const activeReservation = reservations.find((r) => r.status === 'active');

  return (
    <div className="bg-[#141312] text-[#e6e1df] min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#75daa8] selection:text-[#003823] antialiased">
      {/* Fixed Top Bar */}
      <Header
        currentStore={currentStore}
        cartCount={totalCartCount}
        incomingRequestsCount={pendingRequestsCount}
        onOpenStorePicker={() => setIsStorePickerOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSeatReservation={() => setIsReservationModalOpen(true)}
      />

      {/* Main Content View with Tab Routing */}
      <main className="flex-1 w-full pt-20 pb-28 relative">
        {currentTab === 'discover' && (
          <DiscoverScreen
            currentStore={currentStore}
            activeTicket={activeTicket}
            onOpenStorePicker={() => setIsStorePickerOpen(true)}
            onOpenTracker={() => setIsTrackerOpen(true)}
            onQuickOrder={handleQuickOrder}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenReviewsById={handleOpenReviewsById}
            onOpenSeatReservation={() => setIsReservationModalOpen(true)}
          />
        )}

        {currentTab === 'ai-order' && (
          <AiOrderScreen
            currentStore={currentStore}
            onSwitchStore={handleSwitchStoreById}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {currentTab === 'community' && (
          <CommunityScreen
            presenceVisible={presenceVisible}
            onTogglePresence={() => setPresenceVisible(!presenceVisible)}
            patrons={patrons}
            incomingRequests={incomingRequests}
            userProfile={currentUserProfile}
            activeReservation={activeReservation}
            onOpenPatronProfile={handleOpenPatronProfile}
            onOpenIncomingRequest={handleOpenIncomingRequest}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onSimulateIncomingRequest={handleSimulateIncomingRequest}
            onOpenSeatReservation={() => setIsReservationModalOpen(true)}
            onOpenEditProfile={() => setIsProfileOpen(true)}
          />
        )}

        {currentTab === 'staff-hub' && <StaffHubScreen />}
      </main>

      {/* Persistent Floating Cart Bar (Bottom Left) when user has items in cart */}
      {totalCartCount > 0 && (
        <aside className="fixed bottom-20 left-4 z-40 pb-safe pointer-events-auto animate-fadeIn">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 h-11 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold shadow-[0_4px_24px_rgba(117,218,168,0.4)] hover:bg-[#92f7c3] active:scale-95 transition-all cursor-pointer"
            aria-label="View Cart and Checkout"
          >
            <span className="material-symbols-outlined text-base font-bold">shopping_bag</span>
            <span>{totalCartCount} in Cart • ${totalCartSubtotal.toFixed(2)}</span>
            <span className="material-symbols-outlined text-xs font-bold">arrow_forward</span>
          </button>
        </aside>
      )}

      {/* Floating Prep 3m Pill (bottom right) */}
      <FloatingTracker
        ticket={activeTicket}
        onOpen={() => setIsTrackerOpen(true)}
      />

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-4 right-4 z-50 p-3.5 rounded-2xl bg-[#2b2a28]/95 backdrop-blur-xl border border-[#75daa8]/30 shadow-2xl flex items-center justify-between max-w-sm mx-auto animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs text-[#e6e1df]">
            <span className="material-symbols-outlined text-[#75daa8] text-base">check_circle</span>
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#bdcac0] hover:text-[#e6e1df]"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Seat Reservation Modal: Interactive table map, date/time pickers, party size & boarding passes */}
      <SeatReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        currentStore={currentStore}
        tables={CAFE_TABLES}
        reservations={reservations}
        onConfirmReservation={handleConfirmReservation}
        onCancelReservation={handleCancelReservation}
        onCheckInReservation={handleCheckInReservation}
      />

      {/* User Profile & Connection Request Modal: View sender profile, accept, or decline */}
      <UserProfileModal
        isOpen={isProfileViewerOpen}
        onClose={() => setIsProfileViewerOpen(false)}
        patron={selectedPatronForProfile}
        incomingRequest={selectedIncomingRequestForProfile}
        isCurrentUserRadarVisible={presenceVisible}
        onSendRequest={handleSendConnectionRequest}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
        onToggleUserRadar={() => setPresenceVisible(true)}
      />

      {/* Menu Modal: Browse items, customize, and add continuously to cart */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
        cartItems={cartItems}
        onSelectReviewItem={handleOpenReviews}
        onAddToCart={handleAddToCart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart Modal: Review selections, adjust quantities, place final order */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currentStore={currentStore}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckoutCart}
      />

      {/* Item Reviews Modal: View who gave reviews and see their attached photos */}
      <ItemReviewsModal
        isOpen={Boolean(reviewModalItem)}
        onClose={() => setReviewModalItem(null)}
        item={reviewModalItem}
        onAddReview={handleAddReview}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        ticket={activeTicket}
        currentStore={currentStore}
        onAdvanceTicketStep={handleAdvanceTicketStep}
      />

      {/* Store Location Picker Modal */}
      <StorePickerModal
        isOpen={isStorePickerOpen}
        onClose={() => setIsStorePickerOpen(false)}
        stores={stores}
        currentStore={currentStore}
        onSelectStore={handleSelectStore}
      />

      {/* Patron Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        presenceVisible={presenceVisible}
        onTogglePresence={() => setPresenceVisible(!presenceVisible)}
        userProfile={currentUserProfile}
        onSaveProfile={(updated) => {
          setCurrentUserProfile(updated);
          showNotification('Profile & Bio updated! Others will see this when you connect.');
        }}
        activeReservation={activeReservation}
      />
    </div>
  );
}
