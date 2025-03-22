# CLAUDE.md - Project Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run preview` - Preview production build locally
- `npm test` - Run all tests
- `npm test -- -t "test name"` - Run specific test

## Code Style Guidelines
- **Imports**: Group imports (1. External, 2. Components, 3. Utils/Hooks)
- **Formatting**: Use Prettier with 2-space indentation
- **Types**: Use TypeScript for all files, avoid `any` type
- **Components**: Prefer `.astro` files with minimal vue3 for interactivity
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Use try/catch for API calls with meaningful error messages
- **API Routes**: Place in `src/pages/api/` directory
- **File Structure**: Follow Astro's conventions (pages, components, layouts)
- **Security**: Hash passwords, use HTTPS, and verify user input
- **Testing**: Write tests for API routes and critical user flows
- **Deployment**: Use Vercel for deployment with Astro SSR

## Git Workflow
- Keep commits focused on single features/fixes
- Use descriptive commit messages (present tense)
- Create PR for substantial changes