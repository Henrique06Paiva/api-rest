import api from "./api.js";

// Busca a lista completa de produtos
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Cadastra um novo produto { name, price }
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

// Atualiza o preço de um produto existente pelo nome
export const updateProduct = async (name, productData) => {
  const response = await api.put(
    `/products/${encodeURIComponent(name)}`,
    productData,
  );
  return response.data;
};

// Deleta um produto pelo nome
export const deleteProduct = async (name) => {
  const response = await api.delete(`/products/${encodeURIComponent(name)}`);
  return response.data;
};
