const API_URL = "https://6784cca11ec630ca33a5b6f4.mockapi.io/user";

class Product {
  constructor(id, title, price, description, image) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
  }

  render() {
    const productContainer = document.getElementById("product-container");
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${this.image}" alt="${this.title}" />
      <h2>${this.title}</h2>
      <p>${this.description}</p>
      <p><strong>Price:</strong> ${this.price}JD</p>
      <button id="update" onclick="promptUpdate(${this.id})">Update</button>
      <button id="delete" onclick="deleteProduct(${this.id})">Delete</button>
    `;
    productContainer.appendChild(card);
  }
}

async function fetchAndRenderProducts() {
  const response = await fetch(API_URL);
  const data = await response.json();

  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";

  data.forEach((productData) => {
    const product = new Product(
      productData.id,
      productData.title,
      productData.price,
      productData.description,
      productData.image
    );
    product.render();
  });
}

function promptUpdate(id) {
  const newTitle = prompt("Enter the new title for the product:");
  if (newTitle) {
    updateProductTitle(id, newTitle);
    alert("The product title has been update successfully. ")
  }
}

async function updateProductTitle(id, newTitle) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTitle,
    }),
  });
  const updatedProduct = await response.json();
  console.log("Updated Product:", updatedProduct);
  fetchAndRenderProducts(); 
}

async function deleteProduct(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  console.log(`Product with ID ${id} deleted`);
  fetchAndRenderProducts(); 
}


function promptCreateProduct() {
  const title = prompt("Enter the product title:");
  const price = prompt("Enter the product price:");
  const description = prompt("Enter the product description:");
  const image = prompt("Enter the product image URL:");

  if (title && price && description && image) {
    createProduct(title, parseFloat(price), description, image);
    alert("The product has been added successfully. ");
  } else {
    alert("All fields are required to create a product.");
  }
}


async function createProduct(title, price, description, image) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      price,
      description,
      image,
    }),
  });
  const newProduct = await response.json();
  console.log("New Product Created:", newProduct);
  fetchAndRenderProducts(); 
}


document.addEventListener("DOMContentLoaded", () => {
  const createButton = document.getElementById("create-button");
  createButton.addEventListener("click", promptCreateProduct);

  fetchAndRenderProducts();
});
