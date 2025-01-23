import { userEvent } from "@storybook/test";
import { render, screen } from "@testing-library/vue";
import { defineComponent } from "vue";
import MtContextButton from "./mt-context-button/mt-context-button.vue";

describe("mt-context-menu", async () => {
  it("is possible to focus the button that opens the context menu", async () => {
    // ARRANGE
    render(
      defineComponent({
        template: `
<mt-context-button>
    <template #button-text>
        Open context menu
    </template>
</mt-context-button>
        `,
        components: {
          MtContextButton,
        },
      }),
    );

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("is possible to open the context menu by clicking on the button", async () => {
    // ARRANGE
    render(
      defineComponent({
        template: `
<mt-context-button>
    <template #button-text>
        Open context menu
    </template>
</mt-context-button>
        `,
        components: {
          MtContextButton,
        },
      }),
    );

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});
