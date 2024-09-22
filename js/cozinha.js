const pedidosContainerCozinha = document.getElementById('pedidosContainerCozinha');

function carregarPedidosCozinha() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    pedidosContainerCozinha.innerHTML = '';
    pedidos.forEach(pedido => {
        const produtosAlimentos = pedido.produtos.filter(prod => prod.tipo === 'alimento');

        if (produtosAlimentos.length > 0) {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>Pedido #${pedido.numero}</h3>
                <p>Cliente: ${pedido.nome}</p>
                <p>Data e Hora: ${pedido.dataHora}</p>
                <p>Produtos:</p>
                <ul>
                    ${produtosAlimentos.map(prod => `<li>${prod.nome} - R$${prod.preco.toFixed(2)}</li>`).join('')}
                </ul>
            `;
            pedidosContainerCozinha.appendChild(div);
        }
    });
}

document.addEventListener('DOMContentLoaded', carregarPedidosCozinha);
