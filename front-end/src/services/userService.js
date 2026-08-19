import api from "./api.js";

// Busca a lista completa de usuários
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Cadastra um novo usuário { name, email }
export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

// Atualiza um usuário existente pelo nome
export const updateUser = async (name, userData) => {
  const response = await api.put(
    `/users/${encodeURIComponent(name)}`,
    userData,
  );
  return response.data;
};

// Deleta um usuário pelo nome
export const deleteUser = async (name) => {
  const response = await api.delete(`/users/${encodeURIComponent(name)}`);
  return response.data;
};
