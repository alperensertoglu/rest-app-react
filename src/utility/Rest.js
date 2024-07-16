import axios from "axios";

const LOGIN_URL = "http://localhost:8080/rest/prsaccount/v1/auth/login";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function getAllFormCount() {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/rest/prsform/v1/form/forms`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching forms:", error.message);
  }
}

export async function createForm(data) {
  try {
    const response = await axiosInstance.post(
      `http://localhost:8080/rest/prsform/v1/form/create`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Form oluşturulurken hata!", error);
  }
}

export async function editForm(formid, formData) {
  try {
    const response = await axiosInstance.put(
      `http://localhost:8080/rest/prsform/v1/form/edit/${formid}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Edit yapılırken hata!", error);
  }
}

export async function deleteForm(formid) {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:8080/rest/prsform/v1/form/delete-form/${formid}`
    );
    return response.data;
  } catch (error) {
    console.error("Form silinirken hata!", error);
  }
}

export async function searchForm(title) {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/rest/prsform/v1/form/search?title=${title}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching forms:", error);
  }
}

export async function paginationForm(pageNum, pageSize, Title) {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/rest/prsform/v1/form/pageNum?pageNum=${pageNum}&pageSize=${pageSize}&Title=${Title}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated forms:", error);
  }
}

export async function login(username, password) {
  try {
    const response = await axiosInstance.post(
      LOGIN_URL,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          username: username,
          password: password,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function getColumns() {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/rest/prsform/v1/form/columns`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated forms:", error);
  }
}
// ----------------------- Client --------------------------

export async function getClientCount() {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/rest/prsform/v1/client/client-count`
    );
    console.log("Client Count: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching forms:", error.message);
  }
}

export async function createClient(data) {
  try {
    const response = await axiosInstance.post(
      `http://localhost:8080/rest/prsform/v1/client/create-client`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Form oluşturulurken hata!", error);
  }
}

export async function editClient(clientid, clientData) {
  try {
    const response = await axiosInstance.put(
      `http://localhost:8080/rest/prsform/v1/client/edit-client/${clientid}`,
      clientData
    );
    return response.data;
  } catch (error) {
    console.error("Edit yapılırken hata!", error);
  }
}

export async function deleteClient(clientid) {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:8080/rest/prsform/v1/client/delete-client/${clientid}`
    );
    return response.data;
  } catch (error) {
    console.error("Form silinirken hata!", error);
  }
}

export async function paginationClient(pageNum, pageSize, Title) {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/rest/prsform/v1/client/pagination-client?pageNum=${pageNum}&pageSize=${pageSize}&Title=${Title}`
    );
    console.log("pagination client: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated forms:", error);
  }
}
