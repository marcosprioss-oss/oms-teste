package com.marcos.backend.documentation;

import com.marcos.backend.entity.Pedido;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Pedidos", description = "Documentação relacionada a Pedidos")
public interface PedidoDocumentation {

	@Operation(summary = "Lista todos os pedidos")
	List<Pedido> listarPedidos();

	@Operation(summary = "Busca um pedido por ID")
	Pedido buscarPedido(Long id);

	@Operation(summary = "Cria um novo pedido")
	Pedido criarPedido(Pedido pedido);

	@Operation(summary = "Atualiza um pedido existente")
	Pedido atualizarPedido(Long id,Pedido pedido);

	@Operation(summary = "Cancela um pedido")
	void cancelaPedido(Long id);
}
