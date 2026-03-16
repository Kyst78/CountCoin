import type { APIError, State } from "~/types";

export default () => {
  const state = useState<State>("appState", () => ({
    isLoading: false,
    appError: null,
    isConfirmModalVisible: false,
  }));

  const toast = useToast();

  const isLoading = computed(() => state.value.isLoading);
  const appError = computed(() => state.value.appError);
  const isConfirmModalVisible = computed(
    () => state.value.isConfirmModalVisible
  );

  const toggleLoading = (v: boolean) => {
    state.value.isLoading = v;
  };

  const toggleAlertModal = (v: boolean) => {
    state.value.isConfirmModalVisible = v;
  };

  const toggleError = (error: null | APIError) => {
    state.value.appError = error;
  };

  const showMessage = (content: { title: string; description?: string }) => {
    toast.add({
      title: content.title,
      description: content.description,
      color: "primary",
    });
  };

  const showError = (error: APIError) => {
    toast.add({
      title: error.statusCode + "",
      description: error.message ? error.message : error.statusMessage,
      color: "red",
    });
  };

  return {
    isLoading,
    appError,
    isConfirmModalVisible,
    showError,
    toggleLoading,
    toggleAlertModal,
    toggleError,
    showMessage,
  };
};
