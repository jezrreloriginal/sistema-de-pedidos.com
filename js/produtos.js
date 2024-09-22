let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

// Função para carregar a lista de produtos na tela
function atualizarListaProdutos() {
    const produtoLista = document.getElementById('produtoLista');
    produtoLista.innerHTML = '';
    produtos.forEach((produto, index) => {
        const li = document.createElement('li');
        li.textContent = `${produto.nome} - R$${produto.preco}`;
        li.onclick = () => selecionarProduto(index);
        produtoLista.appendChild(li);
    });
}

// Função para adicionar um novo produto
document.getElementById('produtoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value;

    const novoProduto = {
        nome, preco, categoria, descricao
    };

    if (document.getElementById('produtoId').value) {
        produtos[document.getElementById('produtoId').value] = novoProduto;
        document.getElementById('adicionarProduto').style.display = 'inline';
        document.getElementById('editarProduto').style.display = 'none';
        document.getElementById('excluirProduto').style.display = 'none';
    } else {
        produtos.push(novoProduto);
    }

    localStorage.setItem('produtos', JSON.stringify(produtos));
    atualizarListaProdutos();
    document.getElementById('produtoForm').reset();
});

// Função para selecionar um produto para edição
function selecionarProduto(index) {
    const produto = produtos[index];
    document.getElementById('nome').value = produto.nome;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('categoria').value = produto.categoria;
    document.getElementById('descricao').value = produto.descricao;
    document.getElementById('produtoId').value = index;

    document.getElementById('adicionarProduto').style.display = 'none';
    document.getElementById('editarProduto').style.display = 'inline';
    document.getElementById('excluirProduto').style.display = 'inline';
}

// Função para salvar as alterações de um produto existente
document.getElementById('editarProduto').addEventListener('click', function () {
    const index = document.getElementById('produtoId').value;
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value;

    produtos[index] = { nome, preco, categoria, descricao };
    localStorage.setItem('produtos', JSON.stringify(produtos));
    atualizarListaProdutos();
    document.getElementById('produtoForm').reset();
    document.getElementById('adicionarProduto').style.display = 'inline';
    document.getElementById('editarProduto').style.display = 'none';
    document.getElementById('excluirProduto').style.display = 'none';
});

// Função para excluir um produto
document.getElementById('excluirProduto').addEventListener('click', function () {
    const index = document.getElementById('produtoId').value;
    produtos.splice(index, 1);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    atualizarListaProdutos();
    document.getElementById('produtoForm').reset();
    document.getElementById('adicionarProduto').style.display = 'inline';
    document.getElementById('editarProduto').style.display = 'none';
    document.getElementById('excluirProduto').style.display = 'none';
});

// Função para pesquisar produtos
document.getElementById('searchBar').addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    produtos
        .filter(produto => produto.nome.toLowerCase().includes(query))
        .forEach((produto, index) => {
            const li = document.createElement('li');
            li.textContent = `${produto.nome} - R$${produto.preco}`;
            li.onclick = () => selecionarProduto(index);
            searchResults.appendChild(li);
        });
});

atualizarListaProdutos();
