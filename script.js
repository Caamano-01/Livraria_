/*********************** PESQUISA *******************************/
document.addEventListener('DOMContentLoaded', () => {
  const searchIcon = document.getElementById('search-icon');
  const searchBox = document.querySelector('.search-box');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const carouselTrack = document.querySelector('.carousel-track');
  const loadMoreBtn = document.getElementById('load-more-btn');

  // Variável global para carrinho
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Função para salvar carrinho no localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // Função para renderizar carrinho no carrossel (se tiver container)
  const renderCart = () => {
    const container = document.getElementById("cart-items");
    const totalSpan = document.getElementById("cart-total");
    if (!container || !totalSpan) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const linha = document.createElement("div");
      linha.classList.add("cart-item");
      linha.innerHTML = `
        <span>${item.title}</span>
        <span>R$ ${(item.price * item.qtd).toFixed(2)} x ${item.qtd}</span>
      `;
      container.appendChild(linha);
      total += item.price * item.qtd;
    });

    totalSpan.innerText = total.toFixed(2);
  };

  // Função para adicionar livro ao carrinho
  const addToCart = (book) => {
    const existing = cart.find(item => item.key === book.key);
    if (existing) {
      existing.qtd += 1;
    } else {
      cart.push({ ...book, qtd: 1 });
    }
    saveCart();
    renderCart();
    alert(`"${book.title}" adicionado ao carrinho!`);
  };

  // Função para buscar livros por título da API Open Library.
  const searchBooksByTitle = async (query) => {
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      return data.docs;
    } catch (error) {
      console.error('Erro ao buscar livros por título:', error);
      return [];
    }
  };

  // Função para criar um card de livro
  const createBookCard = (book) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    const coverId = book.cover_edition_key || book.cover_i || null;
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/olid/${coverId}-M.jpg`
      : 'https://via.placeholder.com/200x300?text=Sem+Capa';

    const price = parseFloat((Math.random() * (50 - 15) + 15).toFixed(2));

    bookCard.innerHTML = `
      <img src="${coverUrl}" alt="Capa do livro">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-price">R$ ${price}</p>
      <button class="add-to-cart-btn" style="display:none;">Adicionar ao carrinho</button>
    `;

    // Mostrar/ocultar botão ao clicar no card
    bookCard.addEventListener('click', () => {
      const btn = bookCard.querySelector('.add-to-cart-btn');
      btn.style.display = btn.style.display === 'none' ? 'block' : 'none';
    });

    // Clique no botão para adicionar ao carrinho
    const addToCartBtn = bookCard.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart({
        key: book.key || coverId || book.title, // chave única para o livro
        title: book.title,
        price: price
      });
    });

    return bookCard;
  };

  // Clique no ícone de lupa para abrir a caixa de busca
  searchIcon.addEventListener('click', (event) => {
    event.preventDefault();
    searchBox.classList.toggle('visible');
    if (searchBox.classList.contains('visible')) {
      searchInput.value = '';
      searchInput.focus();
    }
  });

  // Clique no botão de busca
  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // Limpa carrossel
    carouselTrack.innerHTML = '';

    // Busca livros
    const books = await searchBooksByTitle(query);

    if (books.length > 0) {
      books.forEach(book => {
        const bookCard = createBookCard(book);
        carouselTrack.appendChild(bookCard);
      });

      // Oculta botão "Mais livros"
      loadMoreBtn.style.display = 'none';
      searchBox.classList.remove('visible');
    } else {
      carouselTrack.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum livro encontrado para sua busca.</p>';
    }
  });

  // Inicializa a renderização do carrinho ao carregar a página
  renderCart();
});
/****************************************************************/

/************************* CARROSSEL ******************************/
document.addEventListener('DOMContentLoaded', () => {
  const carouselTrack = document.querySelector('.carousel-track');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const subject = 'portuguese';

  let currentIndex = 0;
  const itemsPerPage = 4;
  let page = 1;

  // Usar a mesma variável global cart do script anterior
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const renderCart = () => {
    const container = document.getElementById("cart-items");
    const totalSpan = document.getElementById("cart-total");
    if (!container || !totalSpan) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const linha = document.createElement("div");
      linha.classList.add("cart-item");
      linha.innerHTML = `
        <span>${item.title}</span>
        <span>R$ ${(item.price * item.qtd).toFixed(2)} x ${item.qtd}</span>
      `;
      container.appendChild(linha);
      total += item.price * item.qtd;
    });

    totalSpan.innerText = total.toFixed(2);
  };

  const addToCart = (book) => {
    const existing = cart.find(item => item.key === book.key);
    if (existing) {
      existing.qtd += 1;
    } else {
      cart.push({ ...book, qtd: 1 });
    }
    saveCart();
    renderCart();
    alert(`"${book.title}" adicionado ao carrinho!`);
  };

  const fetchBooks = async (page) => {
    try {
      const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=10&offset=${(page - 1) * 10}`);
      const data = await response.json();
      return data.works;
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      return [];
    }
  };

  const createBookCard = (book) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    const coverId = book.cover_edition_key || book.cover_i || null;
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/olid/${coverId}-M.jpg`
      : 'https://via.placeholder.com/200x300?text=Sem+Capa';

    const price = parseFloat((Math.random() * (50 - 15) + 15).toFixed(2));

    bookCard.innerHTML = `
      <img src="${coverUrl}" alt="Capa do livro">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-price">R$ ${price}</p>
      <button class="add-to-cart-btn" style="display:none;">Adicionar ao carrinho</button>
    `;

    bookCard.addEventListener('click', () => {
      const btn = bookCard.querySelector('.add-to-cart-btn');
      btn.style.display = btn.style.display === 'none' ? 'block' : 'none';
    });

    const addToCartBtn = bookCard.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart({
        key: book.key || coverId || book.title,
        title: book.title,
        price: price
      });
    });

    return bookCard;
  };

  const updateCarouselPosition = () => {
    if (!document.querySelector('.book-card')) return; // evita erro se não tiver livros
    const itemWidth = document.querySelector('.book-card').offsetWidth + 20;
    const offset = -currentIndex * itemWidth;
    carouselTrack.style.transform = `translateX(${offset}px)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= carouselTrack.children.length - itemsPerPage;
  };

  const renderBooks = async () => {
    const books = await fetchBooks(1);

    books.forEach(book => {
      const bookCard = createBookCard(book);
      carouselTrack.appendChild(bookCard);
    });

    updateCarouselPosition();
    renderCart();
  };

  nextButton.addEventListener('click', () => {
    if (currentIndex < carouselTrack.children.length - itemsPerPage) {
      currentIndex++;
      updateCarouselPosition();
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarouselPosition();
    }
  });

  loadMoreBtn.addEventListener('click', async () => {
    page++;
    const newBooks = await fetchBooks(page);
    if (newBooks.length > 0) {
      newBooks.forEach(book => {
        const bookCard = createBookCard(book);
        carouselTrack.appendChild(bookCard);
      });
    } else {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'Sem mais livros';
    }
    updateCarouselPosition();
  });

  renderBooks();
});
/****************************************************************/

/***************** VALIDAÇÃO DE EMAIL **************************/
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.newsletter-form');
  const input = form.querySelector('input[type="email"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o envio tradicional do formulário

    const email = input.value.trim();

    // Validação simples de email
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email) {
      alert('Por favor, insira seu e-mail.');
    } else if (!emailValido) {
      alert('Por favor, insira um e-mail válido.');
    } else {
      alert('Assinatura feita com sucesso.');
      input.value = ''; // limpa o campo após o envio
    }
  });
});

/***************************************************************/

/********************** PÁGINA DE COMPRAS ***********************/
document.addEventListener('DOMContentLoaded', () => {
  const checkoutItemsContainer = document.getElementById('checkout-cart-items');
  const checkoutTotal = document.getElementById('checkout-cart-total');
  const buyButton = document.getElementById('buy-button');
  const qrSection = document.getElementById('qrcode-section');
  const qrImage = document.getElementById('qrcode-img');

  // 1. Carregar e exibir itens do carrinho
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML = '<p>Nenhum item no carrinho.</p>';
  } else {
    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');

      itemElement.innerHTML = `
        <span class="cart-item-title">${item.title}</span>
        <span class="cart-item-price">R$ ${(item.price * item.qtd).toFixed(2)} x ${item.qtd}</span>
      `;

      checkoutItemsContainer.appendChild(itemElement);
    });

    // 2. Atualizar o total
    const total = cart.reduce((sum, item) => sum + item.price * item.qtd, 0);
    checkoutTotal.textContent = total.toFixed(2);
  }

  // 3. Geração do QR Code
  buyButton.addEventListener('click', () => {
    alert('Após o pagamento será realizado o pedido.');

    const paymentInfo = "https://seudominio.com/pagamento?id=12345";
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentInfo)}`;

    qrSection.style.display = 'block';
    qrSection.scrollIntoView({ behavior: 'smooth' });

    // 4. Limpa o carrinho ao sair da página
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('cart');
    });
  });
});

/*************** TEMA ESCURO  **************/
const toggleButton = document.getElementById('dark-mode-toggle');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
      updateButtonIcon();
    });

  function updateButtonIcon() {
      if (document.body.classList.contains('dark-mode')) {
        toggleButton.style.backgroundColor = '#555';
      } else {
        toggleButton.style.backgroundColor = '#ffd700';
      }
  }

  // Ao carregar, aplica tema salvo
  window.addEventListener('load', () => {
      if (localStorage.getItem('theme') === 'dark') {
          document.body.classList.add('dark-mode');
      }
      updateButtonIcon();
});
