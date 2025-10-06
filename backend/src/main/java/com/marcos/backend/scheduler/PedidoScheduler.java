package com.marcos.backend.scheduler;

import com.marcos.backend.entity.ItemPedido;
import com.marcos.backend.entity.Pedido;
import com.marcos.backend.entity.StatusPedido;
import com.marcos.backend.repository.PedidoRepository;
import com.marcos.backend.repository.ProdutoRepository;
import com.marcos.backend.service.PedidoService;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class PedidoScheduler {
	private final PedidoRepository repo;
	private final ProdutoRepository produtoRepo;
	private final CacheManager cacheManager;
	private final org.slf4j.Logger log = LoggerFactory.getLogger(PedidoScheduler.class);

	public PedidoScheduler(PedidoRepository repo, ProdutoRepository produs, CacheManager cacheManager){
		this.repo = repo;
		this.produtoRepo = produs;
		this.cacheManager = cacheManager;
	}

	@Scheduled(fixedRateString = "${pedidos.job.rate:120000}")
	@Transactional
	public void processoaPedidos(){
		List<Pedido> pendentes = repo.findByStatus(StatusPedido.PENDENTE);
		pendentes.stream().forEach(o->{
			boolean ok = true;
			for (ItemPedido ip : o.getItems()) {
				var produto = produtoRepo.findById(ip.getProduto().getId()).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
				if (produto.getQuantidade() < ip.getQuantidade()) {
					ok = false;
					break;
				}else{
					produto.setQuantidade(produto.getQuantidade() - ip.getQuantidade());
					produtoRepo.save(produto);
					cacheManager.getCache("produtos").evict(produto.getId());
				}
			}
			if (ok) {
				o.setStatus(StatusPedido.PROCESSANDO);
				log.info("Pedido {} -> PROCESSANDO", o.getId());
			} else {
				o.setStatus(StatusPedido.CANCELADO);
				log.info("Pedido {} -> CANCELADO (estoque insuficiente)", o.getId());
			}
			repo.save(o);
		});

	}

}
