package com.marcos.backend.controller;

import com.marcos.backend.documentation.PedidoDocumentation;
import com.marcos.backend.dto.PageResponse;
import com.marcos.backend.dto.StatusResumoDTO;
import com.marcos.backend.entity.Pedido;
import com.marcos.backend.entity.StatusPedido;
import com.marcos.backend.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController implements PedidoDocumentation {

	private final PedidoService service;
	public PedidoController(PedidoService service) {
		this.service = service;
	}

	@GetMapping
	@Override
	public PageResponse<Pedido> listarPedidos(@RequestParam(defaultValue = "0") int page,
											  @RequestParam(defaultValue = "10") int size) {
		return service.listPedidos(page,size);
	}

	@Override
	@GetMapping("/{id}")
	public Pedido buscarPedido(@PathVariable Integer id) {
		return service.getPedido(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
	}

	@PostMapping("/{id}")
	@Override
	public Pedido alteraStatus(@PathVariable Integer id, @RequestBody StatusPedido status) {
		return service.alteraStatus(id, status);
	}

	@Override
	@PostMapping
	public Pedido criarPedido(@RequestBody Pedido pedido) {
		var o = service.criarPedido(pedido);
		service.invalidateCache();
		return ResponseEntity.status(HttpStatus.CREATED).body(o).getBody();
	}

	@Override
	@PostMapping("/{id}/cancelar")
	public ResponseEntity<Object> cancelaPedido(@PathVariable Integer id) {
		service.cancelaPedido(id);
		return ResponseEntity.noContent().build();
	}


	@GetMapping("/estatisticas")
	public List<StatusResumoDTO> obterResumoStatus(){
		return service.obterResumoStatus();
	}
}
