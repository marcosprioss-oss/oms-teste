package com.marcos.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
	@Bean
	public OpenAPI apiInfo() {
		return new OpenAPI().info(new Info().title("Teste Tecnico - OMS")
				.version("1.0.0")
				.description("API para teste de tecnico, gerenciando pedidos de produtos"));
	}

	@Bean
	public GroupedOpenApi publicApi() {
		return GroupedOpenApi.builder().group("public-api").pathsToMatch("/**").build();
	}

}


