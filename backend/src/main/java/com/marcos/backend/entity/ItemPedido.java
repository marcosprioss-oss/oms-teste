package com.marcos.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


@Entity
public class ItemPedido {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(optional = false)
	private Produto produto;

	private Integer quantidade;

	@ManyToOne
	@JoinColumn(name = "pedido_id")
	@JsonIgnore
	private Pedido pedido;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Produto getProduto() {
		return produto;
	}

	public void setProduto(Produto produto) {
		this.produto = produto;
	}

	public Integer getQuantidade() {
		return quantidade;
	}

	public void setQuantidade(Integer quantidade) {
		this.quantidade = quantidade;
	}

	public Pedido getPedido() {
		return pedido;
	}

	public void setPedido(Pedido pedido) {
		this.pedido = pedido;
	}

	public ItemPedido() {
	}

	public ItemPedido(Integer id, Produto produto, Integer quantidade) {
		this.id         = id;
		this.produto    = produto;
		this.quantidade = quantidade;
	}
}