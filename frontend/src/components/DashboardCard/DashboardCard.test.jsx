import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardCard from './DashboardCard';

const mockItems = [
    {
        title: "Welpen",
        subtitle: "12 leden",
        color: "#FF5733",
        onClick: jest.fn()
    },
    {
        title: "Scouts",
        subtitle: "8 leden",
        color: "#33FF57",
        onClick: jest.fn()
    }
];

test('renders title and items correct', () => {
    render(<DashboardCard title="Mijn Groepen" items={mockItems} />);
    expect(screen.getByText('Mijn Groepen')).toBeInTheDocument();
    expect(screen.getByText('Welpen')).toBeInTheDocument();
    expect(screen.getByText('12 leden')).toBeInTheDocument();
    expect(screen.getByText('Scouts')).toBeInTheDocument();
});

test('shows "Geen items" when items array is empty', () => {
    render(<DashboardCard title="Mijn Groepen" items={[]} />);

    expect(screen.getByText('Geen items')).toBeInTheDocument();
});

test('applies correct background color to items', () => {
    render(<DashboardCard title="Test" items={mockItems} />);

    const firstItem = screen.getByText('Welpen').closest('.card-item');
    expect(firstItem).toHaveStyle({ backgroundColor: '#FF5733' });
});

