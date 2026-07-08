import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WalletForm } from "./WalletForm";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/wallet/metamask", () => ({
  hasBrowserWallet: () => false,
  getBrowserWalletName: () => "browser wallet",
  connectBrowserWalletAddress: vi.fn(),
}));

describe("WalletForm", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("shows guidance when no browser wallet is detected", () => {
    render(<WalletForm />);

    expect(screen.getByText("No browser wallet detected")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "MetaMask" })).toHaveAttribute(
      "href",
      "https://metamask.io/download/",
    );
  });

  it("validates invalid addresses before navigating", async () => {
    const user = userEvent.setup();
    render(<WalletForm />);

    await user.type(screen.getByPlaceholderText("0x..."), "not-an-address");
    await user.click(screen.getByRole("button", { name: /Analyze/i }));

    expect(
      screen.getByText("That doesn't look like a valid Ethereum address."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("navigates to the wallet dashboard for a valid address", async () => {
    const user = userEvent.setup();
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    render(<WalletForm />);

    await user.type(screen.getByPlaceholderText("0x..."), address);
    await user.click(screen.getByRole("button", { name: /Analyze/i }));

    expect(push).toHaveBeenCalledWith(`/dashboard/${address}?chain=all`);
  });
});
