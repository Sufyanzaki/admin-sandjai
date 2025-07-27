// User-related types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string; // ISO date string
  role: "CLIENT" | "ADMIN" | "STAFF"; // Can extend as needed
  password: string;
  otp: string | null;
  otpExpiresAt: string | null; // ISO date string or null
  isActive: boolean;
  image: string;
  phone: string;
  department: string | null;
  location: string | null;
  origin: string;
  gender: "Man" | "Vrouw" | "Other"; // Can extend as needed
  age: number;
  relationshipStatus: "single" | "married" | "divorced" | "widowed"; // Can extend as needed
  lookingFor: string | null;
  children: boolean;
  religion: "hindu" | "islam" | "christian" | "buddhist" | "jewish" | "other"; // Can extend as needed
  shortDescription: string;
  isPremium: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  roleId: number | null;
}

// Monthly registration data
export interface MonthlyRegistration {
  month: string;
  count: number;
}

// Main dashboard statistics interface
export interface DashboardStats {
  totalMembers: number;
  premiumMembers: number;
  freeMembers: number;
  todayMembers: number;
  monthlyRegistrations: MonthlyRegistration[];
  todayRegisteredUsers: User[];
}

// Sample data matching the provided JSON structure
export const sampleDashboardData: DashboardStats = {
  totalMembers: 5,
  premiumMembers: 0,
  freeMembers: 5,
  todayMembers: 2,
  monthlyRegistrations: [
    {
      month: "January",
      count: 0
    },
    {
      month: "February",
      count: 0
    },
    {
      month: "March",
      count: 0
    },
    {
      month: "April",
      count: 0
    },
    {
      month: "May",
      count: 0
    },
    {
      month: "June",
      count: 0
    },
    {
      month: "July",
      count: 5
    },
    {
      month: "August",
      count: 0
    },
    {
      month: "September",
      count: 0
    },
    {
      month: "October",
      count: 0
    },
    {
      month: "November",
      count: 0
    },
    {
      month: "December",
      count: 0
    }
  ],
  todayRegisteredUsers: [
    {
      id: 7,
      username: "mukybedip",
      email: "mixaqidob@mailinator.com",
      firstName: "Kessie",
      lastName: "Morse",
      dob: "2025-02-22T00:00:00.000Z",
      role: "CLIENT",
      password: "$2b$08$gzhbiNUjD4TxAtHv/ol8teGj9EgejyLacztc6MXChcqLtDbVVOYDC",
      otp: null,
      otpExpiresAt: null,
      isActive: true,
      image: "https://ui.shadcn.com/blocks",
      phone: "+1 (818) 623-2375",
      department: null,
      location: null,
      origin: "Sunt et eu porro qui",
      gender: "Man",
      age: 65,
      relationshipStatus: "divorced",
      lookingFor: null,
      children: true,
      religion: "hindu",
      shortDescription: "Voluptates suscipit ",
      isPremium: false,
      createdAt: "2025-07-27T13:45:06.189Z",
      updatedAt: "2025-07-27T13:45:06.189Z",
      roleId: null
    },
    {
      id: 6,
      username: "zacocym",
      email: "wuqinidi@mailinator.com",
      firstName: "Jelani",
      lastName: "Luna",
      dob: "2025-03-29T00:00:00.000Z",
      role: "CLIENT",
      password: "$2b$08$xh6ExpAItL1sV7rhuTht4u/KoLp1VAxKvBn3YXyOdqWbE41ClR..6",
      otp: null,
      otpExpiresAt: null,
      isActive: true,
      image: "https://ui.shadcn.com/blocks",
      phone: "+1 (864) 708-3198",
      department: null,
      location: null,
      origin: "Exercitationem conse",
      gender: "Vrouw",
      age: 14,
      relationshipStatus: "divorced",
      lookingFor: null,
      children: true,
      religion: "islam",
      shortDescription: "Aliquid ut iure inci",
      isPremium: false,
      createdAt: "2025-07-27T13:33:21.046Z",
      updatedAt: "2025-07-27T13:33:21.046Z",
      roleId: null
    }
  ]
};