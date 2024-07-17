import MtModal from "./mt-modal.vue";
import MtModalRoot from "./sub-components/mt-modal-root.vue";
import MtModalTrigger from "./sub-components/mt-modal-trigger.vue";
import MtButton from "../../form/mt-button/mt-button.vue";

export default {
  title: "Components/Overlay/mt-modal",
  component: MtModal,
  args: {
    isOpen: true,
    title: "Modal Title",
    default: "Modal content",
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtModalTrigger, MtButton },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'>Modal content<template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const Default = {};
