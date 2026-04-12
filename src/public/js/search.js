document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const grid = document.querySelector(".grid");

  if (!input || !grid) return;

  input.addEventListener("input", async () => {
    const keyword = input.value.trim();

    // If search box is empty → reload full list
    if (!keyword) {
      window.location.href = "/home";
      return;
    }

    const res = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            searchProducts(keyword: "${keyword}") {
              title
              price
              category
              image
            }
          }
        `
      })
    });

    const json = await res.json();
    const products = json.data.searchProducts;

    // 🔴 IMPORTANT: clear existing products
    grid.innerHTML = "";

    if (!products.length) {
      grid.innerHTML = `<p class="muted">No results found</p>`;
      return;
    }

    products.forEach(p => {
      grid.innerHTML += `
        <div class="card">
          ${p.image ? `<img src="${p.image}" />` : ""}
          <strong>${p.title}</strong>
          <div class="price">₹${p.price}</div>
          <div class="muted">${p.category}</div>
        </div>
      `;
    });
  });
});
