import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtEmailFieldMeta, type MtEmailFieldStory } from "./mt-email-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-email-field",
} as MtEmailFieldMeta;

export const VisualTestPrefix: MtEmailFieldStory = {
  name: "Should display prefix",
  args: {
    prefix: "prefix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  },
};

export const VisualTestSuffix: MtEmailFieldStory = {
  name: "Should display suffix",
  args: {
    suffix: "suffix",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestHint: MtEmailFieldStory = {
  name: "Should display hint",
  args: {
    hint: "hint",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestDisabled: MtEmailFieldStory = {
  name: "Should disable",
  args: {
    disabled: true,
    modelValue: "Shopware",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "1337");

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Shopware");
  },
};

export const TestPlaceholder: MtEmailFieldStory = {
  name: "Should display placeholder",
  args: {
    placeholder: "Placeholder",
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByPlaceholderText(args.placeholder)).toBeDefined();
  },
};

export const VisualTestError: MtEmailFieldStory = {
  name: "Should display error",
  args: {
    error: { code: 500, detail: "Error while saving!" },
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.error.detail)).toBeDefined();
  },
};

export const VisualTestSmall: MtEmailFieldStory = {
  name: "Should display small",
  args: {
    small: true,
  },
};

export const TestShouldCopyValue: MtEmailFieldStory = {
  name: "Should copy value",
  args: {
    modelValue: "test@shopware.com",
    copyable: true,
  },
  async play() {
    await userEvent.tab();
    await userEvent.tab();

    await userEvent.keyboard("{Enter}");
  },
};

export const VisualTestLinkedInheritanec: MtEmailFieldStory = {
  name: "Linked inheritance",
  args: {
    isInheritanceField: true,
    isInherited: true,
    modelValue: "test@shopware.com",
  },
};

export const VisualTestUnlinkedInheritance: MtEmailFieldStory = {
  name: "Unlinked inheritance",
  args: {
    isInheritanceField: true,
    isInherited: false,
    modelValue: "test@shopware.com",
  },
};
