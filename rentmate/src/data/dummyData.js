export const properties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    description: "A beautiful modern apartment in the heart of downtown with amazing views.",
    price: 1200,
    location: "New York, NY",
    landlordName: "John Smith",
    images: [
      "/images/property1-1.jpg",
      "/images/property1-2.jpg",
      "/images/property1-3.jpg"
    ],
    views: 245,
    status: "available", // available, rented, pending, approved, rejected
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    amenities: ["Parking", "Pool", "Gym", "Elevator"]
  },
  {
    id: 2,
    title: "Cozy Studio Near University",
    description: "Perfect for students! A cozy studio apartment walking distance from the university.",
    price: 800,
    location: "Boston, MA",
    landlordName: "Sarah Johnson",
    images: [
      "/images/property2-1.jpg",
      "/images/property2-2.jpg"
    ],
    views: 187,
    status: "available",
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    amenities: ["Internet", "Furnished", "Laundry"]
  },
  {
    id: 3,
    title: "Luxury Beach House",
    description: "Stunning beach house with direct access to the shore and panoramic ocean views.",
    price: 3500,
    location: "Miami, FL",
    landlordName: "Robert Williams",
    images: [
      "/images/property3-1.jpg",
      "/images/property3-2.jpg",
      "/images/property3-3.jpg"
    ],
    views: 356,
    status: "rented",
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    amenities: ["Swimming Pool", "Beachfront", "Air Conditioning", "Balcony"]
  },
  {
    id: 4,
    title: "Mountain View Cabin",
    description: "Cozy cabin with stunning mountain views, perfect for a weekend getaway.",
    price: 1500,
    location: "Denver, CO",
    landlordName: "John Smith",
    images: [
      "/images/property4-1.jpg",
      "/images/property4-2.jpg"
    ],
    views: 128,
    status: "pending", // Admin needs to approve this listing
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    amenities: ["Fireplace", "Hiking Trails", "Pet Friendly"]
  },
  {
    id: 5,
    title: "Urban Loft with Rooftop",
    description: "Modern loft in the arts district with exclusive access to rooftop patio.",
    price: 1800,
    location: "Chicago, IL", 
    landlordName: "Emma Davis",
    images: [
      "/images/property5-1.jpg"
    ],
    views: 210,
    status: "pending", // Admin needs to approve this listing
    bedrooms: 1,
    bathrooms: 1,
    area: 780,
    amenities: ["Rooftop Patio", "Gym", "Doorman", "Pet Friendly"]
  },
  {
    id: 6,
    title: "Suburban Family Home",
    description: "Spacious family home in a quiet suburban neighborhood with a large backyard.",
    price: 2200,
    location: "Austin, TX",
    landlordName: "Michael Brown",
    images: [
      "/images/property6-1.jpg"
    ],
    views: 175,
    status: "rejected", // Admin rejected this listing
    bedrooms: 3,
    bathrooms: 2,
    area: 1650,
    amenities: ["Backyard", "Garage", "Washer/Dryer", "Pet Friendly"]
  }
];

export const users = {
  tenants: [
    {
      id: 1,
      name: "Alice Brown",
      email: "alice@example.com",
      savedProperties: [1, 3],
      applications: [
        { propertyId: 2, status: "pending", documents: ["id.pdf", "employment.pdf"] }
      ]
    },
    {
      id: 2,
      name: "David Miller", 
      email: "david@example.com",
      savedProperties: [2, 5],
      applications: [
        { propertyId: 1, status: "approved", documents: ["id.pdf", "employment.pdf", "credit-report.pdf"] }
      ]
    }
  ],
  landlords: [
    {
      id: 101,
      name: "John Smith",
      email: "john@example.com",
      properties: [1, 4],
      status: "approved" // approved, pending, rejected
    },
    {
      id: 102,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      properties: [2],
      status: "approved"
    },
    {
      id: 103,
      name: "Robert Williams",
      email: "robert@example.com",
      properties: [3],
      status: "approved"
    },
    {
      id: 104,
      name: "Emma Davis",
      email: "emma@example.com",
      properties: [5],
      status: "pending" // Pending admin approval
    },
    {
      id: 105,
      name: "Michael Brown",
      email: "michael@example.com",
      properties: [6],
      status: "rejected" // Rejected by admin
    }
  ],
  admins: [
    {
      id: 501,
      name: "Admin User",
      email: "admin@rentmate.com"
    }
  ]
};

export const messages = [
  {
    id: 1,
    conversationId: "tenant1-landlord101-property1",
    senderId: 1,
    receiverId: 101,
    propertyId: 1,
    content: "Hi, I'm interested in your apartment. Is it still available?",
    timestamp: "2023-04-15T14:32:00Z",
    read: true
  },
  {
    id: 2,
    conversationId: "tenant1-landlord101-property1",
    senderId: 101,
    receiverId: 1,
    propertyId: 1,
    content: "Yes, it's available! Would you like to schedule a viewing?",
    timestamp: "2023-04-15T15:05:22Z",
    read: true
  },
  {
    id: 3,
    conversationId: "tenant1-landlord101-property1",
    senderId: 1,
    receiverId: 101,
    propertyId: 1,
    content: "That would be great! How about this Friday at 3pm?",
    timestamp: "2023-04-15T15:30:45Z",
    read: true
  },
  {
    id: 4,
    conversationId: "tenant1-landlord101-property1",
    senderId: 101,
    receiverId: 1,
    propertyId: 1,
    content: "Friday at 3pm works for me. I'll see you then at the property.",
    timestamp: "2023-04-15T16:02:11Z",
    read: false
  },
  {
    id: 5,
    conversationId: "tenant1-landlord103-property3",
    senderId: 1,
    receiverId: 103,
    propertyId: 3,
    content: "Hello, I noticed your beach house listing. Is it still available for July?",
    timestamp: "2023-04-16T10:15:30Z",
    read: true
  },
  {
    id: 6,
    conversationId: "tenant1-landlord103-property3",
    senderId: 103,
    receiverId: 1,
    propertyId: 3,
    content: "Hi Alice, I'm afraid it's already been rented for the summer. I'll let you know if that changes.",
    timestamp: "2023-04-16T11:20:15Z",
    read: false
  }
];

// Group conversations by unique conversationId
export const conversations = messages.reduce((acc, message) => {
  const { conversationId } = message;
  if (!acc[conversationId]) {
    acc[conversationId] = [];
  }
  acc[conversationId].push(message);
  return acc;
}, {});