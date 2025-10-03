package com.marcos.backend.service;

import com.marcos.backend.entity.Produto;
import com.marcos.backend.repository.ProdutoRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {
	private final ProdutoRepository produtoRepository;
	public ProdutoService(ProdutoRepository produtoRepository) {
		this.produtoRepository = produtoRepository;
	}

	public Produto salvar(Produto produto) {
		return produtoRepository.save(produto);
	}

	@Cacheable(value = "produtos")
	public List<Produto> listAll(){ return produtoRepository.findAll(); }

	@CacheEvict(value = "produtos", allEntries = true)
	public void invalidateCache(){}

	public Produto findById(Integer id){ return produtoRepository.findById(id).orElse(null); }

	@CacheEvict(value = "produtos", allEntries = true)
	public Produto atualizar(Produto produto) {
		if (!produtoRepository.existsById(produto.getId())) {
			throw new RuntimeException("Produto não encontrado");
		}
		return produtoRepository.save(produto);
	}

}
