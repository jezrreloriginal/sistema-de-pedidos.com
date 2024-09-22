let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let pedidoAtual = [];

// Função para exibir notificações
function exibirNotificacao(mensagem, tipo = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = mensagem;
    notification.className = `notification ${tipo}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);

    setTimeout(() => {
        notification.style.display = 'none';
        notification.classList.remove('hidden');
    }, 3500);
}

// Função para abrir o modal e fazer novos pedidos
document.getElementById('addPedidoBtn').addEventListener('click', function () {
    pedidoAtual = [];
    document.getElementById('numeroPedido').value = '';
    document.getElementById('clienteNome').value = '';
    abrirModal();
});

// Função para abrir o modal de pedidos
function abrirModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    const produtoLista = document.getElementById('searchResults');
    produtoLista.innerHTML = '';
}

// Função para adicionar produto ao pedido atual (sem duplicação)
document.getElementById('addProdutoBtn').addEventListener('click', function () {
    const nomeProduto = document.getElementById('itemPedido').value;
    const precoProduto = parseFloat(document.getElementById('itemPreco').value);

    if (!nomeProduto || isNaN(precoProduto)) {
        exibirNotificacao("Selecione um produto válido.", 'error');
        return;
    }

    const produtoExistente = pedidoAtual.find(p => p.nome === nomeProduto);

    if (produtoExistente) {
        exibirNotificacao("Este produto já está no pedido.", 'error');
    } else {
        pedidoAtual.push({ nome: nomeProduto, preco: precoProduto });
        atualizarListaPedido();
        exibirNotificacao("Produto adicionado ao pedido!", 'success');
    }
});

// Função para atualizar a lista de produtos do pedido
function atualizarListaPedido() {
    const pedidoLista = document.getElementById('listaProdutos');
    pedidoLista.innerHTML = '';

    let total = 0;

    pedidoAtual.forEach((produto, index) => {
        total += produto.preco;
        const li = document.createElement('li');
        li.textContent = `${produto.nome} - R$${produto.preco.toFixed(2)}`;

        const removerBtn = document.createElement('button');
        removerBtn.textContent = 'Remover';
        removerBtn.onclick = () => {
            removerProdutoPedido(index);
        };
        li.appendChild(removerBtn);

        pedidoLista.appendChild(li);
    });

    document.getElementById('totalPedido').textContent = `Total: R$${total.toFixed(2)}`;
}

// Função para remover produto do pedido
function removerProdutoPedido(index) {
    pedidoAtual.splice(index, 1);
    atualizarListaPedido();
    exibirNotificacao("Produto removido do pedido.", 'success');
}

// Função para confirmar o pedido
document.getElementById('confirmarPedido').addEventListener('click', function () {
    const numeroPedido = document.getElementById('numeroPedido').value;
    const clienteNome = document.getElementById('clienteNome').value;

    if (!numeroPedido || !clienteNome || pedidoAtual.length === 0) {
        exibirNotificacao("Preencha todos os campos e adicione produtos ao pedido.", 'error');
        return;
    }

    const novoPedido = {
        numeroPedido,
        clienteNome,
        pedido: pedidoAtual,
        dataHora: new Date().toLocaleString()
    };

    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    fecharModal();
    atualizarListaPedidos();

    exibirNotificacao("Pedido confirmado com sucesso!", 'success');
});

// Função para fechar o modal de pedidos
function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Função para atualizar a lista de pedidos no sistema
function atualizarListaPedidos() {
    const pedidosContainer = document.getElementById('pedidosContainer');
    pedidosContainer.innerHTML = '';

    pedidos.forEach(pedido => {
        const div = document.createElement('div');
        div.classList.add('pedido');
        div.innerHTML = `
            <h3>Pedido ${pedido.numeroPedido}</h3>
            <p>${pedido.dataHora}</p>
            <ul>
                ${pedido.pedido.map(produto => `<li>${produto.nome} - R$${produto.preco.toFixed(2)}</li>`).join('')}
            </ul>
            <strong>Total: R$${pedido.pedido.reduce((total, produto) => total + parseFloat(produto.preco), 0).toFixed(2)}</strong>
        `;
        pedidosContainer.appendChild(div);
    });
}

// Função para exibir pedidos feitos nas últimas 48 horas e separá-los por dia
document.getElementById('verHistoricoBtn').addEventListener('click', function () {
    const historicoContainer = document.getElementById('historicoContainer');
    historicoContainer.style.display = 'block';
    historicoContainer.innerHTML = '';

    const agora = new Date();
    const doisDiasAtras = new Date(agora.getTime() - (48 * 60 * 60 * 1000)); // 48 horas atrás

    const pedidosFiltrados = pedidos.filter(pedido => {
        const dataPedido = new Date(pedido.dataHora);
        return dataPedido >= doisDiasAtras;
    });

    const pedidosPorDia = {};

    pedidosFiltrados.forEach(pedido => {
        const dataPedido = new Date(pedido.dataHora).toLocaleDateString();
        if (!pedidosPorDia[dataPedido]) {
            pedidosPorDia[dataPedido] = [];
        }
        pedidosPorDia[dataPedido].push(pedido);
    });

    for (const [dia, pedidosDoDia] of Object.entries(pedidosPorDia)) {
        const divDia = document.createElement('div');
        divDia.innerHTML = `<h3>Pedidos de ${dia}</h3>`;
        pedidosDoDia.forEach(pedido => {
            const divPedido = document.createElement('div');
            divPedido.classList.add('historico-pedido');
            divPedido.innerHTML = `
                <h4>Pedido ${pedido.numeroPedido}</h4>
                <p>${pedido.dataHora}</p>
                <ul>
                    ${pedido.pedido.map(produto => `<li>${produto.nome} - R$${produto.preco.toFixed(2)}</li>`).join('')}
                </ul>
                <strong>Total: R$${pedido.pedido.reduce((total, produto) => total + parseFloat(produto.preco), 0).toFixed(2)}</strong>
            `;
            divDia.appendChild(divPedido);
        });
        historicoContainer.appendChild(divDia);
    }
});

// Função para consultar o histórico completo de um cliente pelo número do pedido
document.getElementById('consultarClientesBtn').addEventListener('click', function () {
    const numeroPedido = prompt("Digite o número do pedido:");
    const pedidoCliente = pedidos.find(pedido => pedido.numeroPedido === numeroPedido);

    if (!pedidoCliente) {
        exibirNotificacao("Nenhum pedido encontrado para esse número.", 'error');
        return;
    }

    const clienteContainer = document.getElementById('clientesContainer');
    clienteContainer.style.display = 'block';
    clienteContainer.innerHTML = '';

    const divPedido = document.createElement('div');
    divPedido.innerHTML = `
        <h3>Pedido ${pedidoCliente.numeroPedido} - ${pedidoCliente.clienteNome}</h3>
        <p>${pedidoCliente.dataHora}</p>
        <ul>
            ${pedidoCliente.pedido.map(produto => `<li>${produto.nome} - R$${produto.preco.toFixed(2)}</li>`).join('')}
        </ul>
        <strong>Total: R$${pedidoCliente.pedido.reduce((total, produto) => total + parseFloat(produto.preco), 0).toFixed(2)}</strong>
    `;
    clienteContainer.appendChild(divPedido);
});
