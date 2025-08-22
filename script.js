document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const subject = 'fantasy';
    let currentIndex = 0;
    const itemsPerPage = 4;
   
    // As funções fetchBooks e createBookCard permanecem as mesmas
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


        const coverId = book.cover_id;
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/200x300?text=Sem+Capa';
       
        const authorName = book.authors && book.authors[0] ? book.authors[0].name : 'Autor Desconhecido';
        const price = (Math.random() * (50 - 15) + 15).toFixed(2);


        bookCard.innerHTML = `
            <img src="${coverUrl}" alt="Capa do livro">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${authorName}</p>
            <p class="book-price">R$ ${price}</p>
        `;


        return bookCard;
    };
   
    // Função para atualizar a posição do carrossel
    const updateCarouselPosition = () => {
        const itemWidth = document.querySelector('.book-card').offsetWidth + 20; // Largura do card + gap
        const offset = -currentIndex * itemWidth;
        carouselTrack.style.transform = `translateX(${offset}px)`;
       
        // Habilitar/desabilitar botões de navegação
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= carouselTrack.children.length - itemsPerPage;
    };


    // Função para renderizar os livros
    const renderBooks = async () => {
        const books = await fetchBooks(1);
        books.forEach(book => {
            const bookCard = createBookCard(book);
            carouselTrack.appendChild(bookCard);
        });
        updateCarouselPosition();
    };


    // Eventos de clique para as setas
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


    // Evento para o botão "Mais livros"
    let page = 2; // Começa na segunda página após o carregamento inicial
    loadMoreBtn.addEventListener('click', async () => {
        const newBooks = await fetchBooks(page);
        if (newBooks.length > 0) {
            newBooks.forEach(book => {
                const bookCard = createBookCard(book);
                carouselTrack.appendChild(bookCard);
            });
            page++;
        } else {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Sem mais livros';
        }
        updateCarouselPosition(); // Atualiza a posição após adicionar novos livros
    });


    // Inicializa o carrossel com os primeiros livros
    renderBooks();
});
