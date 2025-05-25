import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock para useRouter de Next.js
jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
    }),
    usePathname: jest.fn().mockReturnValue('/'),
    useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

// Configuraciones globales adicionales
beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
});