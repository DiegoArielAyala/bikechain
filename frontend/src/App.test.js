import { render, screem} from "@testing-library/react";
import App from "./App.js";

test("renders Bikechain", () => {
    render(<App />);
    const linkElement = screem.getByText(/Bikechain/i);
    expect(linkElement).toBeInTheDocument();
});