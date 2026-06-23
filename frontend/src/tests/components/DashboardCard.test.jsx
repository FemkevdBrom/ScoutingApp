import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardCard from "../../components/DashboardCard/DashboardCard";

describe("DashboardCard", () => {

    const mockClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders title", () => {

        render(
            <DashboardCard
                title="Mijn Dashboard"
                items={[]}
            />
        );

        expect(
            screen.getByText("Mijn Dashboard")
        ).toBeInTheDocument();

    });

    test("shows message when there are no items", () => {

        render(
            <DashboardCard
                title="Dashboard"
                items={[]}
            />
        );

        expect(
            screen.getByText("Geen items")
        ).toBeInTheDocument();

    });

    test("does not show empty message when items exist", () => {

        render(
            <DashboardCard
                title="Dashboard"
                items={[
                    {
                        title: "Welpen"
                    }
                ]}
            />
        );

        expect(
            screen.queryByText("Geen items")
        ).not.toBeInTheDocument();

    });

    test("renders one item", () => {

        render(
            <DashboardCard
                title="Dashboard"
                items={[
                    {
                        title: "Welpen"
                    }
                ]}
            />
        );

        expect(
            screen.getByText("Welpen")
        ).toBeInTheDocument();

    });

    test("renders multiple items", () => {

        render(
            <DashboardCard
                title="Dashboard"
                items={[
                    {
                        title: "Welpen"
                    },
                    {
                        title: "Scouts"
                    },
                    {
                        title: "Explorers"
                    }
                ]}
            />
        );

        expect(screen.getByText("Welpen")).toBeInTheDocument();
        expect(screen.getByText("Scouts")).toBeInTheDocument();
        expect(screen.getByText("Explorers")).toBeInTheDocument();

    });

    test("renders subtitle when provided", () => {

        render(
            <DashboardCard
                title="Dashboard"
                items={[
                    {
                        title: "Welpen",
                        subtitle: "Groep 1"
                    }
                ]}
            />
        );

        expect(
            screen.getByText("Groep 1")
        ).toBeInTheDocument();

    });

    test("does not render subtitle when not provided", () => {

        render(
            <DashboardCard
                title="Dashboard"
                items={[
                    {
                        title: "Welpen"
                    }
                ]}
            />
        );

        expect(
            screen.queryByText("Groep 1")
        ).not.toBeInTheDocument();

    });

    test("calls onClick when item is clicked", () => {

        render(
            <DashboardCard
                title="Dashboard"
                items={[
                    {
                        title: "Welpen",
                        onClick: mockClick
                    }
                ]}
            />
        );

        fireEvent.click(
            screen.getByText("Welpen")
        );

        expect(mockClick).toHaveBeenCalledTimes(1);

    });

    test("applies background color", () => {

        render(
            <DashboardCard
                title="Dashboard"
                items={[
                    {
                        title: "Welpen",
                        color: "#ff0000"
                    }
                ]}
            />
        );

        const item = screen.getByText("Welpen").closest(".card-item");

        expect(item).toHaveStyle({
            backgroundColor: "#ff0000"
        });

    });

});