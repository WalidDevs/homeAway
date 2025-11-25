# 🏡 HomeAway – Airbnb-like Booking Platform

HomeAway is a modern web application inspired by Airbnb, allowing users to browse, publish, and book properties.
The project follows Clean Architecture principles, built with a React + TypeScript frontend and a C# .NET Core 8 backend.
It focuses on scalability, maintainability, and clear separation of concerns.

# 🚀 Technologies

Frontend 

	•	⚛️ React 18
	•	🟦 TypeScript
	•	🚀 Bun (package manager & runtime)
	•	🎨 Radix UI components
	•	📆 react-calendar
	•	📅 date-fns

Backend

	•	🟪 .NET Core 8 Web API
	•	🏛️ Clean Architecture structure
	•	🔐 JWT Authentication
	•	🗄️ Entity Framework Core
	•	🛢️ SQL Database (configurable)

# 🛠️ Frontend Installation (React + Bun)

Before starting, ensure Bun is installed:
https://bun.sh/

Installation steps:
# Clone the project
git clone https://github.com/miage-amiens-organization/2024_M1_PRO-05_GR10.git

# Enter the frontend project folder
cd FrontEnd/myapp

# Install project dependencies
bun install

# Add project-specific dependencies
bun add date-fns
bun add @radix-ui/react-slot
bun add @radix-ui/react-popover
bun add react-calendar

# Start the frontend : 
bun run dev


# 🛠️ Backend Installation (.NET Core 8)

Requirements:
	•	.NET 8 SDK
	•	MySql DB 

# Restore dependencies
dotnet restore

# Apply EF Core migrations (if configured)
dotnet ef database update

# Run the API
dotnet run

# ✨ Main Features : 
	•	🔍 Property search and filtering
	•	🏠 Listing creation and management
	•	🗓️ Calendar availability + date picker
	•	👤 User accounts & authentication
	•	💬 Booking management
	•	⭐ Ratings & reviews

# 🧼 Clean Architecture Overview

The backend applies a layered architecture:

	•	Domain → core business logic and entities
	•	Application → use cases, interfaces, validation
	•	Infrastructure → EF Core, data access, external services
	•	API → controllers, endpoints, authentication

# 📚 Documentation & Resources

This section aggregates all key project deliverables for analysis, planning, and design.

# 📘 Database Schema (MCD)

<img width="1005" height="571" alt="image" src="https://github.com/user-attachments/assets/e0c28474-94ff-4f02-861c-eff65b8a490d" />


# 📙 Non-Functional Specification Document 

[Milestone1_GR10-3.pdf](https://github.com/user-attachments/files/23744735/Milestone1_GR10-3.pdf)

# 📗 Functional Specification Document 

[rendu grp10 milestone 2 walid adnane aicha thierno.pdf](https://github.com/user-attachments/files/23744742/rendu.grp10.milestone.2.walid.adnane.aicha.thierno.pdf)

# 📒 Design Report 

[Milestone 3 GR10.pdf](https://github.com/user-attachments/files/23744756/Milestone.3.GR10.pdf)






