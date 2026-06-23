import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Layout from "../../components/Layout";

jest.mock("../../components/Header/Header", () => () => (
    <div data-testid="header">Header</div>
));

describe("Layout", () => {

    test("renders the header", () => {

        render(
            <Layout>
                <div>Pagina inhoud</div>
            </Layout>
        );

        expect(
            screen.getByTestId("header")
        ).toBeInTheDocument();

    });

    test("renders children", () => {

        render(
            <Layout>
                <div>Pagina inhoud</div>
            </Layout>
        );

        expect(
            screen.getByText("Pagina inhoud")
        ).toBeInTheDocument();

    });

    test("renders header before children", () => {

        render(
            <Layout>
                <div data-testid="content">Pagina inhoud</div>
            </Layout>
        );

        const header = screen.getByTestId("header");
        const content = screen.getByTestId("content");

        expect(
            header.compareDocumentPosition(content) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();

    });

    test("renders multiple children", () => {

        render(
            <Layout>
                <div>Eerste</div>
                <div>Tweede</div>
            </Layout>
        );

        expect(
            screen.getByText("Eerste")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Tweede")
        ).toBeInTheDocument();

    });

    test("renders without children", () => {

        render(<Layout />);

        expect(
            screen.getByTestId("header")
        ).toBeInTheDocument();

    });

});