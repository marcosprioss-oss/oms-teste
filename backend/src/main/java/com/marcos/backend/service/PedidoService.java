package com.marcos.backend.service;

import com.marcos.backend.dto.PageResponse;
import com.marcos.backend.dto.StatusResumoDTO;
import com.marcos.backend.entity.Pedido;
import com.marcos.backend.entity.Produto;
import com.marcos.backend.entity.StatusPedido;
import com.marcos.backend.repository.PedidoRepository;
import com.marcos.backend.repository.ProdutoRepository;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
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
			item.setPedido(pedido);
		});
		return pedidoRepository.save(pedido);
	}

	public PageResponse<Pedido> listPedidos(int page,int size) {
		PageRequest pageRequest = PageRequest.of(page, size, Sort.by("criacao").descending());
		Page<Pedido> pageResult = pedidoRepository.findAll(pageRequest);

		return new PageResponse<>(pageResult.getContent(),
				pageResult.getTotalPages(),
				pageResult.getTotalElements(),
				pageResult.getNumber(),
				pageResult.getSize(),
				pageResult.isFirst(),
				pageResult.isLast()
		);
	}

	@CacheEvict(value = "pedidos", allEntries = true)
	public void invalidateCache(){}

	public Optional<Pedido> getPedido(Integer id){ return pedidoRepository.findById(id); }

	@Transactional
	@CacheEvict(value = "pedidos", key = "#id")
	public void cancelaPedido(Integer id){
		pedidoRepository.findById(id).ifPresent(o -> {
			if (o.getStatus() != StatusPedido.ENVIADO && o.getStatus() != StatusPedido.ENTREGUE) {
				o.setStatus(StatusPedido.CANCELADO);
				pedidoRepository.save(o);
			}
		});
	}

	@Transactional
	@CacheEvict(value = "pedidos", key = "#id")
	public Pedido alteraStatus(Integer id, StatusPedido status){
		Pedido pedido = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
		if(status.equals(StatusPedido.PENDENTE)) new RuntimeException("Pedido em Processamento, por favor aguarde");
		pedido.setStatus(status);
		if(status.equals(StatusPedido.ENVIADO)){
			pedido.getItems().stream().forEach( p ->{
				var produto = produtoRepository.findById(p.getProduto().getId()).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
				produto.setQuantidade(produto.getQuantidade() - p.getQuantidade());
				produtoRepository.save(produto);
				cacheManager.getCache("produtos").evict(produto.getId());
			});
		}
		return pedidoRepository.save(pedido);
	}


	public List<StatusResumoDTO> obterResumoStatus() {
		Map<StatusPedido, Long> contagem = new EnumMap<>(StatusPedido.class);
		for (StatusPedido status : StatusPedido.values()) {
			contagem.put(status, 0L);
		}

		for (Object[] row : pedidoRepository.countPedidosPorStatus()) {
			StatusPedido status = (StatusPedido) row[0];
			Long count = (Long) row[1];
			contagem.put(status, count);
		}

		return contagem.entrySet().stream()
				.map(e -> new StatusResumoDTO(e.getKey(), e.getValue()))
				.toList();
	}

}
