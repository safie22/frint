# RentMate API

This is the backend API for the RentMate application, built with ASP.NET Core.

## Features

- User Authentication and Authorization
- Property Management (CRUD operations)
- Proposal Submission and Management
- Real-time Messaging
- Real-time Notifications
- File Upload and Management
- Role-Based Access Control
- Property Search and Filtering
- Saved Properties Management
- Comments System
- View Count Tracking

## Prerequisites

- .NET 9.0 SDK
- SQL Server (LocalDB or full version)
- Visual Studio 2022 or Visual Studio Code

## Setup

1. Clone the repository
2. Navigate to the project directory
3. Update the connection string in `appsettings.json` if needed
4. Run the following commands:

```bash
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
https://localhost:7001/swagger
```

## Environment Variables

The following environment variables can be configured in `appsettings.json`:

- `ConnectionStrings:DefaultConnection`: Database connection string
- `Jwt:Key`: Secret key for JWT token generation
- `Jwt:Issuer`: JWT token issuer
- `Jwt:Audience`: JWT token audience
- `FileStorage:BasePath`: Base path for file uploads
- `FileStorage:AllowedExtensions`: Allowed file extensions
- `FileStorage:MaxFileSize`: Maximum file size in bytes

## Security

- JWT-based authentication
- Role-based authorization
- Secure file upload handling
- Input validation
- SQL injection prevention
- XSS protection

## Real-time Features

The application uses SignalR for real-time features:
- Chat functionality
- Notifications
- Property status updates

## Error Handling

The API implements comprehensive error handling:
- Validation errors
- Authentication errors
- Authorization errors
- File upload errors
- Database errors

## Logging

The application uses structured logging for:
- API requests
- Authentication attempts
- File operations
- Database operations
- Error tracking 