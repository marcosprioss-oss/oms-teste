package com.marcos.backend.config;

import org.springframework.context.annotation.*;
import org.springframework.data.redis.connection.*;
import org.springframework.data.redis.connection.lettuce.*;
import org.springframework.data.redis.core.*;
import org.springframework.cache.annotation.*;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.cache.*;

@Configuration
public class CacheConfig {

	@Bean
	public RedisConnectionFactory redisConnectionFactory(){
		return new LettuceConnectionFactory();
	}

	@Bean
	public RedisTemplate<String, Object> redisTemplate(){
		RedisTemplate<String, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(redisConnectionFactory());
		return template;
	}

	@Bean
	public CacheManager cacheManager(RedisConnectionFactory cf) {
		return RedisCacheManager.builder(cf).build();
	}

}
