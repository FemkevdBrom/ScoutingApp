import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from './UserProfile';
import * as UserService from '../../services/UserService';

// Mock de externe service
jest.mock('../../services/UserService');

const mockUser = {
    firstName: "Femke",
    infix: "van ",
    lastName: "Test",
    birthDate: "2010-05-15",
    age: 16,
    email: "femke@example.com",
    phone: "0612345678",
    memberNumber: "12345",
    personalNumber: "67890",
    street: "Teststraat",
    houseNumber: "42",
    city: "Eindhoven",
    zipCode: "5612 AB",
    country: "Nederland",
    groupName: "Welpen",
    memberOf: "Groep A",
    leaderOf: "Welpen"
};


test('renders user profile data after loading', async () => {
    UserService.getUserById.mockResolvedValue(mockUser);

    render(<UserProfile />);

    // Wacht tot de data geladen is
    await waitFor(() => {
        expect(screen.getByText('Femke')).toBeInTheDocument();
        expect(screen.getByText('van')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.getByText('femke@example.com')).toBeInTheDocument();
    });
});

test('shows loading state initially', () => {
    UserService.getUserById.mockResolvedValue(mockUser);
    render(<UserProfile />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
});


test('shows error message when API fails', async () => {
    UserService.getUserById.mockRejectedValue(new Error('Failed'));

    render(<UserProfile />);

    await waitFor(() => {
        expect(screen.getByText('Failed to load user')).toBeInTheDocument();
    }, { timeout: 2000 });
});