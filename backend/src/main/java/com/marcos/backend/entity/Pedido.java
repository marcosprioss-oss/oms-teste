package com.marcos.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="pedidos")
public class Pedido {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private LocalDateTime criacao;

	@Enumerated(EnumType.STRING)
	private StatusPedido status;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ItemPedido> items = new ArrayList<>();

	public Double getTotal(){
		return items.stream().mapToDouble(item -> item.getProduto().getPreco() * item.getQuantidade()).sum();
	}
	@PrePersist
	public void prePersist() {
		if (criacao == null) criacao = LocalDateTime.now();
		if (status == null) status = StatusPedido.Pendente;
	}

}
