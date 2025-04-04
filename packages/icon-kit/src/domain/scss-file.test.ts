import { test, expect } from "vitest";
import { SCSSFile } from "./scss-file.js";

test("creates a bare-bones scss files", () => {
  // ARRANGE
  const subject = new SCSSFile();

  // ACT
  const result = subject.toString();

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    "// This file is auto-generated by meteor-icon-kit."
  `);
});

test("creates a css file with content", () => {
  // ARRANGE
  const subject = new SCSSFile();
  subject.addIcon("my-icon", {
    width: "24px",
    height: "24px",
  });

  // ACT
  const result = subject.toString();

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    "// This file is auto-generated by meteor-icon-kit.
    #meteor-icon-kit {
      &__my-icon {
        width: 24px;
        height: 24px;
      }
    }"
  `);
});

test("sorts the id's for the icons in alphabetical order", () => {
  // ARRANGE
  const subject = new SCSSFile();
  subject.addIcon("b", {
    width: "24px",
    height: "24px",
  });

  subject.addIcon("a", {
    width: "24px",
    height: "24px",
  });

  // ACT
  const result = subject.toString();

  // ASSSERT
  expect(result).toMatchInlineSnapshot(`
    "// This file is auto-generated by meteor-icon-kit.

    #meteor-icon-kit {
      &__a {
        width: 24px;
        height: 24px;
      }

      &__b {
        width: 24px;
        height: 24px;
      }
    }"
  `);
});
