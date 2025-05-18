# Rocketry Box

A modern React application with a clean API structure and custom hooks for data fetching.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── hooks/              # Custom React hooks
│   ├── useFetchUsers.ts
│   └── useGetPosts.ts
├── services/           # API services
│   └── api/
│       └── index.ts    # Axios instance and interceptors
├── types/              # TypeScript type definitions
│   └── api.ts         # API-related interfaces
└── utils/             # Utility functions
```

## API Structure

The application uses a clean API structure with the following features:

- Centralized API configuration using Axios
- Custom hooks for data fetching with loading and error states
- TypeScript interfaces for type safety
- Proper error handling and authentication
- Pagination support

### Custom Hooks

The application includes several custom hooks for data fetching:

- `useFetchUsers`: Fetches user data with loading and error states
- `useGetPosts`: Fetches posts with pagination support

Each hook follows the same pattern:
- Loading state management
- Error handling
- Data fetching
- Type safety with TypeScript
- Proper cleanup in useEffect

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your API configuration:
```
REACT_APP_API_URL=your_api_url_here
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

The following endpoints are expected to be implemented on the backend:

- `GET /api/users` - Fetch users
- `GET /api/posts` - Fetch posts with pagination
- Additional endpoints to be added as needed

## Development

When adding new features:

1. Define types in `src/types/api.ts`
2. Create API service functions in `src/services/api/`
3. Create custom hooks in `src/hooks/`
4. Use the hooks in your components

## Best Practices

- Always use TypeScript interfaces for API responses
- Handle loading and error states in components
- Use proper error boundaries
- Implement proper authentication handling
- Follow React best practices for hooks and components
