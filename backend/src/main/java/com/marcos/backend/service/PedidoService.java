package com.marcos.backend.service;

import com.marcos.backend.entity.Pedido;
import com.marcos.backend.entity.Produto;
import com.marcos.backend.entity.StatusPedido;
import com.marcos.backend.repository.PedidoRepository;
import com.marcos.backend.repository.ProdutoRepository;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {
	private final PedidoRepository pedidoRepository;
	private final ProdutoRepository produtoRepository;
	private final CacheManager cacheManager;

	public PedidoService(PedidoRepository pedidoRepository, ProdutoRepository produtoRepository, CacheManager cacheManager) {
		this.pedidoRepository = pedidoRepository;
		this.produtoRepository = produtoRepository;
		this.cacheManager = cacheManager;
	}

	@Transactional
	public Pedido criarPedido(Pedido pedido) {
		pedido.getItems().forEach(item -> {
			Produto p = produtoRepository.findById(item.getProduto().getId())
					.orElseThrow(() -> new RuntimeException("Produto não encontrado"));
			item.setProduto(p);
		});
		return pedidoRepository.save(pedido);
	}

	@Cacheable(value = "pedidos")
	public List<Pedido> listPedidos() { return pedidoRepository.findAll(); }

	@CacheEvict(value = "pedidos", allEntries = true)
	public void invalidateCache(){}

	public Optional<Pedido> getPedido(Integer id){ return pedidoRepository.findById(id); }

	@Transactional
	@CacheEvict(value = "pedidos", key = "#id")
	public void cancelaPedido(Integer id){
		pedidoRepository.findById(id).ifPresent(o -> {
			if (o.getStatus() != StatusPedido.Enviado && o.getStatus() != StatusPedido.Entregue) {
				o.setStatus(StatusPedido.Cancelado);
				pedidoRepository.save(o);
			}
		});
	}

	@Transactional
	@CacheEvict(value = "pedidos", key = "#id")
	public Pedido alteraStatus(Integer id, StatusPedido status){
		Pedido pedido = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
		if(status.equals(StatusPedido.Pendente)) new RuntimeException("Pedido em Processamento, por favor aguarde");
		pedido.setStatus(status);
		if(status.equals(StatusPedido.Enviado)){
			pedido.getItems().stream().forEach( p ->{
				var produto = produtoRepository.findById(p.getProduto().getId()).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
				produto.setQuantidade(produto.getQuantidade() - p.getQuantidade());
				produtoRepository.save(produto);
				cacheManager.getCache("produtos").evict(produto.getId());
			});
		}
		return pedidoRepository.save(pedido);
	}

}
