import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GroupInfo from './GroupInfo';

const mockInfo = {
    description: "Dit is een leuke scoutinggroep",
    email: "welpen@scouting.nl",
    groupType: "WELPEN",
    groupStatus: "ACTIVE",
    groupAge: "7-11 jaar",
    scoutingGroup: "Scouting"
};

test('renders group information correctly', () => {
    render(<GroupInfo info={mockInfo} />);

    expect(screen.getByText('Groepsinformatie')).toBeInTheDocument();
    expect(screen.getByText('Dit is een leuke scoutinggroep')).toBeInTheDocument();
    expect(screen.getByText('welpen@scouting.nl')).toBeInTheDocument();
    expect(screen.getByText('Welpen')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
});

test('shows default message when no info is provided', () => {
    render(<GroupInfo info={null} />);
    expect(screen.getByText('Geen groepsinformatie')).toBeInTheDocument();
});

test('handles missing values with "-"', () => {
    const incompleteInfo = {
        description: "",
        email: null,
        groupType: null,
        groupStatus: "ACTIVE",
        groupAge: null,
        scoutingGroup: null
    };

    render(<GroupInfo info={incompleteInfo} />);

    // Flexibeler testen omdat tekst in <strong> + tekst zit
    expect(screen.getByText(/Beschrijving:/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/Type:/i)).toBeInTheDocument();
    expect(screen.getByText(/Leeftijdsgroep:/i)).toBeInTheDocument();
    expect(screen.getByText(/Scoutinggroep:/i)).toBeInTheDocument();

    // Check dat "-" verschijnt
    const dashElements = screen.getAllByText('-');
    expect(dashElements.length).toBeGreaterThan(1);
});