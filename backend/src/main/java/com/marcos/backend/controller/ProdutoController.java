package com.marcos.backend.controller;

import com.marcos.backend.documentation.ProdutoDocumentation;
import com.marcos.backend.entity.Produto;
import com.marcos.backend.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController implements ProdutoDocumentation {
	private final ProdutoService service;
	public ProdutoController(ProdutoService service){this.service = service;}

	@GetMapping
	public List<Produto> listAll() {
		return service.listAll();
	}

	@GetMapping("/{id}")
	public Produto findById(@PathVariable Integer id) {
		return service.findById(id);
	}

	@PostMapping
	public Produto criarProduto(@Valid @RequestBody Produto produto) {
		var saved = service.salvar(produto);
		service.invalidateCache();
		return saved;
	}

	@PutMapping("/{id}")
	public Produto atualizarProduto(@PathVariable Integer id,@RequestBody Produto produto) {
		produto.setId(id);
		return service.atualizar(produto);
	}
}
