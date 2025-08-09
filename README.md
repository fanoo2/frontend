# Fanoo Frontend

A modern React-based frontend application for the Fanoo platform, built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Component Library** with Radix UI primitives
- **Real-time Communication** with WebRTC support
- **State Management** with TanStack Query
- **Testing** with Jest and Playwright
- **Linting** with ESLint and Prettier

## 📋 Prerequisites

- Node.js 20 or higher
- npm or yarn package manager

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/fanoo2/frontend.git
cd frontend

# Install dependencies
npm install
```

## 🏃‍♂️ Usage

### Development
```bash
# Start development server
npm run dev

# Run with type checking
npm run check
```

### Building
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

### Linting
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=https://api.fanoo.com
VITE_API_KEY=your-api-key

# LiveKit Configuration (for WebRTC)
VITE_LIVEKIT_API_KEY=your-livekit-api-key
VITE_LIVEKIT_API_SECRET=your-livekit-api-secret
VITE_LIVEKIT_WS_URL=wss://your-livekit-url

# Feature Flags
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_MODERATION=true
```

## 📚 API Endpoints

The application communicates with the following main API endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/auth/login` - User authentication
- `GET /api/agents` - List agents
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `POST /api/sessions` - Create session
- `GET /api/sessions/:id` - Get session details

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   └── ...             # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
├── sdk/                # Generated SDK models
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🧪 Examples

### Creating a New Agent
```typescript
import { useCreateAgent } from '@/hooks/use-agents';

const { mutate: createAgent } = useCreateAgent();

createAgent({
  name: 'My Agent',
  description: 'Agent description',
  type: 'chat'
});
```

### Using WebRTC Client
```typescript
import { useWebRTC } from '@fanno/webrtc-client';

const { connect, disconnect, participants } = useWebRTC({
  token: 'your-livekit-token',
  url: 'wss://your-livekit-url'
});
```

## 🚀 Deployment

### Docker
```bash
# Build Docker image
docker build -t fanoo-frontend .

# Run container
docker run -p 3000:3000 fanoo-frontend
```

### Static Hosting
```bash
# Build for production
npm run build

# Deploy the 'dist' folder to your static hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔍 Monitoring

The application exposes metrics for monitoring:

- Health check: `GET /health`
- Metrics endpoint: `GET /metrics` (if Prometheus monitoring is enabled)

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.