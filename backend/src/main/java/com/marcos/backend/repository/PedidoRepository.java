package com.marcos.backend.repository;

import com.marcos.backend.entity.Pedido;
import com.marcos.backend.entity.StatusPedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido,Integer> {
	List<Pedido> findByStatus(StatusPedido status);
	Page<Pedido> findByStatus(Pedido status, Pageable pageable);
	List<Pedido> findByCriacaoBetween(LocalDateTime from, LocalDateTime to);
}
