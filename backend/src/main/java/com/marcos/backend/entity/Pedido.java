package com.marcos.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="pedidos")
public class Pedido {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
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

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDateTime getCriacao() {
		return criacao;
	}

	public void setCriacao(LocalDateTime criacao) {
		this.criacao = criacao;
	}

	public StatusPedido getStatus() {
		return status;
	}

	public void setStatus(StatusPedido status) {
		this.status = status;
	}

	public List<ItemPedido> getItems() {
		return items;
	}

	public void setItems(List<ItemPedido> items) {
		this.items = items;
	}
}
