package com.lch.topick.web.client.def.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.client.def.entity.Client;
import com.lch.topick.web.client.def.repository.ClientRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value="/api/client")
@RequiredArgsConstructor
public class ClientController {
	
	private final ClientRepository clientRepository;
	
	@GetMapping
	public List<Client> clientList() {
		
		return clientRepository.findAll();
	}
	
	
}//class
