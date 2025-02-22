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

        const card = document.createElement("div");
        card.classList.add("product-card");

        
        const imgElement = document.createElement("img");
        imgElement.src = `img/img-products/${item.codigo}.jpg`
        imgElement.alt = item.nome;
        imgElement.style.cursor = "pointer";

        const info = document.createElement("div");
        info.classList.add("product-info");
        info.innerHTML = `<h3>${item.nome}</h3><p>R$ ${item.valor.toFixed(2)}</p>`;

        const select = document.createElement("select");
        select.classList.add("quantity-select");
        for (let i = 1; i <= item.quantidadeDisponivel; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = i;
          select.appendChild(option);
        }

        const button = document.createElement("button");
        button.classList.add("add-to-cart");
        button.textContent = "Adicionar ao Carrinho";
        button.addEventListener("click", () => {
          let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
          
          const novoItem = {
            codigo: item.codigo,
            quantidade: parseInt(select.value, 10) || 1
          };
        
          // Verifica se o item já está no carrinho
          const itemExistente = carrinho.find(produto => produto.codigo === novoItem.codigo);
        
          if (itemExistente) {
            // Se já existe, apenas atualiza a quantidade
            itemExistente.quantidade += novoItem.quantidade;
          } else {
            // Se não existe, adiciona ao carrinho
            carrinho.push(novoItem);
          }
        
          // Salva no localStorage
          localStorage.setItem('carrinho', JSON.stringify(carrinho));
        
          //console.log(`Adicionado: ${novoItem.codigo}, Quantidade: ${novoItem.quantidade}`);
        
          // Atualiza a contagem do carrinho
          quantidadeCarrinho();
          mostrarAviso(`${item.nome} adicionado ao carrinho!`);
        });

        card.appendChild(imgElement);
        card.appendChild(info);
        card.appendChild(select);
        card.appendChild(button);
        mainElement.appendChild(card);
        //mainElement.appendChild(imgElement); // Adiciona a imagem ao main

        
        imgElement.addEventListener("click", () => {
          // Criar modal
          const modal = document.createElement("div");
          modal.classList.add("modal");
          
          // Criar imagem grande no modal
          const modalImg = document.createElement("img");
          modalImg.src = imgElement.src;
          modalImg.classList.add("modal-img");
      
          // Adicionar imagem ao modal
          modal.appendChild(modalImg);
          document.body.appendChild(modal);
      
          // Fechar modal ao clicar fora da imagem
          modal.addEventListener("click", () => {
            modal.remove();
          });
        });


        // Adiciona a classe na imagem
        //imgElement.classList.add("produto-imagem");

        // Imagem default toda vez que o itens.json tiver um codigo que nao corresponde a uma imagem
        imgElement.onerror = () => {
          imgElement.src = `https://dummyimage.com/400x400/bbb/000.png&text=${encodeURIComponent(item.nome)}+R$${item.valor.toFixed(2)}`;
        };

        
      });
    })
    .catch(error => {
      console.error("Erro ao carregar ou processar o JSON:", error);
    });


  quantidadeCarrinho();

});

function quantidadeCarrinho() {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if(carrinho.length > 0){
    const spanElement = document.createElement('span');
    spanElement.textContent = carrinho.length
    spanElement.classList.add("cart-count")
    
    const mainElement = document.querySelector(".cart-icon");

    if(mainElement) {
      mainElement.appendChild(spanElement);
    }
  }
}

// Função para exibir o aviso flutuante
function mostrarAviso(mensagem) {
  const aviso = document.createElement("div");
  aviso.classList.add("aviso-flutuante");
  aviso.textContent = mensagem;

  document.body.appendChild(aviso);

  // Remove o aviso após 3 segundos
  setTimeout(() => {
    aviso.classList.add("desaparecendo");
    setTimeout(() => aviso.remove(), 500);
  }, 2500);
}
