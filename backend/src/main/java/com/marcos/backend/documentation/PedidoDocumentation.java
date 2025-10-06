package com.marcos.backend.documentation;

import com.marcos.backend.dto.PageResponse;
import com.marcos.backend.entity.Pedido;
import com.marcos.backend.entity.StatusPedido;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Tag(name = "Pedidos", description = "Documentação relacionada a Pedidos")
public interface PedidoDocumentation {

	@Operation(summary = "Lista todos os pedidos")
	PageResponse<Pedido> listarPedidos(int page,int size);

	@Operation(summary = "Busca um pedido por ID")
	Pedido buscarPedido(Integer id);

	@Operation(summary = "Cria um novo pedido")
	Pedido criarPedido(Pedido pedido);

	@Operation(summary = "Cancela um pedido")
	ResponseEntity<Object> cancelaPedido(Integer id);

	@Operation(summary = "Altera o status de um pedido")
	Pedido alteraStatus(Integer id, StatusPedido status);
}
