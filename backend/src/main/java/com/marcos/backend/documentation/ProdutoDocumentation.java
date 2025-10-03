package com.marcos.backend.documentation;

import com.marcos.backend.entity.Produto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Produtos", description = "Documentação relacionada a Produtos")
public interface ProdutoDocumentation {

	@Operation(summary = "Listar todos os produtos")
	public abstract List<Produto> listAll();

	@Operation(summary = "Buscar produto por ID")
	public abstract Produto findById(Integer id);

	@Operation(summary = "Cria um novo produto")
	public abstract Produto criarProduto(Produto produto);

	@Operation(summary = "Atualiza um produto existente")
	public abstract Produto atualizarProduto(Integer id, Produto produto);

}
