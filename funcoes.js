document.addEventListener("DOMContentLoaded", () => {
  const jsonUrl = "itens.json"; // URL do arquivo JSON

  // Verifica se o elemento main existe
  const mainElement = document.querySelector(".main");
  if (!mainElement) {
    console.error("O elemento <main> com a classe 'main' não foi encontrado.");
    return;
  }

  fetch(jsonUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro ao carregar o JSON. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Verifica se os dados estão corretos
      if (!Array.isArray(data) || data.length === 0) {
        console.error("O JSON carregado está vazio ou não é um array.");
        return;
      }

      mainElement.innerHTML = ""; // Limpa o conteúdo atual do main

      data.forEach(item => {
        // Verifica se os campos esperados existem
        if (!item.nome || typeof item.valor !== "number") {
          console.warn("Item inválido encontrado no JSON:", item);
          return;
        }

        // Cria um elemento <img> para cada item no JSON
        const imgElement = document.createElement("img");
        imgElement.src = `https://dummyimage.com/400x400/f56ee8/000.png&text=${encodeURIComponent(item.nome)}+R$${item.valor.toFixed(2)}`;
        imgElement.alt = item.nome;

        mainElement.appendChild(imgElement); // Adiciona a imagem ao main
      });
    })
    .catch(error => {
      console.error("Erro ao carregar ou processar o JSON:", error);
    });
});
