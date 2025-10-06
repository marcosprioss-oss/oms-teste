package com.marcos.backend.service;

import com.marcos.backend.dto.PageResponse;
import com.marcos.backend.entity.Produto;
import com.marcos.backend.repository.ProdutoRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.*;
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

	public PageResponse<Produto> listAll(int page, int size){
		PageRequest pageRequest = PageRequest.of(page, size, Sort.by("nome").ascending());
		Page<Produto> pageResult = produtoRepository.findAll(pageRequest);

		return new PageResponse<>(pageResult.getContent(),
				pageResult.getTotalPages(),
				pageResult.getTotalElements(),
				pageResult.getNumber(),
				pageResult.getSize(),
				pageResult.isFirst(),
				pageResult.isLast()
		);
	}

	@CacheEvict(value = "produtos", allEntries = true)
	public void invalidateCache(){}

	public Produto findById(Integer id){ return produtoRepository.findById(id).orElse(null); }

	public Produto atualizar(Produto produto) {
		if (!produtoRepository.existsById(produto.getId())) {
			throw new RuntimeException("Produto não encontrado");
		}
		invalidateCache();
		return produtoRepository.save(produto);
	}

}
