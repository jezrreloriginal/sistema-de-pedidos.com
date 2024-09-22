const pedidosContainer = document.getElementById('pedidosContainer');

function carregarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    pedidosContainer.innerHTML = '';
    pedidos.forEach(pedido => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>Pedido #${pedido.numero}</h3>
            <p>Cliente: ${pedido.nome}</p>
            <p>Data e Hora: ${pedido.dataHora}</p>
            <p>Produtos:</p>
            <ul>
                ${pedido.produtos.map(prod => `<li>${prod.nome} - R$${prod.preco.toFixed(2)}</li>`).join('')}
            </ul>
            <p>Total: R$${pedido.total.toFixed(2)}</p>
        `;
        pedidosContainer.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', carregarPedidos);
