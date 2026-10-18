import { getDemoMessage } from "./message";

describe("getDemoMessage", () => {
  it("returns a non-empty message that mentions todo", () => {
    const message = getDemoMessage();

    expect(message.length).toBeGreaterThan(0);
    expect(message.toLowerCase()).toContain("todo");
  });
});
