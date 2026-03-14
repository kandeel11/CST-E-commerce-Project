/**
 * seedData.js
 * Seeds localStorage with default users (1 admin, 3 customers, 12 sellers)
 * only when no users exist yet.
 * Called from Home.js on first load.
 */

export function seedDefaultUsers() {
    if (localStorage.getItem("users")) return; // already seeded

    const now = new Date().toString();

    const defaultUsers = [
        // ── Admin ──────────────────────────────────────────────────────
        {
            id: "Admin-1",
            Fname: "Super",
            Lname: "Admin",
            Role: "Admin",
            Email: "admin@ecobazar.com",
            password: "Admin@1234",
            address: "1 Admin St, Cairo, Egypt",
            Phone: "01000000000",
            Active: true,
            dateCreated: now
        },

        // ── Customers ──────────────────────────────────────────────────
        {
            id: "Us-1",
            Fname: "mohamed",
            Lname: "Khaled",
            Role: "User",
            Email: "customer1@ecobazar.com",
            password: "Customer@1234",
            address: "10 Nile St, Cairo, Egypt",
            Phone: "01011111111",
            Active: true,
            dateCreated: now
        },
        {
            id: "Us-2",
            Fname: "Mohamed",
            Lname: "Kandeel",
            Role: "User",
            Email: "customer2@ecobazar.com",
            password: "Customer@1234",
            address: "22 Pyramid Rd, Giza, Egypt",
            Phone: "01022222222",
            Active: true,
            dateCreated: now
        },
        {
            id: "Us-3",
            Lname: "Mohamed",
            Fname: "Elsayed",
            Role: "User",
            Email: "customer3@ecobazar.com",
            password: "Customer@1234",
            address: "5 Delta Ave, Alexandria, Egypt",
            Phone: "01033333333",
            Active: true,
            dateCreated: now
        },

        // ── Sellers (SLR-1 … SLR-12) ────────────────────────────────
        {
            id: "SLR-1",
            Fname: "Ahmed",
            Lname: "Hassan",
            Role: "Seller",
            Email: "seller01@ecobazar.com",
            password: "Seller@1234",
            address: "101 Market Lane, Cairo, Egypt",
            Phone: "01101010101",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Cairo",
            description: "Fresh organic vegetables",
            dateCreated: now
        },
        {
            id: "SLR-2",
            Fname: "Mona",
            Lname: "Ali",
            Role: "Seller",
            Email: "seller02@ecobazar.com",
            password: "Seller@1234",
            address: "202 Bazaar St, Alexandria, Egypt",
            Phone: "01102020202",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Alexandria",
            description: "Premium seasonal fruits",
            dateCreated: now
        },
        {
            id: "SLR-3",
            Fname: "Omar",
            Lname: "Khaled",
            Role: "Seller",
            Email: "seller03@ecobazar.com",
            password: "Seller@1234",
            address: "303 Garden Rd, Mansoura, Egypt",
            Phone: "01103030303",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Mansoura",
            description: "Organic dairy products",
            dateCreated: now
        },
        {
            id: "SLR-4",
            Fname: "Sara",
            Lname: "Mahmoud",
            Role: "Seller",
            Email: "seller04@ecobazar.com",
            password: "Seller@1234",
            address: "404 Farm Ave, Tanta, Egypt",
            Phone: "01104040404",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Tanta",
            description: "Herbs and spices",
            dateCreated: now
        },
        {
            id: "SLR-5",
            Fname: "Karim",
            Lname: "Nasser",
            Role: "Seller",
            Email: "seller05@ecobazar.com",
            password: "Seller@1234",
            address: "505 Green Valley, Luxor, Egypt",
            Phone: "01105050505",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Luxor",
            description: "Natural honey & bee products",
            dateCreated: now
        },
        {
            id: "SLR-6",
            Fname: "Nadia",
            Lname: "Ibrahim",
            Role: "Seller",
            Email: "seller06@ecobazar.com",
            password: "Seller@1234",
            address: "606 River Rd, Aswan, Egypt",
            Phone: "01106060606",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Aswan",
            description: "Tropical exotic fruits",
            dateCreated: now
        },
        {
            id: "SLR-7",
            Fname: "Hana",
            Lname: "Mostafa",
            Role: "Seller",
            Email: "seller07@ecobazar.com",
            password: "Seller@1234",
            address: "707 Corniche St, Port Said, Egypt",
            Phone: "01107070707",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Port Said",
            description: "Fresh fish & seafood",
            dateCreated: now
        },
        {
            id: "SLR-8",
            Fname: "Hana",
            Lname: "Mostafa",
            Role: "Seller",
            Email: "seller08@ecobazar.com",
            password: "Seller@1234",
            address: "808 Orchard Blvd, Suez, Egypt",
            Phone: "01108080808",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Suez",
            description: "Cold-pressed juices & smoothies",
            dateCreated: now
        },
        {
            id: "SLR-9",
            Fname: "Tarek",
            Lname: "Saleh",
            Role: "Seller",
            Email: "seller09@ecobazar.com",
            password: "Seller@1234",
            address: "909 Palm Tree Ave, Sharm El-Sheikh, Egypt",
            Phone: "01109090909",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Sharm El-Sheikh",
            description: "Dried fruits & nuts",
            dateCreated: now
        },
        {
            id: "SLR-10",
            Fname: "Layla",
            Lname: "Adel",
            Role: "Seller",
            Email: "seller10@ecobazar.com",
            password: "Seller@1234",
            address: "10 Downtown Plaza, Ismailia, Egypt",
            Phone: "01100101010",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Ismailia",
            description: "Artisan bread & bakery",
            dateCreated: now
        },
        {
            id: "SLR-11",
            Fname: "Rami",
            Lname: "Sabry",
            Role: "Seller",
            Email: "seller11@ecobazar.com",
            password: "Seller@1234",
            address: "11 Canal View, Zagazig, Egypt",
            Phone: "01101111111",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Zagazig",
            description: "Organic olive oil & pickles",
            dateCreated: now
        },
        {
            id: "SLR-12",
            Fname: "Dina",
            Lname: "Gamal",
            Role: "Seller",
            Email: "seller12@ecobazar.com",
            password: "Seller@1234",
            address: "12 Heritage Rd, Hurghada, Egypt",
            Phone: "01101212121",
            Active: true,
            rating: 0,
            totalProducts: 0,
            location: "Hurghada",
            description: "Organic skincare & beauty products",
            dateCreated: now
        }
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
}
