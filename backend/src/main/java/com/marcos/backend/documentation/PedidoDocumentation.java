package com.marcos.backend.documentation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Pedidos", description = "Documentação relacionada a Pedidos")
@RequestMapping("/pedidos")
public interface PedidoDocumentation {

	@Operation(summary = "Lista todos os pedidos")
	@GetMapping
	List<Object> listarPedidos();

	@Operation(summary = "Busca um pedido por ID")
	@GetMapping("/{id}")
	Object buscarPedido(@PathVariable Long id);

	@Operation(summary = "Cria um novo pedido")
	@PostMapping
	Object criarPedido(@RequestBody Object pedido);

	@Operation(summary = "Atualiza um pedido existente")
	@PutMapping("/{id}")
	Object atualizarPedido(@PathVariable Long id, @RequestBody Object pedido);

	@Operation(summary = "Cancela um pedido")
	@DeleteMapping("/{id}")
	void cancelaPedido(@PathVariable Long id);
}
