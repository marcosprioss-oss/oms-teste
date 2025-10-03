package com.marcos.backend.documentation;

import com.marcos.backend.entity.Produto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.Table;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Produtos", description = "Documentação relacionada a Produtos")
@RequestMapping("/produtos")
public interface ProdutoDocumentation {

	@Operation(summary = "Listar todos os produtos")
	@GetMapping
	List<Produto> listAll();

	@Operation(summary = "Buscar produto por ID")
	@GetMapping("/{id}")
	Produto findById(@PathVariable Integer id);

	@Operation(summary = "Cria um novo produto")
	@PostMapping
	Produto criarProduto(@RequestBody Produto produto);

	@Operation(summary = "Atualiza um produto existente")
	@PutMapping("/{id}")
	Produto atualizarProduto(@PathVariable Integer id, @RequestBody Produto produto);

}
