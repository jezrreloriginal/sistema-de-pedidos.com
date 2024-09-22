const pedidosContainerBar = document.getElementById('pedidosContainerBar');

function carregarPedidosBar() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    pedidosContainerBar.innerHTML = '';
    pedidos.forEach(pedido => {
        const produtosBebidas = pedido.produtos.filter(prod => prod.tipo === 'bebida');

        if (produtosBebidas.length > 0) {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>Pedido #${pedido.numero}</h3>
                <p>Cliente: ${pedido.nome}</p>
                <p>Data e Hora: ${pedido.dataHora}</p>
                <p>Produtos:</p>
                <ul>
                    ${produtosBebidas.map(prod => `<li>${prod.nome} - R$${prod.preco.toFixed(2)}</li>`).join('')}
                </ul>
            `;
            pedidosContainerBar.appendChild(div);
        }
    });
}

document.addEventListener('DOMContentLoaded', carregarPedidosBar);
