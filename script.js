document.addEventListener('DOMContentLoaded', () => {
    // Adiciona um "ouvinte de evento" que espera o documento (HTML) carregar por completo.
    // Isso garante que todos os elementos da página existam antes de o código tentar manipulá-los.

    // 1. Seleção de Elementos HTML
    // Acessa os elementos do HTML e guarda referências a eles em variáveis.
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const subject = 'fantasy'; // Define o tema dos livros a serem buscados.

    // 2. Variáveis de Estado
    // Variáveis para controlar o estado do carrossel.
    let currentIndex = 0; // O índice do primeiro item visível no carrossel.
    const itemsPerPage = 4; // Quantos itens são mostrados de uma vez.

    // 3. Funções Principais
    //----------------------------------------------------------------------

    // Função assíncrona para buscar livros da API Open Library.
    const fetchBooks = async (page) => {
        try {
            // Constrói a URL da API com o tema e a página corretos.
            // O "offset" é usado para pular a quantidade de livros já carregados.
            const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=10&offset=${(page - 1) * 10}`);
            const data = await response.json(); // Converte a resposta para JSON.
            return data.works; // Retorna a lista de obras (livros).
        } catch (error) {
            // Em caso de erro, exibe uma mensagem no console.
            console.error('Erro ao buscar livros:', error);
            return []; // Retorna um array vazio para evitar quebras no código.
        }
    };

    // Função para criar um card de livro (o elemento HTML que exibe o livro).
    const createBookCard = (book) => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        // Pega o ID da capa. Se não existir, usa uma imagem de placeholder.
        const coverId = book.cover_id;
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/200x300?text=Sem+Capa';
        
        // Pega o nome do autor. Se não existir, define como 'Autor Desconhecido'.
        const authorName = book.authors && book.authors[0] ? book.authors[0].name : 'Autor Desconhecido';
        
        // Gera um preço aleatório.
        const price = (Math.random() * (50 - 15) + 15).toFixed(2);

        // Insere o HTML dentro do card do livro, usando as informações obtidas.
        bookCard.innerHTML = `
            <img src="${coverUrl}" alt="Capa do livro">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${authorName}</p>
            <p class="book-price">R$ ${price}</p>
        `;

        return bookCard; // Retorna o card completo.
    };

    // Função para atualizar a posição do carrossel.
    const updateCarouselPosition = () => {
        // Calcula a largura de um card de livro, incluindo o espaço (gap) entre eles.
        const itemWidth = document.querySelector('.book-card').offsetWidth + 20;
        
        // Calcula o quanto o carrossel deve se mover horizontalmente.
        const offset = -currentIndex * itemWidth;
        
        // Aplica a transformação CSS para mover o carrossel.
        carouselTrack.style.transform = `translateX(${offset}px)`;
        
        // Habilita ou desabilita os botões de navegação.
        // O botão 'anterior' é desabilitado quando estamos no início.
        prevButton.disabled = currentIndex === 0;
        // O botão 'próximo' é desabilitado quando chegamos ao final.
        nextButton.disabled = currentIndex >= carouselTrack.children.length - itemsPerPage;
    };

    // Função para renderizar (exibir) os primeiros livros.
    const renderBooks = async () => {
        // Busca a primeira página de livros.
        const books = await fetchBooks(1);
        
        // Para cada livro, cria um card e o adiciona ao carrossel.
        books.forEach(book => {
            const bookCard = createBookCard(book);
            carouselTrack.appendChild(bookCard);
        });
        
        // Atualiza a posição do carrossel para garantir que tudo esteja no lugar certo.
        updateCarouselPosition();
    };

    // 4. Listeners de Eventos
    //----------------------------------------------------------------------
    
    // Ouve o clique no botão 'próximo'.
    nextButton.addEventListener('click', () => {
        // Se ainda não chegamos ao final, incrementa o índice e move o carrossel.
        if (currentIndex < carouselTrack.children.length - itemsPerPage) {
            currentIndex++;
            updateCarouselPosition();
        }
    });

    // Ouve o clique no botão 'anterior'.
    prevButton.addEventListener('click', () => {
        // Se não estamos no início, decrementa o índice e move o carrossel.
        if (currentIndex > 0) {
            currentIndex--;
            updateCarouselPosition();
        }
    });

    // Ouve o clique no botão 'Mais livros'.
    let page = 2; // Começa na página 2, já que a página 1 foi carregada na inicialização.
    loadMoreBtn.addEventListener('click', async () => {
        // Busca a próxima página de livros.
        const newBooks = await fetchBooks(page);
        
        if (newBooks.length > 0) {
            // Se houver novos livros, adiciona-os ao carrossel.
            newBooks.forEach(book => {
                const bookCard = createBookCard(book);
                carouselTrack.appendChild(bookCard);
            });
            page++; // Incrementa o contador de página para a próxima busca.
        } else {
            // Se não houver mais livros, desabilita o botão e muda o texto.
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Sem mais livros';
        }
        updateCarouselPosition(); // Atualiza a posição após adicionar os novos livros.
    });

    // 5. Inicialização
    //----------------------------------------------------------------------
    
    // Chama a função para começar a renderizar os livros assim que a página carregar.
    renderBooks();
});