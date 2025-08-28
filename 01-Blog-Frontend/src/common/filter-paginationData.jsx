import axios from "axios";

export const FilterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
}) => {
  try {
    let obj;

    if (state != null && !create_new_arr) {
      obj = { ...state, results: [...state.results, ...data], page: page };
    } else {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + countRoute,
        data_to_send
      );
      const { totalDocs } = response.data;

      obj = {
        results: data,
        page: 1,
        totalDocs,
      };
    }
    return obj;
  } catch (error) {
    console.error("Error in FilterPaginationData:", error.message);
    return {
      results: [],
      page: 1,
      totalDocs: 0,
      error: true,
    };
  }
};
