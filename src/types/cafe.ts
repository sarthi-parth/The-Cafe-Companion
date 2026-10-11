export type ScreenTab = 'discover' | 'ai-order' | 'community' | 'staff-hub';

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  status: string;
  prepTime: string;
  isCurrent?: boolean;
}

export interface OrderItemComponent {
  label: string;
  detail: string;
  price: string;
  icon: string;
}

export interface ParsedDrinkOrder {
  id: string;
  name: string;
  origin: string;
  totalPrice: string;
  prepTime: string;
  image: string;
  aiResponse: string;
  components: OrderItemComponent[];
  pairing: {
    name: string;
    price: string;
    image: string;
  };
}

export interface ActiveTicket {
  ticketNumber: number;
  step: number; // 1, 2, or 3
  totalSteps: number;
  statusDescription: string;
  estimatedWait: string;
  baristaName: string;
  items: string[];
  totalAmount: string;
  pickupStation: string;
  timestamp: string;
}

export interface CurrentUserProfile {
  name: string;
  avatar: string;
  headline: string;
  bio: string;
  tableNumber: string;
  currentDrink: string;
  currentActivity: string;
  tags: string[];
  loyaltyTier: string;
  points: number;
  contactOrSocial?: string;
  availableFor: string[];
}

export interface Patron {
  id: string;
  name: string;
  avatar: string;
  activity: string;
  drink: string;
  tags: string[];
  statusColor: 'primary' | 'tertiary';
  modeLabel?: string;
  tableNumber?: string;
  bio?: string;
  isRadarVisible: boolean; // Social radar visible state
  connectionStatus?: 'none' | 'pending' | 'connected' | 'declined';
  affinityPercent?: number;
  timeSeated?: string;
}

export interface SeatReservation {
  id: string;
  tableId: string;
  tableName: string;
  zone: string;
  partySize: number;
  timeSlot: string;
  date: string;
  duration: string;
  reservationCode: string;
  status: 'active' | 'completed' | 'cancelled';
  storeId?: string;
  storeName?: string;
  guestName?: string;
  specialRequests?: string;
  checkedIn?: boolean;
  createdAt?: string;
}

export interface CafeTableOption {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  description: string;
  features: string[];
  isAvailable: boolean;
  image: string;
}

export interface ConnectionRequest {
  id: string;
  fromPatron: {
    id: string;
    name: string;
    avatar: string;
    table: string;
    drink: string;
    bio: string;
    tags: string[];
    loyaltyTier?: string;
    activity?: string;
    affinityPercent?: number;
  };
  toPatronId: string;
  intent: string;
  message?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface MenuItemReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  userImage?: string; // photo provided by user in their review
  verifiedPurchase?: boolean;
  tag?: string;
  likes?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'matcha' | 'cold-brew' | 'pastry' | 'food';
  price: string;
  description: string;
  image: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  origin?: string;
  prepTime?: string;
  reviews: MenuItemReview[];
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: string;
  priceNumber: number;
  image: string;
  quantity: number;
  category: string;
  customization?: string;
}

export interface FeedbackReview {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  rating: number;
  text: string;
  drinkTag: string;
  badgeTag: string;
  badgeType: 'primary' | 'tertiary';
}
